'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCartStore } from '@/lib/store';

interface CartSidebarProps {
  onClose: () => void;
}

export default function CartSidebar({ onClose }: CartSidebarProps) {
  const items = useCartStore((s) => s.items);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const getTotal = useCartStore((s) => s.getTotal);
  const clearCart = useCartStore((s) => s.clearCart);

  const scrollToContact = () => {
    onClose();
    setTimeout(() => {
      document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-6 py-5 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-primary" />
          <h2 className="font-[family-name:var(--font-playfair)] text-lg font-semibold">
            Your Cart
          </h2>
          {items.length > 0 && (
            <span className="text-xs text-muted-foreground">({items.length} item{items.length !== 1 ? 's' : ''})</span>
          )}
        </div>
        {items.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearCart}
            className="text-xs text-muted-foreground hover:text-destructive"
          >
            Clear all
          </Button>
        )}
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <ShoppingBag className="w-7 h-7 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground font-medium">Your cart is empty</p>
            <p className="text-xs text-muted-foreground/70 mt-1">
              Browse our menu and add some cakes!
            </p>
          </div>
        ) : (
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.cakeId}
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20, height: 0 }}
                className="flex gap-3 py-3"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-foreground truncate">
                    {item.name}
                  </h4>
                  <p className="text-sm font-semibold text-primary mt-0.5">
                    ${item.price.toFixed(2)}
                  </p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <button
                      onClick={() => updateQuantity(item.cakeId, item.quantity - 1)}
                      className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center hover:bg-primary/10 transition-colors cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="text-sm font-medium w-6 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.cakeId, item.quantity + 1)}
                      className="w-7 h-7 rounded-lg bg-muted flex items-center justify-center hover:bg-primary/10 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => removeItem(item.cakeId)}
                      className="ml-auto w-7 h-7 rounded-lg flex items-center justify-center hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}
      </div>

      {/* Footer */}
      {items.length > 0 && (
        <div className="border-t border-border px-6 py-4 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-semibold text-foreground">
              ${getTotal().toFixed(2)}
            </span>
          </div>
          <Separator />
          <Button
            onClick={scrollToContact}
            className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.01] transition-all duration-200 py-5 font-medium"
          >
            Proceed to Checkout
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}
