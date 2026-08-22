'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Skeleton } from '@/components/ui/skeleton';
import CakeCard from './cake-card';

const categories = ['All', 'Classic', 'Premium', 'Seasonal', 'Signature'];

interface Cake {
  id: string;
  name: string;
  description: string;
  prices: string;
  image: string;
  category: string;
  isFeatured: boolean;
}

export default function MenuSection() {
  const [cakes, setCakes] = useState<Cake[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState('All');

  useEffect(() => {
    fetch('/api/cakes')
      .then((r) => r.json())
      .then((data) => {
        setCakes(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered =
    active === 'All'
      ? cakes
      : cakes.filter((c) => c.category.toLowerCase() === active.toLowerCase());

  return (
    <section id="menu" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-14"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-widest">
            Our Menu
          </span>
          <h2 className="mt-3 font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl md:text-5xl font-bold text-foreground bakery-text">
            Our Signature Collection
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
            Each cake is crafted from scratch using the finest ingredients,
            baked fresh, and finished by hand.
          </p>
        </motion.div>

        {/* Filter tabs */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 mb-10 sm:mb-12"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
                active === cat
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-secondary text-secondary-foreground hover:bg-primary/10 hover:text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </motion.div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden">
                <Skeleton className="aspect-[4/3] w-full" />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filtered.map((cake, i) => (
                <CakeCard key={cake.id} cake={cake} index={i} />
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {filtered.length === 0 && !loading && (
          <p className="text-center text-muted-foreground py-12">
            No cakes found in this category.
          </p>
        )}
      </div>
    </section>
  );
}
