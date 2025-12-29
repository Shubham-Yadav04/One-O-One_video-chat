
import { useEffect, useState, useMemo } from "react";

import Navbar from "./components/navbar/Navbar.jsx";
import AnimatedButton from "./components/utils/AnimatedButton.jsx";
import InfoSection from "./components/InfoSection/InfoSection.jsx";
/* eslint-disable no-unused-vars */
import { motion, AnimatePresence } from "motion/react";
import Footer from "./components/InfoSection/components/Footer.jsx";
function HomePage() {

 
  const headingText = useMemo(() => ["Anytime", "Anywhere", "With Anyone"], []);

  const [currentHeading, setCurrentHeading] = useState(headingText[0]);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeading(
        (prev) =>
          headingText[(headingText.indexOf(prev) + 1) % headingText.length]
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [currentHeading, headingText]);
  return (
    <>
      <div className="w-full relative">
        <div
          className=" md:max-w-4xl  mx-auto bg-neutral-50 min-h-[50vh] md:min-h-[90vh] bg-transparent flex items-center justify-center flex-col relative z-10"
          id="home"
        >
          <Navbar />
          <div className="w-full h-fit flex flex-col items-center justify-center ">
          <h1 className=" w-full p-4 text-5xl md:min-w-4xl md:text-7xl font-extrabold tracking-wide text-center text-transparent bg-clip-text bg-gradient-to-b from-purple-600 to-purple-300 !leading-tight overflow-hidden ">
            MEET, TALK & SHARE </h1>
            <AnimatePresence mode="wait">
              {headingText && (
                <h1 className="text-xl w-full  h-fit  text-center  font-bold  text-transparent bg-clip-text bg-gradient-to-b from-purple-600 to-purple-300 ">
                <motion.span
                  key={currentHeading}
                  className="inline-block w-[300px] h-fit"
                  initial={{
                    opacity: 0,
                    y: 50,
                    scaleY: 0.4,
                    filter: "blur(10px)",
                  }}
                  animate={{ opacity: 1, y: 0, scaleY: 1, filter: "blur(0px)" }}
                  exit={{
                    opacity: 0,
                    y: 50,
                    scaleY: 0.4,
                    filter: "blur(10px)",
                  }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                  <span className="bg-clip-text text-transparent bg-gradient-to-b from-purple-600 to-purple-300 text-4xl font-extrabold italic">
                    {currentHeading}.
                  </span>
                </motion.span>
                </h1>
              )}
            </AnimatePresence>
          </div>
          <p className="max-w-2xl text-xs md:text-sm text-neutral-500 mt-6 selection:text-white selection:bg-purple-200 dark:selection:bg-purple-400 dark:selection:text-black p-3">
         
            Our platform makes one-to-one and group video calls effortless — no
            downloads, no complexity. Whether it’s catching up with friends,
            hosting team meetings, or connecting with your community, enjoy
            secure, high-quality video calls directly from your browser or app.
          </p>
          <AnimatedButton />
        </div>
      </div>
      <InfoSection />
      <Footer/>
    </>
  );
}

export default HomePage;
