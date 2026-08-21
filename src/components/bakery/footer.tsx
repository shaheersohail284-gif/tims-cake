'use client';

import { Instagram, Facebook, Phone, Mail, Truck } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function Footer() {
  const scrollTo = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToAdmin = () => {
    window.location.hash = '#admin';
    window.dispatchEvent(new Event('hashchange'));
  };

  return (
    <footer className="bg-[oklch(0.25_0.05_40)] text-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo.png" alt="Tim's Cake" className="w-9 h-9 rounded-full object-cover" />
              <span className="font-[family-name:var(--font-playfair)] text-xl font-bold bakery-text text-white">
                Tim&apos;s Cake
              </span>
            </div>
            <p className="text-sm text-white/50 leading-relaxed">
              Handcrafted cakes made with love, real ingredients, and a touch of magic.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {['#home', '#menu', '#about', '#contact'].map((href) => (
                <li key={href}>
                  <button
                    onClick={() => scrollTo(href)}
                    className="text-sm text-white/50 hover:text-white transition-colors cursor-pointer"
                  >
                    {href.replace('#', '').charAt(0).toUpperCase() + href.replace('#', '').slice(1)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-white/50">
                <Truck className="w-4 h-4 flex-shrink-0" />
                Online Delivery Only
              </li>
              <li className="flex items-center gap-2 text-sm text-white/50">
                <Phone className="w-4 h-4 flex-shrink-0" />
                +92 335 3264769
              </li>
              <li className="flex items-center gap-2 text-sm text-white/50">
                <Mail className="w-4 h-4 flex-shrink-0" />
                shaheersohail284@gmail.com
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Follow Us
            </h4>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-colors duration-300"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
            <p className="mt-4 text-xs text-white/30">
              Mon-Sat: 8am - 8pm<br />
              Sun: 9am - 6pm
            </p>
          </div>
        </div>

        <Separator className="my-8 bg-white/10" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-white/30">
            2026 Tim&apos;s Cake. All rights reserved.
          </p>
          <button
            onClick={scrollToAdmin}
            className="text-xs text-white/20 hover:text-white/50 transition-colors cursor-pointer"
          >
            Admin
          </button>
        </div>
      </div>
    </footer>
  );
}
