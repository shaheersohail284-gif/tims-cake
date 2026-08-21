'use client';

import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const testimonials = [
  {
    name: 'Ayesha Khan',
    role: 'Birthday Party — DHA, Karachi',
    text: "Ordered the red velvet for my daughter's birthday and it was perfect. The cream cheese frosting was spot on and they delivered right on time to DHA Phase 5. My family loved it!",
    rating: 5,
    initials: 'AK',
  },
  {
    name: 'Ahmed Raza',
    role: 'Wedding — Clifton, Karachi',
    text: "We ordered a three-tier cake for our shaadi and it was exactly what we wanted. The design matched our mehndi theme and guests kept asking where we got it from. Truly amazing quality.",
    rating: 5,
    initials: 'AR',
  },
  {
    name: 'Fatima Noor',
    role: 'Regular Customer — Gulshan, Karachi',
    text: "Been ordering from Tim's Cake for almost a year now. Every Eid and special occasion, this is our go-to. The cheesecake is honestly the best I've had in Karachi. Never disappoints!",
    rating: 5,
    initials: 'FN',
  },
  {
    name: 'Hassan Ali',
    role: 'Office Event — Gulberg, Karachi',
    text: 'Ordered for our company anniversary and the caramel drip cake was a hit. Everyone in the office was asking for the name. Delivery to PECHS was smooth and on time. Will definitely order again.',
    rating: 5,
    initials: 'HA',
  },
  {
    name: 'Zainab Sheikh',
    role: 'Engagement — Defence, Karachi',
    text: "The chocolate cake was beyond amazing. It was the highlight of our engagement at a Defence venue. Rich flavor, beautiful presentation, and they were super cooperative with my custom message on top.",
    rating: 5,
    initials: 'ZS',
  },
  {
    name: 'Bilal Iqbal',
    role: 'Anniversary — Bahadurabad, Karachi',
    text: "Surprised my wife with the tiramisu cake for our anniversary. She absolutely loved it! The coffee flavor was authentic, layers were so soft. Tim's Cake made our special day even more memorable.",
    rating: 5,
    initials: 'BI',
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

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
