'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Star, ChevronDown, ChevronLeft, ChevronRight, X, Expand } from 'lucide-react';
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
    images?: string[];
    category: string;
    isFeatured: boolean;
  };
  index: number;
}

export default function CakeCard({ cake, index }: CakeCardProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [showWeights, setShowWeights] = useState(false);
  const [selectedWeight, setSelectedWeight] = useState<string | null>(null);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [currentImg, setCurrentImg] = useState(0);
  const [fullscreenImg, setFullscreenImg] = useState(0);

  const allImages = cake.image ? [cake.image, ...(cake.images || [])] : [];

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
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5, delay: index * 0.08, ease: 'easeOut' }}
        whileHover={{ y: -4 }}
        className="group bg-card rounded-2xl overflow-hidden shadow-[0_2px_16px_oklch(0.35_0.08_50/6%)] hover:shadow-[0_8px_32px_oklch(0.35_0.08_50/12%)] transition-shadow duration-500"
      >
        {/* Image */}
        <div
          className="relative aspect-[4/3] overflow-hidden cursor-pointer"
          onClick={() => { setFullscreenImg(currentImg); setShowFullscreen(true); }}
        >
          <motion.img
            src={allImages[currentImg] || cake.image}
            alt={cake.name}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            loading="lazy"
          />
          {allImages.length > 1 && (
            <div className='absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10'>
              {allImages.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setCurrentImg(i); }}
                  className={`w-2 h-2 rounded-full transition-all ${i === currentImg ? 'bg-white w-5' : 'bg-white/50 hover:bg-white/75'}`}
                />
              ))}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Expand icon on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <div className="bg-black/40 backdrop-blur-sm rounded-full p-3">
              <Expand className="w-6 h-6 text-white" />
            </div>
          </div>

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

      {/* Fullscreen Image Modal */}
      <AnimatePresence>
        {showFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setShowFullscreen(false)}
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative max-w-4xl w-full max-h-[90vh]"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowFullscreen(false)}
                className="absolute -top-12 right-0 text-white/70 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-8 h-8" />
              </button>
              <img
                src={allImages[fullscreenImg] || cake.image}
                alt={cake.name}
                className="w-full h-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
              />
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={() => setFullscreenImg((fullscreenImg - 1 + allImages.length) % allImages.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white rounded-full p-2 transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={() => setFullscreenImg((fullscreenImg + 1) % allImages.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white rounded-full p-2 transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                  <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                    {allImages.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setFullscreenImg(i)}
                        className={`w-2.5 h-2.5 rounded-full transition-all ${i === fullscreenImg ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/70'}`}
                      />
                    ))}
                  </div>
                </>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent rounded-b-2xl p-4">
                <h3 className="font-[family-name:var(--font-playfair)] text-xl font-semibold text-white">
                  {cake.name}
                </h3>
                <p className="text-sm text-white/70 mt-1">Starting from Rs. {startingPrice.toLocaleString()}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
