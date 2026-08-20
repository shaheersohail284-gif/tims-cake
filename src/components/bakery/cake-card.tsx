'use client';

import { motion } from 'framer-motion';
import { Plus, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/lib/store';
import { toast } from 'sonner';

interface CakeCardProps {
  cake: {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category: string;
    isFeatured: boolean;
  };
  index: number;
}

export default function CakeCard({ cake, index }: CakeCardProps) {
  const addItem = useCartStore((s) => s.addItem);

  const handleAdd = () => {
    addItem({
      cakeId: cake.id,
      name: cake.name,
      price: cake.price,
      image: cake.image,
    });
    toast.success(`${cake.name} added to cart`, {
      description: `$${cake.price.toFixed(2)}`,
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
        <div className="mt-4 flex items-center justify-between">
          <span className="font-[family-name:var(--font-playfair)] text-xl font-bold text-primary">
            ${cake.price.toFixed(2)}
          </span>
          <Button
            size="sm"
            onClick={handleAdd}
            className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all duration-200 gap-1.5 text-xs font-medium"
          >
            <Plus className="w-3.5 h-3.5" />
            Add to Cart
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
