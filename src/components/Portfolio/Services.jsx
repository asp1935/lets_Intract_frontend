import React from "react";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.4, 0, 0.2, 1],
    },
  },
};

const Services = ({ services }) => {
  return (
    <section
      className="py-16 bg-gray-900"
      id="services"
      style={{ fontFamily: "'Poppins', sans-serif" }}
    >
      <div className="container mx-auto px-6 max-w-7xl">
        {/* Header */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0, y: -30 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
          }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl font-extrabold mb-4 text-color-s leading-tight tracking-tight">
            Our Services
          </h2>
          <p className="max-w-3xl mx-auto text-lg text-gray-300 font-medium">
            We offer comprehensive solutions to grow your business and help you achieve your goals.
          </p>
          <div
            className="mx-auto mt-6 rounded-full"
            style={{
              width: "90px",
              height: "9px",
              background: "linear-gradient(135deg, var(--primary-color), #1a3a8f)",
              filter: "drop-shadow(0 0 8px var(--primary-color))",
            }}
          />
        </motion.div>

        {/* Cards (center aligned row always) */}
        <motion.div
          className="flex flex-wrap justify-center gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="w-full sm:w-[300px] bg-gray-800 rounded-2xl p-8 shadow-xl border border-blue-700 cursor-pointer
              hover:shadow-2xl hover:-translate-y-4 transition-transform duration-500 ease-in-out"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <h3 className="text-2xl font-semibold mb-4 text-color-s text-center">
                {service.title}
              </h3>
              <p className="text-gray-300 font-medium leading-relaxed text-center">
                {service.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <style >{`
        .text-color {
          background: linear-gradient(135deg, var(--primary-color), #1a3a8f);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }

        .text-color-s {
          background: linear-gradient(135deg, var(--primary-color), #f8f9fd);
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
        }
      `}</style>
    </section>
  );
};

export default Services;
