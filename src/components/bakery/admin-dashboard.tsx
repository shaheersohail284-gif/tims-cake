'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, DollarSign, Clock, CheckCircle, LogOut, Loader2,
  BarChart3, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@/components/ui/select';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import { toast } from 'sonner';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';

interface Admin {
  id: string;
  name: string;
  email: string;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  deliveryDate: string;
  deliveryTime: string;
  notes: string | null;
  totalAmount: number;
  status: string;
  createdAt: string;
  items: { cakeName: string; quantity: number; price: number }[];
}

interface Stats {
  totalOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  recentOrders: Order[];
  statusBreakdown: { status: string; count: number }[];
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  preparing: 'bg-purple-100 text-purple-800',
  ready: 'bg-green-100 text-green-800',
  delivered: 'bg-emerald-100 text-emerald-800',
  cancelled: 'bg-red-100 text-red-800',
};

const CHART_COLORS = ['#d4a853', '#e8a0b4', '#3d2c2c', '#fce4ec', '#a8d8a8', '#f4a460'];

export default function AdminDashboard() {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingIn, setLoggingIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [stats, setStats] = useState<Stats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tab, setTab] = useState('overview');

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/verify');
      if (res.ok) {
        const data = await res.json();
        setAdmin(data);
        fetchDashboard();
      } else {
        setAdmin(null);
      }
    } catch {
      setAdmin(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDashboard = async () => {
    try {
      const [statsRes, ordersRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/orders'),
      ]);
      if (statsRes.ok) setStats(await statsRes.json());
      if (ordersRes.ok) setOrders(await ordersRes.json());
    } catch {
      // silently fail
    }
  };

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Listen for hash change to show admin
  useEffect(() => {
    const handler = () => {
      if (window.location.hash === '#admin') {
        checkAuth();
      }
    };
    window.addEventListener('hashchange', handler);
    return () => window.removeEventListener('hashchange', handler);
  }, [checkAuth]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Login failed');
        return;
      }
      setAdmin(data);
      toast.success(`Welcome back, ${data.name}!`);
      fetchDashboard();
    } catch {
      toast.error('Login failed.');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/login', { method: 'DELETE' });
    } catch { /* noop */ }
    setAdmin(null);
    setStats(null);
    setOrders([]);
    window.location.hash = '';
    toast.success('Logged out.');
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'Failed to update.');
        return;
      }
      setOrders((prev) => prev.map((o) => (o.id === orderId ? data : o)));
      toast.success(`Order updated to "${newStatus}"`);
      fetchDashboard();
    } catch {
      toast.error('Failed to update order.');
    }
  };

  const getNextStatuses = (current: string): string[] => {
    const map: Record<string, string[]> = {
      pending: ['confirmed', 'preparing', 'cancelled'],
      confirmed: ['preparing', 'cancelled'],
      preparing: ['ready', 'cancelled'],
      ready: ['delivered'],
      cancelled: [],
      delivered: [],
    };
    return map[current] || [];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  // Login screen
  if (!admin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <Card className="border-0 shadow-[0_4px_24px_oklch(0.35_0.08_50/8%)]">
            <CardHeader className="text-center pb-2">
              <CardTitle className="font-[family-name:var(--font-playfair)] text-2xl">
                Admin Login
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Tim&apos;s Cake Dashboard
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email">Email</Label>
                  <Input
                    id="admin-email"
                    type="email"
                    value={loginForm.email}
                    onChange={(e) => setLoginForm((f) => ({ ...f, email: e.target.value }))}
                    placeholder="admin@timscake.com"
                    required
                    className="rounded-xl"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Password</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm((f) => ({ ...f, password: e.target.value }))}
                    placeholder="••••••••"
                    required
                    className="rounded-xl"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={loggingIn}
                  className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {loggingIn ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In'}
                </Button>
              </form>
              <Button
                variant="ghost"
                size="sm"
                className="w-full mt-3 text-muted-foreground"
                onClick={() => (window.location.hash = '')}
              >
                <X className="w-4 h-4 mr-1" /> Back to site
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Dashboard
  const pieData = stats?.statusBreakdown.map((s) => ({
    name: s.status.charAt(0).toUpperCase() + s.status.slice(1),
    value: s.count,
  })) || [];

  const barData = stats?.recentOrders.map((o) => ({
    name: o.customerName.split(' ')[0],
    total: o.totalAmount,
  })) || [];

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => (window.location.hash = '')}
            >
              ← Back to Site
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <h1 className="font-[family-name:var(--font-playfair)] text-lg font-semibold">
              Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:inline">{admin.email}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="rounded-full gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="overview" className="gap-1.5">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="orders" className="gap-1.5">
              <Package className="w-4 h-4" />
              Orders
            </TabsTrigger>
          </TabsList>

          {/* Overview tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stat cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                icon={Package}
                label="Total Orders"
                value={String(stats?.totalOrders || 0)}
                color="bg-primary/10 text-primary"
              />
              <StatCard
                icon={DollarSign}
                label="Total Revenue"
                value={`$${(stats?.totalRevenue || 0).toFixed(2)}`}
                color="bg-gold/15 text-[oklch(0.50_0.12_65)]"
              />
              <StatCard
                icon={Clock}
                label="Pending Orders"
                value={String(stats?.pendingOrders || 0)}
                color="bg-yellow-100 text-yellow-700"
              />
              <StatCard
                icon={CheckCircle}
                label="Delivered"
                value={String(
                  stats?.statusBreakdown.find((s) => s.status === 'delivered')?.count || 0
                )}
                color="bg-green-100 text-green-700"
              />
            </div>

            {/* Charts */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  {barData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={barData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.90 0.02 60)" />
                        <XAxis dataKey="name" fontSize={12} tickLine={false} />
                        <YAxis fontSize={12} tickLine={false} />
                        <Tooltip
                          contentStyle={{
                            borderRadius: '12px',
                            border: '1px solid oklch(0.90 0.02 60)',
                            fontSize: '13px',
                          }}
                        />
                        <Bar
                          dataKey="total"
                          fill="oklch(0.55 0.15 10)"
                          radius={[6, 6, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[250px] flex items-center justify-center text-sm text-muted-foreground">
                      No orders yet
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card className="border-0 shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-medium">Order Status</CardTitle>
                </CardHeader>
                <CardContent>
                  {pieData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          dataKey="value"
                          paddingAngle={3}
                        >
                          {pieData.map((_, i) => (
                            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            borderRadius: '12px',
                            border: '1px solid oklch(0.90 0.02 60)',
                            fontSize: '13px',
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-[250px] flex items-center justify-center text-sm text-muted-foreground">
                      No data yet
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Orders tab */}
          <TabsContent value="orders">
            <Card className="border-0 shadow-sm">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-xs">ID</TableHead>
                        <TableHead className="text-xs">Customer</TableHead>
                        <TableHead className="text-xs">Date</TableHead>
                        <TableHead className="text-xs">Items</TableHead>
                        <TableHead className="text-xs">Total</TableHead>
                        <TableHead className="text-xs">Status</TableHead>
                        <TableHead className="text-xs">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center py-12 text-muted-foreground">
                            No orders yet.
                          </TableCell>
                        </TableRow>
                      ) : (
                        orders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell className="text-xs font-mono">
                              {order.id.slice(0, 8)}
                            </TableCell>
                            <TableCell className="text-sm">
                              <div className="font-medium">{order.customerName}</div>
                              <div className="text-xs text-muted-foreground">{order.customerEmail}</div>
                            </TableCell>
                            <TableCell className="text-xs text-muted-foreground">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </TableCell>
                            <TableCell className="text-xs">
                              {order.items.map((it) => `${it.cakeName} x${it.quantity}`).join(', ')}
                            </TableCell>
                            <TableCell className="text-sm font-semibold">
                              ${order.totalAmount.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <Badge className={`${STATUS_COLORS[order.status] || ''} border-0 text-xs`}>
                                {order.status}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Select
                                onValueChange={(v) => updateStatus(order.id, v)}
                              >
                                <SelectTrigger className="w-32 h-8 text-xs rounded-lg">
                                  <SelectValue placeholder="Update" />
                                </SelectTrigger>
                                <SelectContent>
                                  {getNextStatuses(order.status).map((s) => (
                                    <SelectItem key={s} value={s} className="text-xs">
                                      {s.charAt(0).toUpperCase() + s.slice(1)}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <Card className="border-0 shadow-sm">
      <CardContent className="p-4 sm:p-5">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center flex-shrink-0`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold font-[family-name:var(--font-playfair)] text-foreground">
              {value}
            </div>
            <div className="text-xs text-muted-foreground">{label}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
