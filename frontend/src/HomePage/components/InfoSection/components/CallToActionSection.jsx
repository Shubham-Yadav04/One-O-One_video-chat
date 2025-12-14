/**
 * @description      :
 * @author           : lenovo
 * @group            :
 * @created          : 09/09/2025 - 02:24:59
 *
 * MODIFICATION LOG
 * - Version         : 1.0.0
 * - Date            : 09/09/2025
 * - Author          : lenovo
 * - Modification    :
 **/
/* eslint-disable no-unused-vars */
import React from "react";
import { motion } from "motion/react";
import {
  RocketIcon,
  ShieldIcon,
  LightningIcon,
  DiamondIcon,
} from "../../../../media/icons";

const CallToActionSection = () => {
  const features = [
    { icon: RocketIcon, text: "No downloads required" },
    { icon: ShieldIcon, text: "Enterprise-grade security" },
    { icon: LightningIcon, text: "Lightning-fast setup" },
    { icon: DiamondIcon, text: "Premium support included" },
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 dark:from-black dark:via-black dark:to-[#111] relative overflow-hidden">
      <div className="relative max-w-6xl mx-auto text-center">
        {/* Main CTA Content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-neutral-300 mb-6 leading-tight">
            Ready to
            <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent">
              Transform
            </span>
            <br />
            Your Communication?
          </h2>
          <p className="text-sm md:text-xl text-gray-400 max-w-4xl mx-auto leading-relaxed mb-8">
            Join millions of users who have already discovered the power of
            seamless, secure, and stunning video communication. Start your
            journey today.
          </p>
        </motion.div>

        {/* Feature Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: 10 }}
              className="bg-white/10 rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300"
            >
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <feature.icon className="w-6 h-6" fill="white" />
              </div>
              <p className="text-white font-medium text-base">{feature.text}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12"
        >
          <motion.button
            whileHover={{ scale: 1.05, y: 10 }}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-full text-lg shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 min-w-[200px]"
          >
            Start Connecting
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
};

export default CallToActionSection;
