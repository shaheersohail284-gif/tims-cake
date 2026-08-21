'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cake, Menu, ShoppingBag, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { useCartStore } from '@/lib/store';
import CartSidebar from './cart-sidebar';

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Menu', href: '#menu' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const itemCount = useCartStore((s) => s.getItemCount());

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (href: string) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[oklch(0.98_0.01_80)]/95 backdrop-blur-md shadow-[0_2px_20px_oklch(0.35_0.08_50/8%)]'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <button
            onClick={() => scrollTo('#home')}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Cake className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
            </div>
            <span
              className={`font-[family-name:var(--font-playfair)] text-xl sm:text-2xl font-bold bakery-text transition-colors duration-300 ${
                scrolled ? 'text-[oklch(0.22_0.04_40)]' : 'text-white'
              }`}
            >
              Tim&apos;s Cake
            </span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => scrollTo(link.href)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:bg-primary/10 cursor-pointer ${
                  scrolled
                    ? 'text-[oklch(0.35_0.08_50)] hover:text-primary'
                    : 'text-white/90 hover:text-white hover:bg-white/15'
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              onClick={() => scrollTo('#menu')}
              className={`hidden sm:inline-flex rounded-full px-5 transition-all duration-300 hover:scale-[1.03] hover:shadow-lg ${
                scrolled
                  ? 'bg-gold text-[oklch(0.22_0.04_40)] hover:bg-gold/90 shadow-[0_2px_12px_oklch(0.76_0.15_75/30%)]'
                  : 'bg-gold/90 text-[oklch(0.22_0.04_40)] border border-gold/60 hover:bg-gold backdrop-blur-sm shadow-[0_2px_12px_oklch(0.76_0.15_75/25%)]'
              }`}
            >
              Order Now
            </Button>

            {/* Cart */}
            <Sheet open={cartOpen} onOpenChange={setCartOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`relative rounded-full transition-colors duration-300 ${
                    scrolled
                      ? 'text-[oklch(0.35_0.08_50)] hover:bg-primary/10'
                      : 'text-white hover:bg-white/15'
                  }`}
                >
                  <ShoppingBag className="w-5 h-5" />
                  {itemCount > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground text-[10px] font-bold rounded-full flex items-center justify-center"
                    >
                      {itemCount}
                    </motion.span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md p-0">
                <SheetTitle className="sr-only">Shopping Cart</SheetTitle>
                <CartSidebar onClose={() => setCartOpen(false)} />
              </SheetContent>
            </Sheet>

            {/* Mobile hamburger */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`md:hidden rounded-full ${
                    scrolled
                      ? 'text-[oklch(0.35_0.08_50)]'
                      : 'text-white'
                  }`}
                >
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 bg-[oklch(0.98_0.01_80)]">
                <SheetTitle className="font-[family-name:var(--font-playfair)] text-lg text-[oklch(0.22_0.04_40)]">
                  Tim&apos;s Cake
                </SheetTitle>
                <div className="mt-8 flex flex-col gap-1">
                  {navLinks.map((link, i) => (
                    <motion.button
                      key={link.href}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                      onClick={() => scrollTo(link.href)}
                      className="text-left px-4 py-3 rounded-xl text-[oklch(0.35_0.08_50)] font-medium hover:bg-primary/10 transition-colors cursor-pointer"
                    >
                      {link.label}
                    </motion.button>
                  ))}
                  <div className="mt-4 px-4">
                    <Button
                      className="w-full rounded-full bg-gold text-[oklch(0.22_0.04_40)] hover:bg-gold/90 hover:shadow-lg"
                      onClick={() => scrollTo('#menu')}
                    >
                      Order Now
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </motion.header>
  );
}
