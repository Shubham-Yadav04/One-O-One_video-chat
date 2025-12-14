import { createContext, useContext, useEffect, useState } from "react";

const userDataContext= createContext();

export const UserDataProvider= ({children})=>{
  const [user,setUser] = useState(null);
    const [isDark,setIsDark]= useState( window.matchMedia("(prefers-color-scheme: dark)").matches || localStorage.getItem("theme")==="true"
);
    // const [userProfile,setUserProfile]=useState();
    // const [meetings,setMeetings]=useState();

    const handleThemeToggle = () => {
        setIsDark((prev) => !prev);
        localStorage.setItem("theme",localStorage.getItem("theme")==="true"?"false":"true")
      };

      useEffect(() => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme !== null) {
          setIsDark(storedTheme === 'true');
        } else {
          setIsDark(window.matchMedia("(prefers-color-scheme: dark)").matches);
        }
      }, []);
      
      useEffect(() => {
        localStorage.setItem('theme', isDark ? 'true' : 'false');
        document.documentElement.classList.toggle('dark', isDark);
      }, [isDark]);
    
return (
   
        <userDataContext.Provider value={{handleThemeToggle ,isDark,setIsDark ,setUser,user}}>
            {children}
        </userDataContext.Provider>
)
}

export const useUserData= () => useContext(userDataContext)