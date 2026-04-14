export async function getDashboardData() {
  // Placeholder for real Database fetch
  // e.g. const { data, error } = await supabase.from('subjects').select('*');
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { title: "English Literature", duration: "45 Mins / session", schedule: "Tue, Thu (10:00 AM)" },
        { title: "Chemistry Advanced", duration: "60 Mins / session", schedule: "Mon, Wed (01:00 PM)" },
        { title: "Calculus & Algebra", duration: "90 Mins / session", schedule: "Fri, Sat (09:00 AM)" }
      ]);
    }, 500);
  });
}
