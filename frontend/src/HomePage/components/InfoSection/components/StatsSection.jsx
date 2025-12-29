/**
 * @description      :
 * @author           : lenovo
 * @group            :
 * @created          : 09/09/2025 - 02:58:58
 *
 * MODIFICATION LOG
 * - Version         : 1.0.0
 * - Date            : 09/09/2025
 * - Author          : lenovo
 * - Modification    :
 **/

import React, { useState, useEffect } from "react";
import { motion } from "motion/react";
import {
  UsersIcon,
  PhoneIcon,
  UptimeIcon,
  GlobalIcon,
} from "../../../../media/icons/"

const StatsSection = () => {
  const [isVisible, setIsVisible] = useState(false);

  const stats = [
    {
      number: "10M+",
      label: "Active Users",
      description: "Monthly active users worldwide",
      icon: UsersIcon,
      color: "from-blue-500 to-cyan-500",
    },
    {
      number: "50M+",
      label: "Calls Made",
      description: "Video calls completed this year",
      icon: PhoneIcon,
      color: "from-green-500 to-emerald-500",
    },
    {
      number: "99.9%",
      label: "Uptime",
      description: "Reliability you can count on",
      icon: UptimeIcon,
      color: "from-purple-500 to-pink-500",
    },
    {
      number: "150+",
      label: "Countries",
      description: "Global reach and availability",
      icon: GlobalIcon,
      color: "from-orange-500 to-red-500",
    },
  ];

  const CounterAnimation = ({ end, duration = 2000 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!isVisible) return;

      let startTime;
      const animate = (currentTime) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);

        // Extract number from string (e.g., "10M+" -> 10)
        const numericValue = parseFloat(end.replace(/[^\d.]/g, ""));
        const currentCount = Math.floor(progress * numericValue);

        setCount(currentCount);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCount(numericValue);
        }
      };

      requestAnimationFrame(animate);
    }, [end, duration]);

    // Format the number back to original format
    const formatNumber = (num) => {
      if (end.includes("M+")) return `${num}M+`;
      if (end.includes("%")) return `${num}%`;
      if (end.includes("+")) return `${num}+`;
      return num.toString();
    };

    return <span>{formatNumber(count)}</span>;
  };

  return (
    <section className="py-20 px-4 md:px-20 w-full  relative overflow-hidden">
      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold text-neutral-300 mb-6">
            Trusted by Millions{" "}
            <span className="bg-gradient-to-br from-orange-600 via-red-200 to-yellow-400  bg-clip-text text-transparent">
              Worldwide
            </span>
          </h2>
          <p className="text-lg text-zinc-700 dark:text-gray-500 max-w-3xl mx-auto">
            Our platform powers connections across the globe, enabling
            meaningful conversations and productive collaborations every day.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              onViewportEnter={() => setIsVisible(true)}
              whileHover={{
                y: -5,
                transition: { duration: 0.3 },
              }}
              className="group"
            >
              <div className=" bg-white/10 dark:bg-slate-800/20  p-8 rounded-2xl border border-white/20 dark:border-slate-700/50 text-center hover:bg-white/15 transition-all duration-300 md:h-[300px]">
                {/* Icon */}
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${stat.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300`}
                >
                  <stat.icon className="w-8 h-8" fill="white" />
                </div>

                {/* Number */}
                <div className="text-3xl md:text-4xl font-semibold text-neutral-400 mb-2">
                  <CounterAnimation end={stat.number} />
                </div>

                {/* Label */}
                <h3 className="text-lg font-semibold text-zinc-800 dark:text-white mb-2">
                  {stat.label}
                </h3>

                {/* Description */}
                <p className="text-[#111] dark:text-gray-300 text-xs">{stat.description}</p>

                {/* Animated border */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-900/20 to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 "></div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <div className="bg-white/5 dark:bg-slate-800/20 backdrop-blur-lg rounded-3xl p-8 border border-white/10 dark:border-slate-700/50">
            <h3 className="text-2xl font-bold text-white mb-4">
              Join the Global Community
            </h3>
            <p className="text-black font-semibold dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              Be part of a growing community that values quality, security, and
              seamless communication. Experience the difference that millions of
              users trust every day.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Get Started Free
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default StatsSection;
