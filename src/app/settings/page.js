import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Settings() {
  return (
    <div className="min-h-screen flex flex-col bg-light">
      <Navbar />
      
      <main className="flex-grow py-12 px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-4xl mx-auto bg-white p-8 sm:p-12 rounded-[2rem] shadow-md">
          <h1 className="text-3xl font-bold text-dark mb-2">Account Settings</h1>
          <p className="text-gray-500 mb-8">Update your personal details and account preferences.</p>
          
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Full Name</label>
                <input 
                  type="text" 
                  defaultValue="Parent / Student Name"
                  className="w-full px-4 py-3 bg-light rounded-xl border-none focus:ring-2 focus:ring-primary/50 outline-none transition-all shadow-inner text-dark"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Email Address</label>
                <input 
                  type="email" 
                  defaultValue="user@taqwaeduhub.com"
                  className="w-full px-4 py-3 bg-light rounded-xl border-none focus:ring-2 focus:ring-primary/50 outline-none transition-all shadow-inner text-dark"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Phone Number</label>
                <input 
                  type="tel" 
                  defaultValue="+91 98765 43210"
                  className="w-full px-4 py-3 bg-light rounded-xl border-none focus:ring-2 focus:ring-primary/50 outline-none transition-all shadow-inner text-dark"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-dark mb-2">Role/Status</label>
                <input 
                  type="text" 
                  value="Active User"
                  disabled
                  className="w-full px-4 py-3 bg-gray-200 rounded-xl border-none outline-none text-gray-500 cursor-not-allowed shadow-inner"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 mt-8">
              <h2 className="text-lg font-semibold text-dark mb-4">Change Password</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">New Password</label>
                  <input 
                    type="password" 
                    placeholder="Enter new password"
                    className="w-full px-4 py-3 bg-light rounded-xl border-none focus:ring-2 focus:ring-primary/50 outline-none transition-all shadow-inner text-dark"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-dark mb-2">Confirm Password</label>
                  <input 
                    type="password" 
                    placeholder="Confirm new password"
                    className="w-full px-4 py-3 bg-light rounded-xl border-none focus:ring-2 focus:ring-primary/50 outline-none transition-all shadow-inner text-dark"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-end pt-8">
              <button 
                type="button" 
                className="bg-primary hover:bg-emerald-600 text-white font-bold py-3 px-8 rounded-full transition-all shadow-md hover:shadow-lg"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
