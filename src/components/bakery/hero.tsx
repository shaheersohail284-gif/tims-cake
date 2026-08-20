'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Hero() {
  const scrollTo = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden grain-overlay"
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/80 via-primary/60 to-[oklch(0.93_0.04_15)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.98_0.01_80)] via-transparent to-transparent opacity-40" />

      {/* Floating decorations */}
      <motion.div
        className="absolute top-[15%] left-[8%] w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/10 backdrop-blur-sm"
        animate={{ y: [0, -18, 0], rotate: [0, 8, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute top-[25%] right-[10%] w-10 h-10 sm:w-14 sm:h-14 rounded-full bg-gold/20 backdrop-blur-sm"
        animate={{ y: [0, -14, 0], rotate: [0, -6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
      <motion.div
        className="absolute bottom-[25%] left-[15%] w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-[oklch(0.93_0.04_15)]/30 backdrop-blur-sm"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
      />
      <motion.div
        className="absolute bottom-[30%] right-[12%] w-6 h-6 sm:w-10 sm:h-10 rounded-full bg-white/15 backdrop-blur-sm"
        animate={{ y: [0, -12, 0], x: [0, 6, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white/90 text-sm font-medium mb-6 sm:mb-8">
            <Heart className="w-3.5 h-3.5 text-gold" fill="currentColor" />
            Handcrafted in small batches
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.15 }}
          className="font-[family-name:var(--font-playfair)] text-4xl sm:text-5xl md:text-7xl font-bold text-white bakery-text leading-tight"
        >
          Handcrafted{' '}
          <span className="italic text-gold">With Love</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
          className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-white/85 max-w-2xl mx-auto font-light leading-relaxed"
        >
          Every cake tells a story. Let us bake yours.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut', delay: 0.45 }}
          className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
        >
          <Button
            size="lg"
            className="rounded-full px-7 sm:px-8 bg-white text-primary hover:bg-white/90 shadow-lg hover:shadow-xl hover:scale-[1.03] transition-all duration-300 text-sm sm:text-base font-medium"
            onClick={() => scrollTo('#menu')}
          >
            Explore Our Menu
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full px-7 sm:px-8 border-white/40 text-white hover:bg-white/15 hover:text-white backdrop-blur-sm text-sm sm:text-base font-medium"
            onClick={() => scrollTo('#contact')}
          >
            Place an Order
          </Button>
        </motion.div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 100"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0,50 C240,90 480,10 720,50 C960,90 1200,10 1440,50 L1440,100 L0,100 Z"
            fill="oklch(0.98 0.01 80)"
          />
        </svg>
      </div>
    </section>
  );
}
