'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import Navbar from '@/components/bakery/navbar';
import Hero from '@/components/bakery/hero';
import MenuSection from '@/components/bakery/menu-section';
import AboutSection from '@/components/bakery/about-section';
import TestimonialsSection from '@/components/bakery/testimonials-section';
import ContactSection from '@/components/bakery/contact-section';
import Footer from '@/components/bakery/footer';
import AdminDashboard from '@/components/bakery/admin-dashboard';

export default function Home() {
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    const checkHash = () => {
      setShowAdmin(window.location.hash === '#admin');
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  if (showAdmin) {
    return <AdminDashboard />;
  }

  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />
      <MenuSection />
      <AboutSection />
      <TestimonialsSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
