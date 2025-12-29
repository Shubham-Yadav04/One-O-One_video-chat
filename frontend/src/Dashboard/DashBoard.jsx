

import { useSocket } from "../ContextProviders/Socket";
import React, { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { usePeer } from "../ContextProviders/Peer";
import UserProfile from "./components/UserProfile";
import DashBoardNavbar from "./components/DashBoardNavbar";
import { useUserData } from "../ContextProviders/User";
import axios from 'axios'
import io from 'socket.io-client'
import { usePeer } from "../ContextProviders/Peer";
function Dashboard() {
  const { setUser, user } = useUserData();
  const navigate = useNavigate();
  const {initializePeer,setLocalStream}=usePeer()
let {socketRef,setIsConnected,socket}= useSocket();
const [waiting,setWaiting]=React.useState(false)
  const clientSocketRef = socketRef; 
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
  }, [setIsConnected, socketRef]);

  // --- check login ---
  const checkLogin = useCallback(async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}user/check-login`,
        { withCredentials: true }
      );
      setUser(response.data.user);
    } catch (error) {
      console.log(error.message);
      if (error.response) navigate("/login");
    }
  }, [navigate, setUser]);

  useEffect(() => {
    checkLogin();
  }, [checkLogin]);

  const handleRandomChat = async () => {
    console.log("Starting random chat for user:", user);
    socket.emit("find-partner", {
      email: user?.email,
      sessionId: sessionStorage.getItem("sessionId"),
    });
  };
const handlePartnerFound = useCallback(async ({ roomId, shouldCreateOffer }) => {
  const clientSocket = clientSocketRef?.current;
  console.log('Partner found payload', { roomId, shouldCreateOffer });
  if (!user) return;
  if (!clientSocket) return;
  // setStatus('connecting');
  try {
    const result = await initializePeer(clientSocket, shouldCreateOffer, roomId);
    // initializePeer returns { peer, localStream }
    if (result && result.localStream) {
      setLocalStream(result.localStream);
    }
    console.log(' Partner found, initialized peer connection');
    navigate(`/chatroom/${roomId}`);
  } catch (err) {
    console.error('Error initializing peer:', err);
  }
}, [clientSocketRef, initializePeer, navigate, setLocalStream, user]);
const handleWaiting=useCallback(()=>[
  setWaiting(true)
],[])
useEffect(()=>{
    if (socket) {
      socket.on("partner-found", handlePartnerFound);
      socket.on("waiting",handleWaiting)
    }
    return()=>{
      if(socket){
socket.on("waiting",handleWaiting)
      socket.off("partner-found", handlePartnerFound);
      }
        
    }
})
  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div
      className={`h-screen w-full  transition-colors duration-300 bg-neutral-100 dark:bg-black text-black dark:text-neutral-60`}
    >
     {user ? (
        <div className="w-full">
          <DashBoardNavbar handleLogout={handleLogout} />
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex md:flex-row flex-col gap-8">
              <UserProfile />
              <div className="w-full flex items-center justify-center md:h-[300px] ">
                {
                  waiting? <h2 className="text-2xl font-semibold text-black dark:text-white">Searching for a partner...</h2>:<h2 className="text-2xl font-semibold">Start a random chat session</h2>
                }
              <button
                onClick={handleRandomChat}
                className="text-2xl font-bold w-fit h-fit bg-purple-300 p-2 rounded-lg"
              >
                Connect Random
              </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Dashboard;
