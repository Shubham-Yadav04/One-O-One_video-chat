
import { useContext } from "react";
import { createContext } from "react";
import { useRef,useState } from "react";

const SocketContext=createContext();
export const useSocket = () => {
  return useContext(SocketContext);
};
export const SocketProvider= ({children})=>{
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
return (
    <SocketContext.Provider value={{socket:socketRef.current,socketRef:socketRef,isConnected,setIsConnected}}> 
        {children}
    </SocketContext.Provider>
)
}
