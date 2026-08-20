'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, Clock, Truck, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { useCartStore } from '@/lib/store';
import { toast } from 'sonner';

const contactInfo = [
  { icon: Truck, label: 'Delivery', value: 'Online delivery — we come to you!' },
  { icon: Phone, label: 'Call / WhatsApp', value: '+92 335 3264769' },
  { icon: Mail, label: 'Email Us', value: 'shaheersohail284@gmail.com' },
  { icon: Clock, label: 'Hours', value: 'Mon-Sat: 8am - 8pm' },
];

function ContactInfoCards() {
  return (
    <>
      {contactInfo.map((info, i) => {
        const Icon = info.icon;
        return (
          <motion.div
            key={info.label}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <Card className="border-0 shadow-sm bg-card">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">{info.label}</div>
                  <div className="text-sm font-medium text-foreground">{info.value}</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </>
  );
}

export default function ContactSection() {
  const [submitting, setSubmitting] = useState(false);
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);
  const getTotal = useCartStore((s) => s.getTotal);

  const [form, setForm] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    deliveryAddress: '',
    deliveryDate: '',
    deliveryTime: '',
    notes: '',
  });

  useEffect(() => {
    if (window.location.hash === '#contact') {
      document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) {
      toast.error('Your cart is empty! Add some cakes first.');
      return;
    }
    setSubmitting(true);

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          items: items.map((item) => ({
            cakeId: item.cakeId,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Something went wrong.');
        return;
      }

      toast.success('Order placed successfully!', {
        description: `Total: Rs. ${(data.totalAmount || getTotal()).toLocaleString()}`,
        duration: 5000,
      });
      clearCart();
      setForm({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        deliveryAddress: '',
        deliveryDate: '',
        deliveryTime: '',
        notes: '',
      });
    } catch {
      toast.error('Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-blush/40">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10 sm:mb-14"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-widest">
            Get in Touch
          </span>
          <h2 className="mt-3 font-[family-name:var(--font-playfair)] text-3xl sm:text-4xl md:text-5xl font-bold text-foreground bakery-text">
            Place Your Order
          </h2>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto text-sm sm:text-base">
            We deliver straight to your doorstep. Fill out the form and we&apos;ll handle the rest.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-2 space-y-4"
          >
            <ContactInfoCards />

            {items.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <Card className="border-0 shadow-sm bg-card">
                  <CardContent className="p-4">
                    <div className="text-xs text-muted-foreground mb-2">Your Cart</div>
                    <div className="space-y-1.5 max-h-32 overflow-y-auto">
                      {items.map((item) => (
                        <div key={item.cakeId} className="flex justify-between text-sm">
                          <span className="text-foreground truncate mr-2">
                            {item.name} x{item.quantity}
                          </span>
                          <span className="text-foreground font-medium flex-shrink-0">
                            Rs. {(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-2 border-t border-border flex justify-between text-sm font-semibold">
                      <span>Total</span>
                      <span className="text-primary">Rs. {getTotal().toLocaleString()}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-3"
          >
            <Card className="border-0 shadow-[0_4px_24px_oklch(0.35_0.08_50/8%)]">
              <CardContent className="p-6 sm:p-8">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="customerName">Full Name *</Label>
                      <Input id="customerName" name="customerName" value={form.customerName} onChange={handleChange} placeholder="John Doe" required className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customerEmail">Email *</Label>
                      <Input id="customerEmail" name="customerEmail" type="email" value={form.customerEmail} onChange={handleChange} placeholder="john@example.com" required className="rounded-xl" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="customerPhone">Phone *</Label>
                      <Input id="customerPhone" name="customerPhone" type="tel" value={form.customerPhone} onChange={handleChange} placeholder="(555) 123-4567" required className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deliveryAddress">Delivery Address *</Label>
                      <Input id="deliveryAddress" name="deliveryAddress" value={form.deliveryAddress} onChange={handleChange} placeholder="123 Main St, City" required className="rounded-xl" />
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="deliveryDate">Delivery Date *</Label>
                      <Input id="deliveryDate" name="deliveryDate" type="date" value={form.deliveryDate} onChange={handleChange} required className="rounded-xl" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="deliveryTime">Preferred Time *</Label>
                      <Input id="deliveryTime" name="deliveryTime" type="time" value={form.deliveryTime} onChange={handleChange} required className="rounded-xl" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="notes">Special Notes</Label>
                    <Textarea id="notes" name="notes" value={form.notes} onChange={handleChange} placeholder="Allergies, custom messages, special requests..." rows={3} className="rounded-xl resize-none" />
                  </div>
                  <Button type="submit" disabled={submitting || items.length === 0} className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.01] transition-all duration-200 py-5 text-sm font-medium">
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Placing Order...
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Place Order — Rs. {getTotal().toLocaleString()}
                      </>
                    )}
                  </Button>
                  {items.length === 0 && (
                    <p className="text-center text-xs text-muted-foreground">
                      Add some cakes to your cart first, then fill out the form to order.
                    </p>
                  )}
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
