
import Switch from "../../HomePage/components/navbar/Switch";

function DashBoardNavbar(props) {

  
  return (
    <nav
    className=" sticky top-1 flex items-center justify-between md:px-[4rem] py-5 w-[100vw] px-[2rem] z-10 "
  >
    <div className="flex items-center justify-between w-full">
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        </div>
        <h1 className="text-base md:text-xl font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent  hidden md:inline-block">
          VideoChat
        </h1>
      </div>

      <div className="flex items-center space-x-1">
        {/* Theme Switcher */}
       <Switch/>

        {/* Logout Button */}
        <button
          onClick={props.handleLogout}
          className="px-2 md:px-4 p-2 bg-red-600 hover:bg-red-500 text-white rounded-md transition-colors duration-200 text-center text-sm md:texte-base flex items-center gap-2"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
            />
          </svg>
          <span className='hidden md:inline-block '>Logout</span>
        </button>
      </div>
    </div>
  </nav>
  )
}

export default DashBoardNavbar
