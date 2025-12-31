'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  MapPin,
  Map,
  Calendar,
  FileText,
  Users,
  Settings,
  Menu,
  X,
  LogOut,
  Bell,
  Search,
  Navigation,
} from 'lucide-react';

const sidebarLinks = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/menus', icon: Navigation, label: 'Menus' },
  { href: '/admin/destinations', icon: MapPin, label: 'Destinations' },
  { href: '/admin/tours', icon: Map, label: 'Tours' },
  { href: '/admin/bookings', icon: Calendar, label: 'Bookings' },
  { href: '/admin/blog', icon: FileText, label: 'Blog Posts' },
  { href: '/admin/users', icon: Users, label: 'Users' },
  { href: '/admin/settings', icon: Settings, label: 'Settings' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-secondary-800 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-secondary-700">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">D</span>
            </div>
            <span className="text-white font-semibold">Admin Panel</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="p-4">
          <ul className="space-y-2">
            {sidebarLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary-500 text-white'
                        : 'text-secondary-300 hover:bg-secondary-700 hover:text-white'
                    }`}
                  >
                    <link.icon size={20} />
                    <span>{link.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-secondary-700">
          <button className="flex items-center gap-3 px-4 py-3 text-secondary-300 hover:text-white w-full">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden text-secondary-600"
              >
                <Menu size={24} />
              </button>
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={18} />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 w-64"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative text-secondary-600 hover:text-secondary-800">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  3
                </span>
              </button>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white font-medium">
                  A
                </div>
                <span className="hidden sm:block text-secondary-700 font-medium">Admin</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
