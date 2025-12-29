import { createContext, useContext, useState, useCallback, useRef } from 'react';

const PeerContext = createContext();

export const PeerProvider = ({ children }) => {
  const [roomId, setRoomId] = useState(null);
    const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [connectionState, setConnectionState] = useState('new');
  const peerRef = useRef(null);

  // not used currently; kept for future extensibility

  // IMPORTANT: Define cleanupConnection FIRST before any useEffect that uses it
  const cleanupConnection = useCallback(() => { 
  console.log("Cleaning up connection...");

  const pc = peerRef.current;
  if (pc) {
    // Remove event handlers
    pc.ontrack = null;
    pc.onicecandidate = null;
    pc.oniceconnectionstatechange = null;
    pc.onicegatheringstatechange = null;
    pc.onsignalingstatechange = null;
    pc.onconnectionstatechange = null;

    // Stop all transceivers
    pc.getTransceivers?.().forEach((t) => t.stop());

    // Stop all senders (local tracks)
    pc.getSenders().forEach((sender) => {
      if (sender.track) sender.track.stop();
    });

    pc.close();
    peerRef.current = null;
    console.log("Peer connection closed");
  }

  // Stop remote tracks
  if (remoteStream) {
    try {
      remoteStream.getTracks().forEach((t) => t.stop());
    } catch (e) {
      console.log("Error stopping remote tracks:", e);
    }
  }
  setRemoteStream(null);

  setConnectionState("new");
}, []);

  // Initialize peer connection
  const initializePeer = async (clientSocket, shouldCreateOffer = false, requestedRoomId = null) => {
    if (peerRef.current) {
      peerRef.current.close();
      peerRef.current = null;
    }

    const peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: [
            "stun:stun.l.google.com:19302",
            "stun:global.stun.twilio.com:3478"
          ]
        }
      ]
    });
    console.log("RTCPeerConnection created");
    // Attach event handlers and capture clientSocket via closure
    peer.onicecandidate = (event) => {
      if (event.candidate && clientSocket) {
        console.log('ICE candidate generated, emitting to server');
        clientSocket.emit('ice-candidate', { candidate: event.candidate });
      }
    };

    peer.ontrack = handleTrackEvent;

    peer.onremovetrack = handleRemoveTrackEvent;
    peer.oniceconnectionstatechange = handleICEConnectionStateChangeEvent(peer);

    peer.onconnectionstatechange = () => {
      console.log('Connection state:', peer.connectionState);
      setConnectionState(peer.connectionState);
    };

    // negotiationneeded: if we were assigned to create an offer, do it after adding tracks
    peer.onnegotiationneeded = async () => {
      if (!clientSocket) return;
      if (!shouldCreateOffer) {
        // this peer was not chosen to create the initial offer
        console.log('Negotation needed but this peer will not create the initial offer');
       return;
      }
      try {
        console.log('onnegotiationneeded fired - creating offer');
        const offer = await peer.createOffer();
        await peer.setLocalDescription(offer);
        clientSocket.emit('offer', { offer: peer.localDescription });
      } catch (err) {
        console.error('Error during negotiationneeded:', err);
      }
    };

  // peer.onsignalingstatechange = handleSignalingStateChangeEvent;


    // Handle connection state changes
    peer.onconnectionstatechange = () => {
      console.log('Connection state:', peer.connectionState);
      setConnectionState(peer.connectionState);
    };

    // Handle incoming tracks
    
    // Handle ICE connection state
    // peer.oniceconnectionstatechange = () => {
    //   console.log('ICE connection state:', peer.iceConnectionState);
    // };

    peerRef.current = peer;
    // If a roomId was provided, store it
    if (requestedRoomId) setRoomId(requestedRoomId);

    // Try to get local media and add tracks to the peer
    try {
      const localStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      console.log('Local media stream obtained',localStream);
      localStream.getTracks().forEach((track) => peer.addTrack(track, localStream));
      setLocalStream(localStream);
      return { peer, localStream };
    } catch (err) {
      console.warn('Could not get local media:', err);
      return { peer, localStream: null };
    }
  }
  const handleRemoveTrackEvent = (event) => {
    const stream = event.target; // MediaStream
  const removedTrack = event.track;

  setRemoteStream((prevStream) => {
    if (!prevStream || prevStream.id !== stream.id) {
      return prevStream;
    }
    const remainingTracks = prevStream
      .getTracks()
      .filter((t) => t.id !== removedTrack.id);

    if (remainingTracks.length === 0) {
      return null; // no media left
    }

    const newStream = new MediaStream(remainingTracks);
    return newStream;
  });
  };
 
  const addIceCandidate = async (candidate) => {
    try {
      if (peerRef.current) {
        await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        console.log('ICE candidate added successfully');
      } else {
        console.warn('Cannot add ICE candidate: peer not initialized');
      }
    } catch (err) {
      console.error('Error adding ICE candidate:', err);
    }
  };

  // Create answer
  const createAnswer =async (offer) => {
    try {
      // if (!peerRef.current) {
      //   initializePeer();
      // }

      await peerRef.current.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerRef.current.createAnswer();
      await peerRef.current.setLocalDescription(answer);
      console.log('Answer created and set as local description');
      return peerRef.current.localDescription;
    } catch (err) {
      console.error('Error creating answer:', err);
      throw err;
    }
  };

  // Set remote answer
  const setRemoteAnswer = async (answer) => {
    try {
      if (peerRef.current) {
        await peerRef.current.setRemoteDescription(new RTCSessionDescription(answer));
        console.log('Remote answer set successfully');
      }
    } catch (err) {
      console.error('Error setting remote answer:', err);
      throw err;
    }
  }

  // Add local stream
  
  const handleTrackEvent = (event) => {
    const remote = event.streams && event.streams[0] ? event.streams[0] : null;
    if (!remote) return;
    // replace remote stream
    setRemoteStream(remote);
  };
const handleICEConnectionStateChangeEvent = (peerConnection) => {
  const state = peerConnection.iceConnectionState;
  console.log("ICE connection state:", state);

  switch (state) {
    case "connected":
    case "completed":
      console.log("ICE connected ");
      break;

    case "disconnected":
      console.warn("ICE disconnected ");
      break;

    case "failed":
      console.error("ICE failed ");
      handleICEFailure(peerConnection);
      break;

    case "closed":
      console.log("ICE closed");
      break;

    default:
      break;
  }
};
  const handleICEFailure = (peerConnection) => {
  if (peerConnection.restartIce) {
    console.log("Restarting ICE...");
    peerConnection.restartIce();
  }
};


  // // Cleanup on unmount - NOW cleanupConnection is defined
  // useEffect(() => {
  //   return () => {
  //     console.log('PeerProvider unmounting, cleaning up...');
  //     cleanupConnection();
  //   };
  // }, [cleanupConnection]);

  const value = {
    peer: peerRef.current,
    roomId,
    setRoomId,
    remoteStream,
    connectionState,
    createAnswer,
    setRemoteAnswer,
    setLocalStream,
    localStream,
    addIceCandidate,
    cleanupConnection,
    initializePeer
  };

  return (
    <PeerContext.Provider value={value}>
      {children}
    </PeerContext.Provider>
  );
};

export const usePeer = () => {
  const context = useContext(PeerContext);
  if (!context) {
    throw new Error('usePeer must be used within PeerProvider');
  }
  return context;
};

