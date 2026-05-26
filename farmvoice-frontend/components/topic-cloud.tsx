'use client';

import { motion } from 'framer-motion';

export function TopicCloud({ topics }: { topics: string[] }) {
  return (
    <div className="flex flex-wrap gap-3">
      {topics.map((topic, index) => (
        <motion.span
          key={topic}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className={`rounded-full px-4 py-2 text-sm font-medium shadow-sm ${index % 3 === 0 ? 'bg-savanna-orange text-white' : index % 3 === 1 ? 'bg-savanna-green text-white' : 'bg-sky-100 text-sky-900'}`}
        >
          {topic}
        </motion.span>
      ))}
    </div>
  );
}