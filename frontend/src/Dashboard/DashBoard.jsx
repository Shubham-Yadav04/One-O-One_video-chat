

import { useSocket } from "../ContextProviders/Socket";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePeer } from "../ContextProviders/Peer";
import UserProfile from "./components/UserProfile";
import DashBoardNavbar from "./components/DashBoardNavbar";
import { useUserData } from "../ContextProviders/User";
import axios from 'axios'
function Dashboard() {
  const { peer, createOffer, setRemoteAnswer } = usePeer();
  const { socket } = useSocket();
  const { setUser, user } = useUserData();
  const navigate = useNavigate();

  // --- ensure sessionId ---
  useEffect(() => {
    let sessionId = sessionStorage.getItem("sessionId");
    if (!sessionId) {
      sessionId = crypto?.randomUUID?.() || Math.random().toString(36).slice(2);
      sessionStorage.setItem("sessionId", sessionId);
    }
  }, []);

  // --- check login ---
  const checkLogin = useCallback(async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URI}check-login`,
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

  // ---- WebRTC signaling ----
  const handlePaired = useCallback(
    async ({ peerId }) => {
      console.log("Paired with:", peerId);

      // create offer (initiator)
      const offer = await createOffer();
      await peer.setLocalDescription(offer);

      socket.emit("offer", { to: peerId, sdp: offer });
      // Navigate to chatroom (UI route)
      navigate(`/chatroom/${peerId}`);
    },
    [peer, socket, navigate, createOffer]
  );

  const handleOffer = useCallback(
    async ({ from, sdp }) => {
      console.log("Received offer from:", from);
      await peer.setRemoteDescription(new RTCSessionDescription(sdp));

      const answer = await peer.createAnswer();
      await peer.setLocalDescription(answer);

      socket.emit("answer", { to: from, sdp: answer });
      navigate(`/chatroom/${from}`);
    },
    [peer, socket, navigate]
  );

  const handleAnswer = useCallback(
    async ({ from, sdp }) => {
      console.log("Received answer from:", from);
      await setRemoteAnswer(new RTCSessionDescription(sdp));
    },
    [setRemoteAnswer]
  );

  const handleIce = useCallback(
    async ({ from, candidate }) => {
      try {
        await peer.addIceCandidate(new RTCIceCandidate(candidate));
        console.log("Added ICE from:", from);
      } catch (err) {
        console.error("Error adding ICE:", err);
      }
    },
    [peer]
  );

  // Register socket events
  useEffect(() => {
    socket.on("paired", handlePaired);
    socket.on("offer", handleOffer);
    socket.on("answer", handleAnswer);
    socket.on("ice", handleIce);

    return () => {
      socket.off("paired", handlePaired);
      socket.off("offer", handleOffer);
      socket.off("answer", handleAnswer);
      socket.off("ice", handleIce);
    };
  }, [socket, handlePaired, handleOffer, handleAnswer, handleIce]);

  // Local ICE candidates
  useEffect(() => {
    if (!peer) return;
    peer.onicecandidate = (event) => {
      if (event.candidate) {
        const peerId = sessionStorage.getItem("peerId");
        socket.emit("ice", { to: peerId, candidate: event.candidate });
      }
    };
  }, [peer, socket]);

  // --- start random chat ---
  const handleRandomChat = async () => {
    socket.emit("find-random", {
      email: user?.email,
      sessionId: sessionStorage.getItem("sessionId"),
    });
  };

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div
      className={`h-fit transition-colors duration-300 bg-neutral-100 dark:bg-[#111] text-black dark:text-neutral-60`}
    >
      {user ? (
        <>
          <DashBoardNavbar handleLogout={handleLogout} />
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <UserProfile />
              <button
                onClick={handleRandomChat}
                className="text-2xl font-bold bg-purple-300 p-2 rounded-lg"
              >
                Connect Random
              </button>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

export default Dashboard;
