/**
    * @description      : 
    * @author           : lenovo
    * @group            : 
    * @created          : 12/09/2025 - 01:38:25
    * 
    * MODIFICATION LOG
    * - Version         : 1.0.0
    * - Date            : 12/09/2025
    * - Author          : lenovo
    * - Modification    : 
**/

import React from "react";
import {motion}  from "motion/react";
import {
  HDVideoIcon,
  SecurityIcon,
  MultiDeviceIcon,
  LightningIcon,
} from "../../../../media/icons/index.js";

const HeroSection = () => {
  const features = [
    {
      icon: HDVideoIcon,
      title: "HD Video Calls",
      description: "Crystal clear video quality",
    },
    {
      icon: SecurityIcon,
      title: "Secure & Private",
      description: "End-to-end encryption",
    },
    {
      icon: MultiDeviceIcon,
      title: "Cross Platform",
      description: "Works on all devices",
    },
    {
      icon: LightningIcon,
      title: "Lightning Fast",
      description: "Low latency connections",
    },
  ];

  return (
    <section className="relative py-20 px-4 bg-gradient-to-b from-slate-50 via-blue-50 to-indigo-100 dark:from-black dark:via-[#111] dark:to-slate-800 overflow-hidden">
   
      <div className="absolute inset-0 overflow-hidden">
        
        <div className="absolute bottom-40 left-40 w-5 h-5 bg-blue-300 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur opacity-70 animate-pulse delay-1000"></div>

        <div className="absolute right-10 top-40 w-5 h-5 bg-blue-300 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur opacity-70 animate-pulse delay-1000"></div>
        <div className="absolute top-5 left-10  w-5 h-5 bg-blue-300 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur opacity-70 animate-pulse delay-1000"></div>
        <div className="absolute top-60 left-1/2 w-40 h-40 bg-pink-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur opacity-30  delay-500"></div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white/50 mb-6 leading-tight"
          >
            Connect with{" "}
            <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Anyone
            </span>
            <br />
            <span className="text-3xl md:text-5xl lg:text-6xl">Anywhere</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed"
          >
            Experience the future of video communication with our cutting-edge
            platform. Join millions of users worldwide who trust us for their
            most important conversations.
          </motion.p>
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-slate-700"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-6 h-6" fill="white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-[#2647F5] mb-2 text-center">
                {feature.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-center text-xs">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="text-center mt-16"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-2 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Start Your First Call
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
