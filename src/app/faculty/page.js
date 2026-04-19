"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ─── Facility Coordinates ────────────────────────────────────────────────────
const HUB_LAT = 19.1759;
const HUB_LNG = 73.0229;
const GEOFENCE_RADIUS_M = 50;

// ─── Haversine Formula ────────────────────────────────────────────────────────
function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371000; // Earth radius in metres
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function FacultyPage() {
  // Memoize the supabase client so it doesn't get recreated on every render
  const supabase = useMemo(() => createClient(), []);
  const router = useRouter();

  // ── Auth / Role State ──────────────────────────────────────────────────────
  const [user, setUser]           = useState(null);
  const [role, setRole]           = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // ── Geofence State ─────────────────────────────────────────────────────────
  const [inRange, setInRange]         = useState(false);
  const [geoDistance, setGeoDistance] = useState(null);
  const [geoError, setGeoError]       = useState(null);
  const [geoLoading, setGeoLoading]   = useState(true);

  // ── Attendance State ───────────────────────────────────────────────────────
  const [isCheckedIn, setIsCheckedIn]     = useState(false);
  const [todayRecord, setTodayRecord]     = useState(null);
  const [attendanceLog, setAttendanceLog] = useState([]);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMsg, setActionMsg]         = useState(null);

  // ── Live Clock State ───────────────────────────────────────────────────────
  const [now, setNow] = useState(new Date());

  // ─── Live clock ticker ────────────────────────────────────────────────────
  useEffect(() => {
    const tick = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(tick);
  }, []);

  // ─── Auth + Role resolution ───────────────────────────────────────────────
  useEffect(() => {
    async function resolveAuth() {
      const { data: { user: u } } = await supabase.auth.getUser();
      if (!u) { setAuthLoading(false); return; }
      setUser(u);

      // Look up role from profiles table
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", u.id)
        .single();

      setRole(profile?.role ?? null);
      setAuthLoading(false);
    }
    resolveAuth();
  }, []);

  // ─── Continuous geolocation monitoring ─────────────────────────────────────
  // Uses watchPosition to track the teacher's location in real-time.
  // If they leave the 50m geofence while checked in, auto-checkout + sign-out.
  useEffect(() => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser.");
      setGeoLoading(false);
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const dist = haversineDistance(
          pos.coords.latitude,
          pos.coords.longitude,
          HUB_LAT,
          HUB_LNG
        );
        setGeoDistance(Math.round(dist));
        setInRange(dist <= GEOFENCE_RADIUS_M);
        setGeoLoading(false);
      },
      (err) => {
        setGeoError("Location access denied. Cannot verify proximity.");
        setGeoLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // ─── Auto-checkout + sign-out when teacher leaves geofence ────────────────
  useEffect(() => {
    if (!inRange && !geoLoading && !geoError && isCheckedIn && todayRecord && user) {
      (async () => {
        setActionLoading(true);
        try {
          // Auto check-out
          await supabase
            .from("teacher_attendance")
            .update({ check_out: new Date().toISOString() })
            .eq("id", todayRecord.id);

          // Sign out of Supabase
          await supabase.auth.signOut();

          alert("You have left the Taqwa Edu Hub premises. You have been automatically checked out and signed out.");
          router.push("/login");
        } catch (err) {
          console.error("Auto-checkout failed:", err);
          setActionMsg({ type: "error", text: "Auto-checkout failed. Please check out manually before leaving." });
        }
        setActionLoading(false);
      })();
    }
  }, [inRange, geoLoading, geoError, isCheckedIn, todayRecord, user, supabase, router]);

  // ─── Fetch today's attendance record ─────────────────────────────────────
  const fetchAttendance = useCallback(async (uid) => {
    const today = new Date().toISOString().split("T")[0];

    const { data: log } = await supabase
      .from("teacher_attendance")
      .select("*")
      .eq("teacher_id", uid)
      .order("check_in", { ascending: false })
      .limit(10);

    if (log) setAttendanceLog(log);

    const { data: rec } = await supabase
      .from("teacher_attendance")
      .select("*")
      .eq("teacher_id", uid)
      .gte("check_in", `${today}T00:00:00`)
      .lte("check_in", `${today}T23:59:59`)
      .order("check_in", { ascending: false })
      .limit(1)
      .single();

    if (rec) {
      setTodayRecord(rec);
      setIsCheckedIn(!rec.check_out);
    } else {
      setTodayRecord(null);
      setIsCheckedIn(false);
    }
  }, [supabase]);

  useEffect(() => {
    if (user) fetchAttendance(user.id);
  }, [user, fetchAttendance]);

  // ─── Check-In handler ─────────────────────────────────────────────────────
  async function handleCheckIn() {
    // Provide user feedback instead of silently returning
    if (geoLoading) {
      setActionMsg({ type: "error", text: "Still acquiring your location. Please wait..." });
      return;
    }
    if (geoError) {
      setActionMsg({ type: "error", text: "Location access is required for check-in. Please enable location services and refresh." });
      return;
    }
    if (!inRange) {
      setActionMsg({ type: "error", text: `You must be within ${GEOFENCE_RADIUS_M}m of Taqwa Edu Hub to check in. Current distance: ${geoDistance}m.` });
      return;
    }
    if (!user) {
      setActionMsg({ type: "error", text: "Authentication error. Please log in again." });
      return;
    }

    setActionLoading(true);
    setActionMsg(null);

    try {
      const { error } = await supabase
        .from("teacher_attendance")
        .insert({ teacher_id: user.id, check_in: new Date().toISOString() });

      if (error) {
        console.error("Check-in Supabase error:", error);
        setActionMsg({ type: "error", text: "Check-in failed: " + error.message });
      } else {
        setActionMsg({ type: "success", text: "✅ Checked in successfully!" });
        await fetchAttendance(user.id);
      }
    } catch (err) {
      console.error("Check-in unexpected error:", err);
      setActionMsg({ type: "error", text: "An unexpected error occurred during check-in. Please try again." });
    }
    setActionLoading(false);
  }

  // ─── Check-Out handler ────────────────────────────────────────────────────
  async function handleCheckOut() {
    if (geoLoading) {
      setActionMsg({ type: "error", text: "Still acquiring your location. Please wait..." });
      return;
    }
    if (geoError) {
      setActionMsg({ type: "error", text: "Location access is required for check-out. Please enable location services and refresh." });
      return;
    }
    if (!inRange) {
      setActionMsg({ type: "error", text: `You must be within ${GEOFENCE_RADIUS_M}m of Taqwa Edu Hub to check out. Current distance: ${geoDistance}m.` });
      return;
    }
    if (!todayRecord) {
      setActionMsg({ type: "error", text: "No active check-in found for today. Please check in first." });
      return;
    }

    setActionLoading(true);
    setActionMsg(null);

    try {
      const { error } = await supabase
        .from("teacher_attendance")
        .update({ check_out: new Date().toISOString() })
        .eq("id", todayRecord.id);

      if (error) {
        console.error("Check-out Supabase error:", error);
        setActionMsg({ type: "error", text: "Check-out failed: " + error.message });
      } else {
        setActionMsg({ type: "success", text: "✅ Checked out successfully!" });
        await fetchAttendance(user.id);
      }
    } catch (err) {
      console.error("Check-out unexpected error:", err);
      setActionMsg({ type: "error", text: "An unexpected error occurred during check-out. Please try again." });
    }
    setActionLoading(false);
  }

  // ─── Formatting helpers ───────────────────────────────────────────────────
  const fmtTime = (iso) =>
    iso
      ? new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : "—";
  const fmtDate = (iso) =>
    iso ? new Date(iso).toLocaleDateString([], { dateStyle: "medium" }) : "—";

  // ─── Loading screen ───────────────────────────────────────────────────────
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] dark:bg-gray-950">
        <p className="text-gray-500 dark:text-gray-400 font-medium animate-pulse">
          Verifying credentials...
        </p>
      </div>
    );
  }

  // ─── Not logged in ────────────────────────────────────────────────────────
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-[#F9FAFB] dark:bg-gray-950">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-10 text-center max-w-sm w-full shadow-sm">
            <div className="text-4xl mb-4">🔐</div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Authentication Required
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Please log in to access the Faculty portal.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ─── 403 — wrong role ─────────────────────────────────────────────────────
  if (role !== "teacher" && role !== "faculty" && role !== "admin") {
    return (
      <div className="min-h-screen flex flex-col bg-[#F9FAFB] dark:bg-gray-950">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-6">
          <div className="bg-white dark:bg-gray-900 border border-red-200 dark:border-red-800 rounded-2xl p-10 text-center max-w-sm w-full shadow-sm">
            <div className="text-4xl mb-4">🚫</div>
            <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">
              403 — Access Denied
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              This portal is restricted to verified faculty and administrators only.
            </p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ─── Main render ──────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB] dark:bg-gray-950 text-gray-900 dark:text-gray-100 transition-colors">
      <Navbar />

      <main className="flex-grow max-w-4xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        {/* Page header */}
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100">
            Faculty Time-Clock
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm font-medium">
            Welcome back, {user.email}
          </p>
        </div>

        {/* Live clock card */}
        <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 rounded-[2rem] p-8 mb-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)] text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">
            {now.toLocaleDateString([], { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
          <p className="text-6xl font-extrabold tracking-tight text-gray-900 dark:text-gray-100 tabular-nums">
            {now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
          </p>
        </div>

        {/* Geofence status card */}
        <div className={`rounded-[2rem] p-5 mb-6 border text-center font-semibold text-sm ${
          geoLoading
            ? "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400"
            : geoError
            ? "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400"
            : inRange
            ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400"
            : "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400"
        }`}>
          {geoLoading ? (
            <span className="animate-pulse">📡 Acquiring location...</span>
          ) : geoError ? (
            <span>⚠️ {geoError}</span>
          ) : inRange ? (
            <span>✅ In Range — {geoDistance}m from Taqwa Edu Hub</span>
          ) : (
            <span>
              🚫 Out of Range: You must be within 50m of the Hub to log attendance.{" "}
              <span className="opacity-70">(Current distance: {geoDistance}m)</span>
            </span>
          )}
        </div>

        {/* Action feedback */}
        {actionMsg && (
          <div className={`rounded-2xl px-5 py-3.5 mb-6 text-sm font-semibold border ${
            actionMsg.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400"
              : "bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400"
          }`}>
            {actionMsg.text}
          </div>
        )}

        {/* Today's status + action buttons */}
        <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 rounded-[2rem] p-8 mb-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)]">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-5">
            Today's Attendance
          </h2>

          <div className="grid grid-cols-2 gap-4 mb-7">
            <div className="bg-gray-50 dark:bg-gray-800/60 rounded-2xl p-4 text-center border border-gray-100 dark:border-gray-700/50">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">Check-In</p>
              <p className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 tabular-nums">
                {todayRecord ? fmtTime(todayRecord.check_in) : "—"}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800/60 rounded-2xl p-4 text-center border border-gray-100 dark:border-gray-700/50">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1">Check-Out</p>
              <p className="text-2xl font-extrabold text-gray-900 dark:text-gray-100 tabular-nums">
                {todayRecord?.check_out ? fmtTime(todayRecord.check_out) : "—"}
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            {/* CHECK IN */}
            <button
              id="btn-check-in"
              onClick={handleCheckIn}
              disabled={!inRange || isCheckedIn || actionLoading || geoLoading || !!geoError}
              className="flex-1 py-4 rounded-2xl font-bold text-sm transition-all shadow-md
                bg-gray-900 dark:bg-white text-white dark:text-gray-900
                hover:shadow-lg hover:-translate-y-0.5
                disabled:opacity-40 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none"
            >
              {actionLoading && !isCheckedIn ? "..." : "Check In"}
            </button>

            {/* CHECK OUT */}
            <button
              id="btn-check-out"
              onClick={handleCheckOut}
              disabled={!inRange || !isCheckedIn || actionLoading || geoLoading || !!geoError}
              className="flex-1 py-4 rounded-2xl font-bold text-sm transition-all shadow-sm
                bg-white/50 dark:bg-gray-800/50 backdrop-blur-md
                text-gray-900 dark:text-gray-100
                border border-gray-200/50 dark:border-gray-700/50
                hover:bg-white dark:hover:bg-gray-700
                disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {actionLoading && isCheckedIn ? "..." : "Check Out"}
            </button>
          </div>
        </div>

        {/* Recent attendance log */}
        <div className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-xl border border-white/40 dark:border-gray-700/40 rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.1)]">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-5">
            Recent Log
          </h2>
          {attendanceLog.length === 0 ? (
            <p className="text-gray-400 dark:text-gray-500 text-sm text-center py-6">
              No attendance records yet.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="text-[10px] uppercase tracking-widest text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-gray-800">
                    <th className="pb-3 pr-6 font-bold">Date</th>
                    <th className="pb-3 pr-6 font-bold">Check-In</th>
                    <th className="pb-3 font-bold">Check-Out</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {attendanceLog.map((rec) => (
                    <tr key={rec.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                      <td className="py-3 pr-6 text-gray-700 dark:text-gray-300 font-medium">
                        {fmtDate(rec.check_in)}
                      </td>
                      <td className="py-3 pr-6 text-gray-700 dark:text-gray-300 font-medium tabular-nums">
                        {fmtTime(rec.check_in)}
                      </td>
                      <td className="py-3 text-gray-700 dark:text-gray-300 font-medium tabular-nums">
                        {rec.check_out ? fmtTime(rec.check_out) : (
                          <span className="inline-block bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full">
                            Active
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
