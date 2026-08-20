'use client';

import { motion } from 'framer-motion';
import { Users, Cake, Star, Truck } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const stats = [
  { icon: Users, value: '500+', label: 'Happy Customers' },
  { icon: Cake, value: '50+', label: 'Cake Varieties' },
  { icon: Star, value: '5 Star', label: 'Rating' },
  { icon: Truck, value: 'Same Day', label: 'Delivery' },
];

export default function AboutSection() {
  return (
    <section id="about" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-blush/40">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-[0_8px_40px_oklch(0.35_0.08_50/12%)]">
              <img
                src="https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=700&h=500&fit=crop"
                alt="Tim's Cake bakery"
                className="w-full aspect-[4/3] object-cover"
                loading="lazy"
              />
            </div>
            {/* Decorative accent */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 sm:w-32 sm:h-32 bg-primary/10 rounded-2xl -z-10" />
            <div className="absolute -top-4 -left-4 w-16 h-16 sm:w-20 sm:h-20 bg-gold/20 rounded-2xl -z-10" />
          </motion.div>

          {/* Text side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <span className="text-sm font-medium text-primary uppercase tracking-widest">
              Our Story
            </span>
            <h2 className="mt-3 font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl font-bold text-foreground bakery-text leading-tight">
              Baking Happiness Since 2015
            </h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              What started as a small kitchen experiment has grown into a beloved
              online cake shop. Tim&apos;s Cake was born from a simple belief:
              that the best cakes are made with patience, real butter, and a whole
              lot of heart — and delivered right to your doorstep.
            </p>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Every order is made fresh. Our buttercream is whipped
              by hand, our chocolate is tempered with care, and every cake is decorated
              with the attention it deserves. No shortcuts, no compromises — just pure
              handcrafted joy, delivered to your door.
            </p>

            {/* Stats */}
            <div className="mt-8 sm:mt-10 grid grid-cols-2 gap-3 sm:gap-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                >
                  <Card className="border-0 shadow-[0_2px_12px_oklch(0.35_0.08_50/5%)] bg-card hover:shadow-md transition-shadow duration-300">
                    <CardContent className="p-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <stat.icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-[family-name:var(--font-playfair)] text-lg font-bold text-foreground">
                          {stat.value}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {stat.label}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
