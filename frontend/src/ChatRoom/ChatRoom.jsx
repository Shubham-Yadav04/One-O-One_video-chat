import { useUserData } from "../ContextProviders/User";
import { useSocket } from "../ContextProviders/Socket";
import { useNavigate } from "react-router-dom";
import { useRef,useState,useEffect,useCallback } from "react";
import { usePeer } from "../ContextProviders/Peer";
// import axios from "axios";
// import { set } from "mongoose";
// ChatRoom.jsx - All connection logic here
export default function ChatRoom() {
  const {user,setUser} = useUserData();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  // const [error, setError] = useState(null);
  const [isSkipping, setIsSkipping] = useState(false);
  const { socketRef } = useSocket();
  const clientSocketRef = socketRef; // ref provided by SocketProvider
  
  const [status, setStatus] = useState('initializing');
  const navigate = useNavigate();
// useEffect(()=>{
//  const checkLogin=async()=>{
//   try{
//   const res=await axios.get(import.meta.env.VITE_BACKEND_URI+"user/check-login",{withCredentials:true});
//   if(res.data.user){
//     setUser(res.data.user);
//   }
//   else {
//         navigate("/login");
//       }
//   }
//   catch(err){
//     navigate('/login');
//     console.error("Login check failed",err);
//   }

//  }

// },[navigate, setUser, user])
  const {
    createAnswer,
    setRemoteAnswer,
    setLocalStream,
    localStream,
    addIceCandidate,
    remoteStream,
    initializePeer,
    cleanupConnection,
    // setRoomId,
  } = usePeer();
  //  Handle partner found
  //  Handle receiving offer from partner
  const handlePartnerOffer = useCallback(async ({ offer, roomId }) => {
    const clientSocket = clientSocketRef?.current;
    console.log(' Received offer from partner in roomId', roomId);
    try {
      const answer = await createAnswer(offer);
      console.log('Sending answer to partner');
      if (clientSocket) clientSocket.emit('answer', { answer, roomId });
    } catch (err) {
      console.error('Error creating answer:', err);
    }
  }, [createAnswer, clientSocketRef]);

  // Handle receiving answer from partner
  const handlePartnerAnswer = useCallback(async ({ answer, roomId }) => {
     const clientSocket = clientSocketRef?.current;
    console.log('Received answer from partner in roomId', roomId);
    try {
      await setRemoteAnswer(answer);
      console.log('Remote answer set successfully');
      clientSocket.emit("answer-recieved");
      setStatus('connected'); 
    } catch (err) {
      console.error('Error setting remote answer:', err);
    }
  }, [clientSocketRef, setRemoteAnswer]);
const handleConnectionEstablished=useCallback(()=>{
  setStatus('connected');
  if(isSkipping){
    setIsSkipping(false);
  }
},[isSkipping])
  //  Handle ICE candidates (critical for connection!)
  const handleIceCandidate = useCallback(({ candidate }) => {
    console.log('Received ICE candidate from partner');
    addIceCandidate(candidate);
  }, [addIceCandidate]);
  // Handle partner disconnection
  const handlePartnerDisconnected = useCallback(() => {
    const clientSocket = clientSocketRef?.current;
    console.log(' Partner disconnected');
    if (!isSkipping) {
      cleanupConnection();
      if (clientSocket) clientSocket.emit('find-partner');
      setStatus('searching');
    }
  }, [cleanupConnection, clientSocketRef, isSkipping]);
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
    setStatus('connected')
    navigate(`/chatroom/${roomId}`);
    
  } catch (err) {
    console.error('Error initializing peer:', err);
  }
}, [clientSocketRef, initializePeer, navigate, setLocalStream, user]);

  // Set up all clientSocket listeners
  useEffect(() => {
    const clientSocket = clientSocketRef?.current;
    if (!clientSocket) return;
    if (!user) return;
clientSocket.on("partner-found", handlePartnerFound);
    clientSocket.on('offer-created', handlePartnerOffer);
    clientSocket.on('answer-created', handlePartnerAnswer);
    clientSocket.on('new-ice-candidate', handleIceCandidate);
    clientSocket.on('partner-disconnected', handlePartnerDisconnected);
clientSocket.on("connection-established",handleConnectionEstablished);
    return () => {
      clientSocket.on("partner-found", handlePartnerFound);
      clientSocket.off('offer-created', handlePartnerOffer);
      clientSocket.off('answer-created', handlePartnerAnswer);
      clientSocket.off('connection-established',handleConnectionEstablished);
      clientSocket.off('new-ice-candidate', handleIceCandidate);
      clientSocket.off('partner-disconnected', handlePartnerDisconnected);
    };
  }, [clientSocketRef, handlePartnerOffer, handlePartnerAnswer, handleIceCandidate, handlePartnerDisconnected, user, handleConnectionEstablished, handlePartnerFound]);
  const cleanLocalStream = useCallback(() => {
    
    if (localStream) {
      try { localStream.getTracks().forEach((t) => t.stop()); } catch (err) { console.warn('error stopping local tracks', err); }
      setLocalStream(null);
    }
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    setStatus('initializing');
  }, [ localStream, setLocalStream]);
  // Set local video stream
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
    return () => {
      cleanLocalStream();
    };
  }, [cleanLocalStream, localStream]);

  // Set remote video stream and remove blur
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
      console.log(' Remote stream connected');
    }
  }, [remoteStream]);


  // Handle skip/next partner
  const handleSkip = () => {
    console.log('⏭ Skipping to next partner...');
    setIsSkipping(true);
    setStatus('searching');
    cleanupConnection();
    clientSocketRef?.current.emit("skip-partner");
    const clientSocket = clientSocketRef?.current;
    if (clientSocket) clientSocket.emit('find-partner');
  };

  // Handle disconnect and go back home
  const handleDisconnect = () => {
    console.log(' Disconnecting and going home...');
    cleanupConnection();
   
setTimeout(() => navigate("/"), 200);// a short delay to ensure cleanup
   window.location.href = "/";
  };

  // Guard: User not logged in
  if (!user) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#1a1a1a',
        color: 'white'
      }}>
        <h2>Please log in to use video chat</h2>
        <button 
          onClick={() => navigate('/')}
          style={{
            marginTop: 20,
            padding: '12px 24px',
            fontSize: 16,
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            cursor: 'pointer'
          }}
        >
          Go Back Home
        </button>
      </div>
    );
  }

  // // Guard: Error state
  // if (status === 'error') {
  //   return (
  //     <div style={{
  //       minHeight: '100vh',
  //       display: 'flex',
  //       flexDirection: 'column',
  //       alignItems: 'center',
  //       justifyContent: 'center',
  //       backgroundColor: '#1a1a1a',
  //       color: 'white',
  //       padding: 20
  //     }}>
  //       <h2 style={{color: '#f44336'}}>Error</h2>
  //       <p style={{
  //         maxWidth: 500,
  //         textAlign: 'center',
  //         marginTop: 20,
  //         fontSize: 16
  //       }}>
  //         {error}
  //       </p>
  //       <button 
  //         onClick={() => navigate('/')}
  //         style={{
  //           marginTop: 20,
  //           padding: '12px 24px',
  //           fontSize: 16,
  //           backgroundColor: '#4CAF50',
  //           color: 'white',
  //           border: 'none',
  //           borderRadius: 8,
  //           cursor: 'pointer'
  //         }}
  //       >
  //         Go Back Home
  //       </button>
  //     </div>
  //   );
  // }

  return (
    <div style={{
      minHeight: '100vh',
      padding: 20,
      backgroundColor: '#1a1a1a',
      color: 'white'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        padding: '15px 25px',
        backgroundColor: '#2a2a2a',
        borderRadius: 12,
        boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
      }}>
        <div>
          <h2 style={{margin: 0, fontSize: 24}}>
            {user.userName}
          </h2>
          <p style={{
            margin: '5px 0 0 0',
            fontSize: 14,
            color: '#888'
          }}>
            {status === 'searching' && 'This might take a moment...'}
            {status === 'connecting' && 'Establishing secure connection...'}
            {status === 'connected' && 'Connection is stable'}
          </p>
        </div>
        
        <div style={{display: 'flex', gap: 12}}>
          <button 
            onClick={handleSkip}
            style={{
              padding: '12px 24px',
              fontSize: 16,
              backgroundColor:'#FF9800',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              cursor:  'pointer',
              fontWeight: 'bold',
              transition: 'all 0.2s',
              
            }}
           
       
          >
            ⏭ Skip
          </button>
          
          <button 
            onClick={()=>{
              handleDisconnect();
            }}
            style={{
              padding: '12px 24px',
              fontSize: 16,
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = '#d32f2f';
              e.target.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#f44336';
              e.target.style.transform = 'scale(1)';
            }}
          >
            Stop
          </button>
        </div>
      </div>

      {/* Video section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: 20,
        maxWidth: 1600,
        margin: '0 auto'
      }}>
        {/* Partner video - BLURRED until connected */}
        <div style={{
          position: 'relative',
          backgroundColor: '#000',
          borderRadius: 16,
          overflow: 'hidden',
          aspectRatio: '4/3',
          boxShadow: '0 8px 16px rgba(0,0,0,0.4)'
        }}>
          <video 
            ref={remoteVideoRef}
            autoPlay 
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: status === 'connected' ? 'none' : 'blur(25px)',
              transition: 'filter 0.5s ease-in-out',
              transform: status === 'connected' ? 'scale(1)' : 'scale(1.1)'
            }}
          />
          {status !== 'connected' && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(0,0,0,0.75)',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{
                fontSize: 48,
                marginBottom: 20,
                animation: 'pulse 2s infinite'
              }}>
                {status === 'initializing' && '⏳'}
                {status === 'searching' && '🔍'}
                {status === 'connecting' && '🤝'}
              </div>
              <h3 style={{
                margin: 0,
                fontSize: 24,
                fontWeight: 'bold'
              }}>
                {status === 'initializing' && 'Getting Ready...'}
                {status === 'searching' && 'Finding Someone...'}
                {status === 'connecting' && 'Connecting...'}
              </h3>
            </div>
          )}
          
          <div style={{
            position: 'absolute',
            top: 15,
            left: 15,
            backgroundColor: 'rgba(0,0,0,0.8)',
            padding: '8px 16px',
            borderRadius: 8,
            fontSize: 16,
            fontWeight: 'bold',
            backdropFilter: 'blur(10px)'
          }}>
             Stranger
          </div>

          {status === 'connected' && (
            <div style={{
              position: 'absolute',
              top: 15,
              right: 15,
              backgroundColor: 'rgba(76, 175, 80, 0.9)',
              padding: '8px 16px',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}>
              <span style={{
                width: 10,
                height: 10,
                backgroundColor: '#4CAF50',
                borderRadius: '50%',
                animation: 'blink 1.5s infinite'
              }}></span>
              Live
            </div>
          )}
        </div>
        <div style={{
          position: 'relative',
          backgroundColor: '#000',
          borderRadius: 16,
          overflow: 'hidden',
          aspectRatio: '4/3',
          boxShadow: '0 8px 16px rgba(0,0,0,0.4)'
        }}>
          <video 
            ref={localVideoRef}
            autoPlay 
            muted 
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: 'scaleX(-1)'
            }}
          />
          
          <div style={{
            position: 'absolute',
            top: 15,
            left: 15,
            backgroundColor: 'rgba(0,0,0,0.8)',
            padding: '8px 16px',
            borderRadius: 8,
            fontSize: 16,
            fontWeight: 'bold',
            backdropFilter: 'blur(10px)'
          }}>
             You
          </div>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.1); }
        }
        
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}