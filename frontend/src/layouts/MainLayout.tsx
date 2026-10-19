import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Truck,
  DollarSign,
  FileText,
  Settings,
} from 'lucide-react';

export const MainLayout: React.FC = () => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'POS / Sales', href: '/pos', icon: ShoppingCart },
    { name: 'Products', href: '/products', icon: Package },
    { name: 'Suppliers', href: '/suppliers', icon: Truck },
    { name: 'Customers', href: '/customers', icon: Users },
    { name: 'Finances', href: '/finances', icon: DollarSign },
    { name: 'Reports', href: '/reports', icon: FileText },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col border-r border-slate-800">
        <div className="h-16 flex items-center px-6 border-b border-slate-800 gap-3">
          <ShoppingBag className="w-7 h-7 text-emerald-500" />
          <span className="font-bold text-lg tracking-tight text-white">GSMS Portal</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 text-xs text-slate-500 text-center">
          GSMS v1.0.0 &bull; Enterprise ERP
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8">
          <h1 className="text-xl font-semibold text-gray-800">Grocery Shop Management System</h1>
          <div className="flex items-center gap-4">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              System Online
            </span>
            <div className="text-sm text-gray-600 font-medium">Administrator</div>
          </div>
        </header>

        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
