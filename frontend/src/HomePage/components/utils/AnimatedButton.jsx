import React from 'react'
import { AnimatePresence , motion} from 'motion/react'
import { useMemo } from 'react';
import axios from 'axios';
import {useNavigate} from "react-router-dom"
import { useUserData } from '../../../ContextProviders/User.jsx';

function AnimatedButton() {
  const navigate= useNavigate();
  const {setUser}= useUserData();
  const handleNavigation=async ()=>{
    try{
 const response = await axios.get('http://localhost:8000/user/check-login',{
      withCredentials:true
    })
    if(response.data.user){
      setUser(response.data.user)
      navigate('/dashboard');
    }
    }
    catch(e){
  navigate('/login')
  console.log("login",e)
    }
  }
//   const {socket}= useSocket();
//   const navigate= useNavigate();
//   const {createOffer,createAnswer,setRemoteAnswer}=usePeer();
// const handleConnect=()=>{
//   socket.emit("find-partner",{socketId:socket.id})
// console.log("sended the request to find a user");
// }
// const handlePartner=useCallback(async({roomId,shouldCreateOffer})=>{ 
// if(shouldCreateOffer){
//    try{
//  const offer= await createOffer();
 
//   socket.emit('offer',{offer});
//   }
//   catch(err){
//   console.log("error while offer creation", err)
//   }
 
// }
// else return ;
// }
// ,[createOffer, socket])
// const handlePartnerOffer=useCallback(async({offer})=>{ 
//   try{
//  const answer= await createAnswer(offer);
 
//   socket.emit('answer',{answer});
//   }
//   catch(err){
//   console.log("error while partener sends offer ", err)
//   }
 
// },[createAnswer, socket]
// )

// const handlePartnerAnswer=useCallback(async({answer})=>{
//   try{
// await setRemoteAnswer(answer);
// socket.emit("connection-established");
// navigate("/chatroom");
//   }
//   catch(err){
//     console.log("error in accepting the partner answer",err)
//   }
// }
// ,[navigate, setRemoteAnswer, socket])
// useEffect(()=>{
// socket.on("offer",handlePartnerOffer)
//   socket.on("partner-found",handlePartner)
//   socket.on('answer',handlePartnerAnswer)
//   return (
//     socket.off("offer",handlePartnerOffer),
//     socket.off("partner-found",handlePartner),
//     socket.off("answer",handlePartnerAnswer)
//   )
// },[handlePartner, handlePartnerAnswer, handlePartnerOffer, socket])
 const buttonText = useMemo(() => ["Connect", "Gossip", "Meet"], []);
  const [currentText,setCurrentText]=React.useState(buttonText[0]);
  React.useEffect(()=>{
    const interval=setInterval(()=>{
      setCurrentText((prev)=>
        buttonText[(buttonText.indexOf(prev)+1)%buttonText.length]
      )
    },3000);
    return ()=>clearInterval(interval);
  },[buttonText]);
  return (
  <button className=" bg-gradient-to-br from-purple-300 to-purple-700 px-3 py-1 text-xl font-bold dark:text-black rounded-lg relative mt-6 focus:outline-none  min-w-[110px] overflow-hidden" onClick={handleNavigation}>
  <AnimatePresence mode="wait">
    {currentText && (
      <motion.span className="inline-block"
        key={currentText}
        initial={{ opacity: 0.5,x:50 }}
        animate={{ opacity: 1,x:0 }}
        exit={{ opacity: 0, x:-50}}
        transition={{ duration: 0.3 }}
      >
        {currentText}
      </motion.span> 
    )}
  </AnimatePresence>
 <span className="w-[90%] mx-auto h-[1px] absolute -bottom-px inset-x-0 overflow-hidden rounded-lg bg-gradient-to-r from-transparent via-sky-200 via-blue-500 via-sky-200 to-transparent  border-none hover:animate-underline z-2"></span>
</button>
  )
}

export default AnimatedButton
