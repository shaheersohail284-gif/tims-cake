'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const testimonials = [
  {
    name: 'Sarah Mitchell',
    role: 'Birthday Celebration',
    text: "The red velvet cake was absolutely stunning. Not only did it look like a work of art, but every bite was pure heaven. Tim's Cake made my daughter's birthday unforgettable.",
    rating: 5,
    initials: 'SM',
  },
  {
    name: 'James Parker',
    role: 'Wedding Cake',
    text: "We ordered a three-tier wedding cake and it exceeded every expectation. The flavors were incredible and the design matched our vision perfectly. Worth every penny.",
    rating: 5,
    initials: 'JP',
  },
  {
    name: 'Emily Chen',
    role: 'Regular Customer',
    text: "I've been ordering from Tim's Cake for over a year now and they never disappoint. The cheesecake is to die for, and the delivery is always right on time.",
    rating: 5,
    initials: 'EC',
  },
];

export default function TestimonialsSection() {
  return (
    <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-14"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-widest">
            Testimonials
          </span>
          <h2 className="mt-3 font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl md:text-5xl font-bold text-foreground bakery-text">
            What Our Customers Say
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
            >
              <Card className="h-full border-0 shadow-[0_2px_16px_oklch(0.35_0.08_50/6%)] bg-card hover:shadow-[0_6px_28px_oklch(0.35_0.08_50/10%)] transition-shadow duration-500">
                <CardContent className="p-6 flex flex-col">
                  <Quote className="w-8 h-8 text-primary/20 mb-3" />
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed flex-1">
                    &ldquo;{t.text}&rdquo;
                  </p>
                  <div className="mt-5 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-semibold text-primary">
                      {t.initials}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">
                        {t.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {t.role}
                      </div>
                    </div>
                    <div className="ml-auto flex gap-0.5">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star
                          key={j}
                          className="w-3.5 h-3.5 text-gold fill-gold"
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
