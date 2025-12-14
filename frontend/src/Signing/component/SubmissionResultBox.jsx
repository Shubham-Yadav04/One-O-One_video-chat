import React from 'react'
import {motion} from "motion/react"
function SubmissionResultBox({status,message}) {
  return (
    <motion.div className={`fixed top-3 right-5 w-[200px] px-4 py-2 text-xs text-black rounded-md font-semibold ${status==="success"?"bg-green-200":"bg-red-100"}`}
    initial={{
        x:20,
        opacity:0.2
    }}
    animate={{
        x:0,
        opacity:1
    }}
    exit={{
        x:30,
        opacity:0.2
    }}
    transition={{
        duration:0.3,
        ease:'linear'
    }}
    >
      <h1>{message}</h1>
    </motion.div>
  )
}

export default SubmissionResultBox
