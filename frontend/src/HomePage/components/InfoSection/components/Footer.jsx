import React from 'react'
 
function Footer() {
  return (
  
<footer id='contact' className="bg-gradient-to-tr from-purple-900 to-slate-900 dark:from-black dark:via-black dark:to-[#111] text-gray-100 py-8 md:py-12 w-full ">
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
                <h3 className="text-lg font-semibold mb-4">About</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                    <li><a href="#" className="hover:text-white transition">About Us</a></li>
                    <li><a href="#" className="hover:text-white transition">Contact</a></li>
                </ul>
            </div>
            <div>
                <h3 className="text-lg font-semibold mb-4">Support</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                    <li><a href="#" className="hover:text-white transition">Help Center</a></li>
                    <li><a href="#" className="hover:text-white transition">FAQ</a></li>
                </ul>
            </div>
            <div>
                <h3 className="text-lg font-semibold mb-4">Legal</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                    <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                    <li><a href="#" className="hover:text-white transition">Terms</a></li>
                </ul>
            </div>
            <div>
                <h3 className="text-lg font-semibold mb-4">Social</h3>
                <ul className="space-y-2 text-sm text-gray-400">
                    <li><a href="#" className="hover:text-white transition">Twitter</a></li>
                    <li><a href="#" className="hover:text-white transition">GitHub</a></li>
                </ul>
            </div>
        </div>
        <div className="border-t border-gray-700 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2024 Video Chat. All rights reserved.</p>
        </div>
    </div>
</footer>
  )
}

export default Footer