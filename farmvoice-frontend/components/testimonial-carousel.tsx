'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

type Testimonial = { name: string; quote: string; language: string };

export function TestimonialCarousel({ testimonials }: { testimonials: Testimonial[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % testimonials.length), 4500);
    return () => window.clearInterval(timer);
  }, [testimonials.length]);

  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div className="font-display text-2xl font-bold text-savanna-slate">Farmers trust it</div>
      <AnimatePresence mode="wait">
        <motion.article
          key={index}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35 }}
          className="mt-6 rounded-[1.5rem] bg-slate-50 p-5"
        >
          <p className="text-base leading-7 text-slate-700">“{testimonials[index].quote}”</p>
          <div className="mt-4 flex items-center justify-between text-sm font-semibold text-savanna-green">
            <span>{testimonials[index].name}</span>
            <span>{testimonials[index].language}</span>
          </div>
        </motion.article>
      </AnimatePresence>
      <div className="mt-4 flex gap-2">
        {testimonials.map((testimonial, slideIndex) => (
          <button
            key={testimonial.name}
            type="button"
            onClick={() => setIndex(slideIndex)}
            className={`h-2.5 flex-1 rounded-full transition ${slideIndex === index ? 'bg-savanna-green' : 'bg-slate-200'}`}
          />
        ))}
      </div>
    </div>
  );
}