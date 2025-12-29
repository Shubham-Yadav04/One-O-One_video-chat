/**
 * @description      :
 * @author           : lenovo
 * @group            :
 * @created          : 12/09/2025 - 02:29:18
 *
 * MODIFICATION LOG
 * - Version         : 1.0.0
 * - Date            : 12/09/2025
 * - Author          : lenovo
 * - Modification    :
 **/
/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "motion/react";
import {
  HDVideoIcon,
  SmartAudioIcon,
  MultiDeviceIcon,
  SecurityIcon,
  GroupIcon,
  GlobalIcon,
} from "../../../../media/icons/index.js";

const FeaturesGrid = () => {
  const features = [
    {
      icon: HDVideoIcon,
      title: "HD Video Quality",
      description:
        "Experience crystal-clear 4K video calls with advanced noise cancellation and auto-focus technology.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: SmartAudioIcon,
      title: "Smart Audio",
      description:
        "AI-powered audio enhancement with echo cancellation and background noise suppression.",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: MultiDeviceIcon,
      title: "Multi-Device Sync",
      description:
        "Seamlessly switch between devices during calls. Start on mobile, continue on desktop.",
      gradient: "from-purple-500 to-pink-500",
    },
    // {
    //   icon: SecurityIcon,
    //   title: "Enterprise Security",
    //   description:
    //     "Bank-level encryption with end-to-end security and compliance with global standards.",
    //   gradient: "from-red-500 to-orange-500",
    // },
    // {
    //   icon: GroupIcon,
    //   title: "Group Collaboration",
    //   description:
    //     "Host up to 100 participants with screen sharing, virtual backgrounds, and breakout rooms.",
    //   gradient: "from-indigo-500 to-purple-500",
    // },
    {
      icon: GlobalIcon,
      title: "Global Infrastructure",
      description:
        "Low-latency connections worldwide with 99.9% uptime guarantee and automatic failover.",
      gradient: "from-teal-500 to-blue-500",
    },
  ];

  return (
    <section id="features" className="w-full py-20 px-4 md:px-20 bg-white dark:bg-gradient-to-b dark:from-zinc-900 dark:via-[#111] dark:to-black  ">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Powerful Features for{" "}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Modern Communication
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Everything you need for professional video calls, team meetings, and
            personal connections in one seamless platform.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="flex flex-wrap gap-2 justify-center items-center">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{
                scale: 1.03,
                y: -10,
                transition: { duration: 0.3 },
              }}
              className="group relative min-w-[200px] w-full md:w-[48%] lg:w-[23%] h-[250px]  "
            >
              <div className="bg-white dark:bg-slate-800 p-2 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 dark:border-slate-700 h-full">
                <div className="flex items-center px-2 gap-3 ">
                <div
                  className={`w-10 h-10 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <feature.icon className="w-6 h-6 " fill="white" />
                </div>

                {/* Content */}
                <h3 className="text-lg   font-bold text-gray-900 dark:text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-600 group-hover:to-blue-600 group-hover:bg-clip-text transition-all duration-300">
                  {feature.title}
                </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-sm px-6">
                  {feature.description}
                </p>

                {/* Hover effect overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:bg-gradient-to-bl dark:from-purple-900/30 dark:to-indigo-900/20 rounded-3xl p-8 border border-purple-100 dark:border-none dark:shadow-sm dark:shadow-purple-700">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to Experience the Difference?
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Join thousands of teams and individuals who have transformed their
              communication with our platform.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Try It Free Today
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
