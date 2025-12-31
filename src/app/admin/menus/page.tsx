'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus,
  Edit,
  Trash2,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Loader2,
  Navigation,
  GripVertical,
} from 'lucide-react';

interface MenuItem {
  id: number;
  name_en: string;
  name_de: string;
  name_ru: string;
  url: string;
  parent_id: number | null;
  location: string;
  order_index: number;
  open_in_new_tab: boolean;
  icon: string;
  status: string;
  children?: MenuItem[];
}

export default function MenusPage() {
  const [menus, setMenus] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());
  const [activeLocation, setActiveLocation] = useState<'header' | 'footer'>('header');
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    fetchMenus();
  }, [activeLocation]);

  const fetchMenus = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/menus?location=${activeLocation}`);
      if (response.ok) {
        const data = await response.json();
        setMenus(data);
        // Expand all parent items by default
        const parentIds = new Set(data.map((item: MenuItem) => item.id));
        setExpandedItems(parentIds);
      }
    } catch (error) {
      console.error('Error fetching menus:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpand = (id: number) => {
    setExpandedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/menus/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchMenus();
      }
    } catch (error) {
      console.error('Error deleting menu:', error);
    } finally {
      setDeleteId(null);
    }
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);

    return (
      <div key={item.id}>
        <div
          className={`flex items-center gap-3 p-4 bg-white border-b border-secondary-100 hover:bg-secondary-50 transition-colors ${
            level > 0 ? 'ml-8 border-l-2 border-primary-200' : ''
          }`}
        >
          <GripVertical size={18} className="text-secondary-300 cursor-grab" />

          {hasChildren ? (
            <button
              onClick={() => toggleExpand(item.id)}
              className="p-1 hover:bg-secondary-200 rounded"
            >
              {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
            </button>
          ) : (
            <span className="w-7" />
          )}

          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-secondary-800">{item.name_en}</span>
              {item.open_in_new_tab && (
                <ExternalLink size={14} className="text-secondary-400" />
              )}
              <span
                className={`px-2 py-0.5 text-xs rounded-full ${
                  item.status === 'active'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-secondary-100 text-secondary-600'
                }`}
              >
                {item.status}
              </span>
            </div>
            <div className="text-sm text-secondary-500 mt-1">
              {item.url || '(no URL)'}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/admin/menus/${item.id}/edit`}
              className="p-2 text-secondary-600 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
            >
              <Edit size={18} />
            </Link>
            <button
              onClick={() => setDeleteId(item.id)}
              className="p-2 text-secondary-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div>
            {item.children!.map(child => renderMenuItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-secondary-800">Menu Management</h1>
          <p className="text-secondary-600">Sayt menyularini boshqaring</p>
        </div>
        <Link
          href="/admin/menus/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <Plus size={20} />
          <span>Yangi menyu</span>
        </Link>
      </div>

      {/* Location Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveLocation('header')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeLocation === 'header'
              ? 'bg-primary-500 text-white'
              : 'bg-white text-secondary-600 hover:bg-secondary-100'
          }`}
        >
          Header Menu
        </button>
        <button
          onClick={() => setActiveLocation('footer')}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeLocation === 'footer'
              ? 'bg-primary-500 text-white'
              : 'bg-white text-secondary-600 hover:bg-secondary-100'
          }`}
        >
          Footer Menu
        </button>
      </div>

      {/* Menu List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 size={40} className="animate-spin text-primary-500" />
        </div>
      ) : menus.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center">
          <Navigation size={48} className="mx-auto text-secondary-300 mb-4" />
          <h3 className="text-lg font-semibold text-secondary-800 mb-2">
            Menyu elementlari yo'q
          </h3>
          <p className="text-secondary-500 mb-4">
            {activeLocation === 'header' ? 'Header' : 'Footer'} menyusiga hali hech qanday element qo'shilmagan
          </p>
          <Link
            href="/admin/menus/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
          >
            <Plus size={18} />
            Birinchi elementni qo'shish
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-secondary-200 bg-secondary-50">
            <div className="flex items-center gap-2 text-sm text-secondary-600">
              <span>Jami: {menus.length} ta asosiy element</span>
            </div>
          </div>
          <div>
            {menus.map(item => renderMenuItem(item))}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-secondary-800 mb-2">
              O'chirishni tasdiqlang
            </h3>
            <p className="text-secondary-600 mb-6">
              Bu menyu elementini o'chirmoqchimisiz? Agar pastki menyulari bo'lsa, ular ham o'chiriladi.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 border border-secondary-200 rounded-lg hover:bg-secondary-50"
              >
                Bekor qilish
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
              >
                O'chirish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
