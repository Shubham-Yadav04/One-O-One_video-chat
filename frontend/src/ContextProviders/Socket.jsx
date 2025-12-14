import { useEffect } from "react";
import { useContext } from "react";
import { createContext } from "react";
import { useRef,useState } from "react";
import io from 'socket.io-client'
const SocketContext=createContext();
export const useSocket = () => {
  return useContext(SocketContext);
};
export const SocketProvider= ({children})=>{
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // connect socket only once
    const socket = io("http://localhost:8001", {
      withCredentials: true,
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      console.log(" Socket disconnected");
      setIsConnected(false);
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, []);

    
    
return (
    <SocketContext.Provider value={{socket:socketRef.current,isConnected}}> 
        {children}
    </SocketContext.Provider>
)
}
