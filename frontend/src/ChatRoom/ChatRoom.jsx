import { useUserData } from "../ContextProviders/User";
import { useSocket } from "../ContextProviders/Socket";
import { useNavigate } from "react-router-dom";
import { useRef,useState,useEffect,useCallback } from "react";
import { usePeer } from "../ContextProviders/Peer";
import axios from "axios";
// ChatRoom.jsx - All connection logic here
export default function ChatRoom() {
  const {user,setUser} = useUserData();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [error, setError] = useState(null);
  const [isSkipping, setIsSkipping] = useState(false);
  const { socket } = useSocket();
  const socketRef=useRef(socket);
  const clientSocket=socketRef.current;

  const navigate = useNavigate();
useEffect(()=>{
 const checkLogin=async()=>{
  try{
  const res=await axios.get(import.meta.env.VITE_BACKEND_URI+"user/check-login",{withCredentials:true});
  if(res.data.user){
    setUser(res.data.user);

  }
  else {
        navigate("/login");
      }
  }
  catch(err){
    navigate('/login');
    console.error("Login check failed",err);
  }

 }
  if (!user) {
    checkLogin();
  }
},[navigate, setUser])
  const { setLocalStream,
    createOffer,
    createAnswer,
    setRemoteAnswer,
    addIceCandidate,
    setOnIceCandidate,
    getUserMedia,
    localStream,
    remoteStream,
    connectionState,
    cleanupConnection,
    // setRoomId,
    initializePeer
  } = usePeer();

const peerRef=useRef(null);
  useEffect(() => {
    if(!user) return;
    if(!clientSocket) return ;
    const initialize = async () => {
      try {
         if (!peerRef.current) {
    peerRef.current = await initializePeer();
  }
   
        setOnIceCandidate((candidate) => {
          // console.log('Sending ICE candidate to partner');
          clientSocket.emit('ice-candidate', { candidate });
        });
        await getUserMedia({ video: true, audio: true });
        clientSocket.emit('find-partner');
      } catch (err) {
        console.error('Initialization error:', err);
        if (err.name === 'NotAllowedError') {
          setError('Camera and microphone access denied. Please allow permissions.');
        } else if (err.name === 'NotFoundError') {
          setError('No camera or microphone found.');
        } else {
          setError('Failed to access camera and microphone.');
        }
        // setStatus('error');
      }
    };

    initialize();

    // Cleanup ONLY on unmount
    return () => {
      console.log('ChatRoom unmounting, cleaning up...');
      peerRef.current = null;
      cleanupConnection();
      if (clientSocket) {
        clientSocket.emit('leave-room');
      }
    };
  }, [initializePeer]);

  //  Handle partner found
 const handlePartner = useCallback(async ({roomId, shouldCreateOffer}) => {
    console.log('Partner found!', {roomId, shouldCreateOffer});
    if (shouldCreateOffer) {
      try { 
        console.log('Creating offer for partner...');
        const offer = await createOffer();
        clientSocket.emit('offer', {offer});
      } catch (err) {
        console.error('Error creating offer:', err);
      }
    }
  }, [createOffer, clientSocket]);

  //  Handle receiving offer from partner
  const handlePartnerOffer = useCallback(async ({offer}) => {
    console.log(' Received offer from partner');
    try {
      const answer = await createAnswer(offer);
      console.log('Sending answer to partner');
      clientSocket.emit('answer', {answer});
    } catch (err) {
      console.error('Error creating answer:', err);
    }
  }, [createAnswer, clientSocket]);

  // Handle receiving answer from partner
  const handlePartnerAnswer = useCallback(async ({answer}) => {
    console.log('Received answer from partner');
    try {
      await setRemoteAnswer(answer); 
      console.log('Remote answer set successfully');
    } catch (err) {
      console.error('Error setting remote answer:', err);
    }
  }, [setRemoteAnswer]);

  //  Handle ICE candidates (critical for connection!)
  const handleIceCandidate = useCallback(({candidate}) => {
    console.log('Received ICE candidate from partner');
    addIceCandidate(candidate);
  }, [addIceCandidate]);

  // // Handle waiting state
  // const handleWaiting = useCallback(() => {
  //   console.log('Waiting for a partner...');
  //   setStatus('searching');
  // }, []);

  // Handle partner disconnection
  const handlePartnerDisconnected = useCallback(() => {
    console.log(' Partner disconnected');
    
    if (!isSkipping) {
      // Partner left, auto-search for new one
      // setStatus('searching');
      cleanupConnection();
      clientSocket.emit('find-partner');
    }
  }, [cleanupConnection, clientSocket, isSkipping]);

  // Set up all clientSocket listeners
  useEffect(() => {
    if (!clientSocket) return;
    if(!user) return;
    clientSocket.on('partner-found', handlePartner);
    clientSocket.on('offer', handlePartnerOffer);
    clientSocket.on('answer', handlePartnerAnswer);
    clientSocket.on('ice-candidate', handleIceCandidate);
    // clientSocket.on('waiting', handleWaiting);
    clientSocket.on('partner-disconnected', handlePartnerDisconnected);

    return () => {
      clientSocket.off('partner-found', handlePartner);
      clientSocket.off('offer', handlePartnerOffer);
      clientSocket.off('answer', handlePartnerAnswer);
      clientSocket.off('ice-candidate', handleIceCandidate);
      // clientSocket.off('waiting', handleWaiting);
      clientSocket.off('partner-disconnected', handlePartnerDisconnected);
    };
  }, [
    clientSocket,
    handlePartner,
    handlePartnerOffer,
    handlePartnerAnswer,
    handleIceCandidate,
    // handleWaiting,
    handlePartnerDisconnected,
  ]);

  //  Monitor connection state and update status
  useEffect(() => {
    console.log('Connection state changed:', connectionState);
    
    if (connectionState === 'connected') {
      // setStatus('connected');
      console.log(' Connection fully established!');
    } else if (connectionState === 'failed') {
      console.error('Connection failed');
      handlePartnerDisconnected();
    } else if (connectionState === 'disconnected') {
      console.log('Connection lost');
      handlePartnerDisconnected();
    }
  }, [connectionState, handlePartnerDisconnected]);

  const cleanLocalStream=()=>{
      if (peerRef.current) {
    peerRef.current.getSenders().forEach(sender => {
      peerRef.current.removeTrack(sender);
    });
    peerRef.current.close();
  }
  localStream.getTracks().forEach(t=>t.stop());
  localVideoRef.current.srcObject=null;
  setLocalStream(null);
  }
  // Set local video stream
  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
    () => {
    cleanLocalStream();
  };
  }, [localStream]);

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
    // setStatus('searching');
    cleanupConnection();
    clientSocket.emit('find-partner');
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
              opacity: status === 'initializing' ? 0.5 : 1
            }}
            onMouseEnter={(e) => {
              if (status !== 'initializing') {
                e.target.style.backgroundColor = '#F57C00';
                e.target.style.transform = 'scale(1.05)';
              }
            }}
            onMouseLeave={(e) => {
              if (status !== 'initializing') {
                e.target.style.backgroundColor = '#FF9800';
                e.target.style.transform = 'scale(1)';
              }
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