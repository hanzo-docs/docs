import React from "react";
import { motion } from "framer-motion";

interface SectionHeaderProps {
  title: string;
  description: string;
  badge?: string;
  badgeColor?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  description,
  badge,
  badgeColor = "bg-[#fd4444]/20 text-[#fd4444]"
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="text-center mb-12"
    >
      {badge && (
        <div className={`inline-block px-4 py-1 rounded-full ${badgeColor} text-sm font-medium mb-6`}>
          {badge}
        </div>
      )}
      <h3 className="text-3xl font-bold text-white mb-6">
        {title}
      </h3>
      <p className="text-lg text-neutral-300 max-w-3xl mx-auto">
        {description}
      </p>
    </motion.div>
  );
};

export default SectionHeader;
