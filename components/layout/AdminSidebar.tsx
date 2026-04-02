"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, Users, ClipboardList, Settings, LogOut, Tags, AlertCircle } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logout } from '@/store/slices/authSlice';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
  { icon: Package, label: 'Inventory', href: '/admin/inventory' },
  { icon: Tags, label: 'Categories', href: '/admin/categories' },
  { icon: Users, label: 'Dealers', href: '/admin/dealers' },
  { icon: ClipboardList, label: 'Orders', href: '/admin/orders' },
  { icon: AlertCircle, label: 'Reports', href: '/admin/reports' },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const dispatch = useDispatch();

  return (
    <aside className="w-64 bg-gray-900 h-screen sticky top-0 flex flex-col">
      <div className="h-20 flex items-center px-8 border-b border-gray-800">
        <span className="font-bold text-xl tracking-tight text-white">
          Admin<span className="text-sky-500">Panel</span>
        </span>
      </div>

      <div className="flex-1 py-6 px-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname.includes(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? 'bg-sky-500 text-white font-medium shadow-md shadow-sky-500/20' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <item.icon className={`h-5 w-5 mr-3 ${isActive ? 'text-white' : 'text-gray-400'}`} />
              {item.label}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-gray-800">
        <button
          onClick={() => dispatch(logout())}
          className="flex items-center w-full px-4 py-3 rounded-xl text-gray-400 hover:bg-red-500/10 hover:text-red-500 transition-all"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Logout
        </button>
      </div>
    </aside>
  );
}