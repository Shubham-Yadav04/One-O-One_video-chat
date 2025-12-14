
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { UserAvatarIcon, StarIcon } from "../../../../media/icons";

const TestimonialsSection = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Product Manager",
      company: "TechCorp",
      avatar: UserAvatarIcon,
      content:
        "This platform has revolutionized how our remote team communicates. The video quality is exceptional, and the collaboration features have made our meetings more productive than ever.",
      rating: 5,
      highlight: "Revolutionized remote communication",
    },
    {
      name: "Marcus Johnson",
      role: "CEO",
      company: "StartupXYZ",
      avatar: UserAvatarIcon,
      content:
        "The reliability and security features give me complete confidence when discussing sensitive business matters. It's become an essential tool for our company's success.",
      rating: 5,
      highlight: "Essential for business success",
    },
    {
      name: "Emily Rodriguez",
      role: "Design Director",
      company: "CreativeStudio",
      avatar: UserAvatarIcon,
      content:
        "The screen sharing and virtual backgrounds make client presentations seamless. Our clients are always impressed with the professional quality of our video calls.",
      rating: 5,
      highlight: "Professional client presentations",
    },
    {
      name: "David Kim",
      role: "Software Engineer",
      company: "DevTeam Inc",
      avatar: UserAvatarIcon,
      content:
        "As a developer, I appreciate the low latency and crystal-clear audio. Code reviews and pair programming sessions feel just like being in the same room.",
      rating: 5,
      highlight: "Perfect for technical collaboration",
    },
    {
      name: "Lisa Thompson",
      role: "Marketing Director",
      company: "GrowthCo",
      avatar: UserAvatarIcon,
      content:
        "The analytics and call insights help us optimize our client meetings. The platform has significantly improved our team's efficiency and client satisfaction.",
      rating: 5,
      highlight: "Improved team efficiency",
    },
  ];

  const nextTestimonial = () => {
    setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <section id="about" className="py-20 px-4 bg-gradient-to-br from-gray-50 to-blue-50 dark:from-black dark:via-[#111] dark:to-slate-900">
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
            What Our Users{" "}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Are Saying
            </span>
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Don't just take our word for it. Here's what real users from around
            the world have to say about their experience.
          </p>
        </motion.div>

        {/* Main Testimonial Display */}
        <div className="relative max-w-4xl mx-auto">
          <motion.div
            key={activeTestimonial}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gradient-to-br dark:from-[#111] dark:via-purple-800 dark:to-black rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-100 dark:border-slate-700"
          >
          
            <div className="text-3xl text-purple-200 dark:text-purple-400 mb-2">
              "
            </div>

            {/* Testimonial Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-8 italic">
                  {testimonials[activeTestimonial].content}
                </p>

                {/* User Info */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                      {React.createElement(testimonials[activeTestimonial].avatar, { className: "w-8 h-8", fill: "white" })}
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white">
                        {testimonials[activeTestimonial].name}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-400">
                        {testimonials[activeTestimonial].role} at{" "}
                        {testimonials[activeTestimonial].company}
                      </p>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex space-x-1">
                    {[...Array(testimonials[activeTestimonial].rating)].map(
                      (_, i) => (
                        <span key={i} className="text-yellow-400 text-sm">
                          ⭐
                        </span>
                      )
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Navigation Buttons */}
          <div className="flex justify-center space-x-4 mt-8">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={prevTestimonial}
              className="w-12 h-12 bg-white dark:bg-slate-800 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 border border-gray-200 dark:border-slate-600"
            >
              ←
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={nextTestimonial}
              className="w-12 h-12 bg-white dark:bg-slate-800 rounded-full shadow-lg hover:shadow-xl flex items-center justify-center text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-all duration-300 border border-gray-200 dark:border-slate-600"
            >
              →
            </motion.button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-2 mt-6">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveTestimonial(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === activeTestimonial
                    ? "bg-purple-600 scale-125"
                    : "bg-gray-300 dark:bg-gray-600 hover:bg-purple-400"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Trust Indicators
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-slate-700">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Trusted by Industry Leaders
            </h3>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
              <div className="text-2xl font-bold text-gray-400">
                🏢 Fortune 500
              </div>
              <div className="text-2xl font-bold text-gray-400">
                🎓 Universities
              </div>
              <div className="text-2xl font-bold text-gray-400">
                🏥 Healthcare
              </div>
              <div className="text-2xl font-bold text-gray-400">
                💼 Government
              </div>
              <div className="text-2xl font-bold text-gray-400">
                🚀 Startups
              </div>
            </div>
          </div>
        </motion.div> */}
      </div>
    </section>
  );
};

export default TestimonialsSection;
