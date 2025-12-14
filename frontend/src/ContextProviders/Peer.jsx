import { createContext, useContext, useState, useCallback, useRef } from 'react';

const PeerContext = createContext();

export const PeerProvider = ({ children }) => {
  const [roomId, setRoomId] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [connectionState, setConnectionState] = useState('new');
  const peerRef = useRef(null);
  const onIceCandidateCallback = useRef(null);

  // IMPORTANT: Define cleanupConnection FIRST before any useEffect that uses it
  const cleanupConnection = useCallback(() => {
    console.log('Cleaning up connection...');

    // // Stop local stream tracks
    // if (localStream) {
    //   localStream.getTracks().forEach(track => {
    //     track.stop();
    //     console.log('Stopped track:', track.kind);
    //   });
    //   setLocalStream(null);
    // }

    // Clear remote stream
    if (remoteStream) {
      setRemoteStream(null);
    }

    // Close peer connection
    if (peerRef.current) {
      peerRef.current.close();
      peerRef.current = null;
      console.log('Peer connection closed');
    }

    // setRoomId(null);
    setConnectionState('new');
  }, [remoteStream]);

  // Initialize peer connection
  const initializePeer = useCallback(() => {
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

    // Handle ICE candidates
    peer.onicecandidate = (event) => {
      if (event.candidate && onIceCandidateCallback.current) {
        console.log('ICE candidate generated');
        onIceCandidateCallback.current(event.candidate);
      }
    };

    // Handle connection state changes
    peer.onconnectionstatechange = () => {
      console.log('Connection state:', peer.connectionState);
      setConnectionState(peer.connectionState);
    };

    // Handle incoming tracks
    peer.ontrack = (event) => {
      console.log('Received remote track:', event.track.kind);
      setRemoteStream(event.streams[0]);
    };

    // Handle ICE connection state
    // peer.oniceconnectionstatechange = () => {
    //   console.log('ICE connection state:', peer.iceConnectionState);
    // };

    peerRef.current = peer;
    return peer;
  }, []);

  // Set callback for ICE candidates
  const setOnIceCandidate = useCallback((callback) => {
    onIceCandidateCallback.current = callback;
  }, []);

  // Add ICE candidate
  const addIceCandidate = useCallback(async (candidate) => {
    try {
      if (peerRef.current && peerRef.current.remoteDescription) {
        await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        console.log('ICE candidate added successfully');
      } else {
        console.warn('Cannot add ICE candidate: no remote description set yet');
      }
    } catch (err) {
      console.error('Error adding ICE candidate:', err);
    }
  }, []);

  // Create offer
  const createOffer = useCallback(async () => {
    try {
      if (!peerRef.current) {
        initializePeer();
      }

      const offer = await peerRef.current.createOffer();
      await peerRef.current.setLocalDescription(offer);
      console.log('Offer created and set as local description');
      return peerRef.current.localDescription;
    } catch (err) {
      console.error('Error creating offer:', err);
      throw err;
    }
  }, [initializePeer]);

  // Create answer
  const createAnswer = useCallback(async (offer) => {
    try {
      if (!peerRef.current) {
        initializePeer();
      }

      await peerRef.current.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await peerRef.current.createAnswer();
      await peerRef.current.setLocalDescription(answer);
      console.log('Answer created and set as local description');
      return peerRef.current.localDescription;
    } catch (err) {
      console.error('Error creating answer:', err);
      throw err;
    }
  }, [initializePeer]);

  // Set remote answer
  const setRemoteAnswer = useCallback(async (answer) => {
    try {
      if (peerRef.current) {
        await peerRef.current.setRemoteDescription(new RTCSessionDescription(answer));
        console.log('Remote answer set successfully');
      }
    } catch (err) {
      console.error('Error setting remote answer:', err);
      throw err;
    }
  }, []);

  // Add local stream
  const addLocalStream = useCallback(async (stream) => {
    try {
      if (!peerRef.current) {
        initializePeer();
      }

      // Remove existing tracks first
      const senders = peerRef.current.getSenders();
      senders.forEach(sender => peerRef.current.removeTrack(sender));

      // Add all tracks to peer connection
      stream.getTracks().forEach(track => {
        peerRef.current.addTrack(track, stream);
        console.log('Added track to peer connection:', track.kind);
      });

      setLocalStream(stream);
      console.log('Local stream added to peer connection');
    } catch (err) {
      console.error('Error adding local stream:', err);
      throw err;
    }
  }, [initializePeer]);

  // Get user media
  const getUserMedia = useCallback(async (constraints = { video: true, audio: true }) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log('User media obtained:', stream.getTracks().map(t => t.kind));
      await addLocalStream(stream);
      return stream;
    } catch (err) {
      console.error('Error getting user media:', err);
      throw err;
    }
  }, [addLocalStream]);

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
    localStream,
    remoteStream,
    connectionState,
    createOffer,
    createAnswer,
    setRemoteAnswer,
    addIceCandidate,
    setOnIceCandidate,
    getUserMedia,
    addLocalStream,
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