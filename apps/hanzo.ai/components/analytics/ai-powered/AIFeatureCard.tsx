
import React from "react";
import { motion } from "framer-motion";

interface AIFeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const AIFeatureCard = ({ icon, title, description, delay }: AIFeatureCardProps) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="bg-gradient-to-br from-gray-900/60 to-gray-900/40 rounded-xl p-8 border border-gray-800 hover:border-purple-900/50 transition-colors group"
    >
      <div className="mb-5 transition-transform group-hover:scale-110 duration-300 transform-gpu">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-neutral-400">{description}</p>
    </motion.div>
  );
};

export default AIFeatureCard;
