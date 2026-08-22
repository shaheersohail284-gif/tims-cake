'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Star, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore, type PriceOption } from '@/lib/store';
import { toast } from 'sonner';

interface CakeCardProps {
  cake: {
    id: string;
    name: string;
    description: string;
    prices: string;
    image: string;
    category: string;
    isFeatured: boolean;
  };
  index: number;
}

export default function CakeCard({ cake, index }: CakeCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [showWeights, setShowWeights] = useState(false);
  const [selectedWeight, setSelectedWeight] = useState<string | null>(null);

  let priceOptions: PriceOption[] = [];
  try {
    priceOptions = JSON.parse(cake.prices || '[]');
  } catch {
    /* ignore parse errors */
  }

  const startingPrice = priceOptions.length > 0
    ? Math.min(...priceOptions.map((p) => p.price))
    : 0;

  const handleAdd = (weight: string, price: number) => {
    addItem({
      cakeId: cake.id,
      name: cake.name,
      price,
      image: cake.image,
      weight,
    });
    setSelectedWeight(weight);
    setShowWeights(false);
    toast.success(`${cake.name} (${weight}) added to cart`, {
      description: `Rs. ${price.toLocaleString()}`,
    });
  };

  const categoryColors: Record<string, string> = {
    classic: 'bg-[oklch(0.95_0.02_60)] text-[oklch(0.35_0.08_50)]',
    premium: 'bg-gold/20 text-[oklch(0.50_0.12_65)]',
    seasonal: 'bg-primary/10 text-primary',
    signature: 'bg-[oklch(0.22_0.04_40)] text-white',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
      whileHover={{ y: -4 }}
      className="group bg-card rounded-2xl overflow-hidden shadow-[0_2px_16px_oklch(0.35_0.08_50/6%)] hover:shadow-[0_8px_32px_oklch(0.35_0.08_50/12%)] transition-shadow duration-500"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <motion.img
          src={cake.image}
          alt={cake.name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {cake.isFeatured && (
          <div className="absolute top-3 left-3">
            <Badge className="bg-gold text-white border-0 gap-1 text-xs font-medium shadow-sm">
              <Star className="w-3 h-3" fill="currentColor" />
              Featured
            </Badge>
          </div>
        )}

        <div className="absolute top-3 right-3">
          <Badge className={`${categoryColors[cake.category] || ''} border-0 text-xs capitalize`}>
            {cake.category}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5">
        <h3 className="font-[family-name:var(--font-playfair)] text-lg font-semibold text-foreground leading-snug">
          {cake.name}
        </h3>
        <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {cake.description}
        </p>

        {/* Starting price */}
        <div className="mt-3">
          <span className="text-xs text-muted-foreground">Starting from</span>
          <span className="ml-1.5 font-[family-name:var(--font-playfair)] text-xl font-bold text-primary">
            Rs. {startingPrice.toLocaleString()}
          </span>
        </div>

        {/* Weight selector + Add button */}
        <div className="mt-4 relative">
          <Button
            onClick={() => setShowWeights(!showWeights)}
            className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.01] transition-all duration-200 gap-1.5 text-xs font-medium py-5"
          >
            <Plus className="w-3.5 h-3.5" />
            {selectedWeight
              ? `Add ${selectedWeight} — Rs. ${priceOptions.find((p) => p.weight === selectedWeight)?.price.toLocaleString()}`
              : 'Select Weight & Add'}
            <ChevronDown className={`w-3.5 h-3.5 ml-auto transition-transform duration-200 ${showWeights ? 'rotate-180' : ''}`} />
          </Button>

          {/* Weight dropdown */}
          {showWeights && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute bottom-full left-0 right-0 mb-2 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-20"
            >
              <div className="px-3 py-2 border-b border-border">
                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  Choose Weight
                </span>
              </div>
              {priceOptions.map((opt) => (
                <button
                  key={opt.weight}
                  onClick={() => handleAdd(opt.weight, opt.price)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 text-sm hover:bg-primary/5 transition-colors cursor-pointer ${
                    selectedWeight === opt.weight ? 'bg-primary/10 text-primary font-medium' : 'text-foreground'
                  }`}
                >
                  <span className="font-medium">{opt.weight}</span>
                  <span className="text-primary font-semibold">
                    Rs. {opt.price.toLocaleString()}
                  </span>
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
