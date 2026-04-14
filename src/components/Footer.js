export default function Footer() {
  return (
    <footer className="bg-dark text-white py-12 border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 pb-8 border-b border-gray-700">
           <div>
             <h3 className="text-2xl font-bold mb-4">What are you looking for?</h3>
             <p className="text-gray-400 mb-6 max-w-md">Need help finding the right resources or need to navigate a specific module? Our interactive platform makes it easier than ever.</p>
           </div>
           <div className="flex items-center justify-end">
             <div className="flex w-full max-w-md">
                <input type="text" placeholder="Search resources..." className="w-full px-4 py-3 rounded-l-lg text-dark focus:outline-none" />
                <button className="bg-primary px-6 py-3 rounded-r-lg font-medium hover:bg-emerald-600 transition-colors">Search Now</button>
             </div>
           </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">&copy; 2026 Taqwa Educational Hub. All rights reserved.</p>
            <div className="flex gap-4 mt-4 md:mt-0 text-gray-400">
                <a href="#" className="hover:text-white transition-colors"><i className="fa-brands fa-x-twitter"></i></a>
                <a href="#" className="hover:text-white transition-colors"><i className="fa-brands fa-facebook-f"></i></a>
                <a href="#" className="hover:text-white transition-colors"><i className="fa-brands fa-instagram"></i></a>
            </div>
        </div>
      </div>
    </footer>
  );
}
