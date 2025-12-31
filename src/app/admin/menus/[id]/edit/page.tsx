'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

interface MenuItem {
  id: number;
  name_en: string;
  name_de: string;
  name_ru: string;
  location: string;
  parent_id: number | null;
}

export default function EditMenuPage() {
  const router = useRouter();
  const params = useParams();
  const menuId = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [parentMenus, setParentMenus] = useState<MenuItem[]>([]);
  const [formData, setFormData] = useState({
    name_en: '',
    name_de: '',
    name_ru: '',
    url: '',
    parent_id: '',
    location: 'header',
    order_index: 0,
    open_in_new_tab: false,
    icon: '',
    status: 'active',
  });

  useEffect(() => {
    fetchMenu();
  }, [menuId]);

  useEffect(() => {
    if (formData.location) {
      fetchParentMenus();
    }
  }, [formData.location]);

  const fetchMenu = async () => {
    try {
      const response = await fetch(`/api/menus/${menuId}`);
      if (response.ok) {
        const data = await response.json();
        setFormData({
          name_en: data.name_en || '',
          name_de: data.name_de || '',
          name_ru: data.name_ru || '',
          url: data.url || '',
          parent_id: data.parent_id ? String(data.parent_id) : '',
          location: data.location || 'header',
          order_index: data.order_index || 0,
          open_in_new_tab: data.open_in_new_tab || false,
          icon: data.icon || '',
          status: data.status || 'active',
        });
      }
    } catch (error) {
      console.error('Error fetching menu:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchParentMenus = async () => {
    try {
      const response = await fetch(`/api/menus?location=${formData.location}`);
      if (response.ok) {
        const data = await response.json();
        // Exclude current item and its children from potential parents
        setParentMenus(
          data.filter((item: MenuItem) => !item.parent_id && item.id !== parseInt(menuId))
        );
      }
    } catch (error) {
      console.error('Error fetching parent menus:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await fetch(`/api/menus/${menuId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          parent_id: formData.parent_id ? parseInt(formData.parent_id) : null,
        }),
      });

      if (response.ok) {
        router.push('/admin/menus');
      } else {
        const data = await response.json();
        alert(data.error || 'Xatolik yuz berdi');
      }
    } catch (error) {
      console.error('Error updating menu:', error);
      alert('Xatolik yuz berdi');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 size={48} className="animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/admin/menus"
          className="p-2 hover:bg-secondary-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={24} className="text-secondary-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-secondary-800">Menyu elementini tahrirlash</h1>
          <p className="text-secondary-600">Menyu ma'lumotlarini o'zgartiring</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="bg-white rounded-xl p-6 shadow-sm space-y-6">
          {/* Location & Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Menyu joylashuvi *
              </label>
              <select
                value={formData.location}
                onChange={(e) => {
                  setFormData({ ...formData, location: e.target.value, parent_id: '' });
                }}
                className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="header">Header (Yuqori menyu)</option>
                <option value="footer">Footer (Pastki menyu)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                Holat
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="active">Faol</option>
                <option value="inactive">Nofaol</option>
              </select>
            </div>
          </div>

          {/* Parent Menu */}
          <div>
            <label className="block text-sm font-medium text-secondary-700 mb-2">
              Yuqori menyu (agar pastki menyu bo'lsa)
            </label>
            <select
              value={formData.parent_id}
              onChange={(e) => setFormData({ ...formData, parent_id: e.target.value })}
              className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">-- Asosiy menyu (top-level) --</option>
              {parentMenus.map((menu) => (
                <option key={menu.id} value={menu.id}>
                  {menu.name_en}
                </option>
              ))}
            </select>
            <p className="text-sm text-secondary-500 mt-1">
              Bo'sh qoldiring agar bu asosiy menyu elementi bo'lsa
            </p>
          </div>

          {/* Names */}
          <div className="border-t border-secondary-200 pt-6">
            <h3 className="text-lg font-medium text-secondary-800 mb-4">Menyu nomi</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Inglizcha *
                </label>
                <input
                  type="text"
                  value={formData.name_en}
                  onChange={(e) => setFormData({ ...formData, name_en: e.target.value })}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Home"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Nemischa
                </label>
                <input
                  type="text"
                  value={formData.name_de}
                  onChange={(e) => setFormData({ ...formData, name_de: e.target.value })}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Startseite"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Ruscha
                </label>
                <input
                  type="text"
                  value={formData.name_ru}
                  onChange={(e) => setFormData({ ...formData, name_ru: e.target.value })}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Главная"
                />
              </div>
            </div>
          </div>

          {/* URL */}
          <div className="border-t border-secondary-200 pt-6">
            <h3 className="text-lg font-medium text-secondary-800 mb-4">Havola (URL)</h3>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-2">
                URL manzili
              </label>
              <input
                type="text"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="/tours yoki https://example.com"
              />
              <p className="text-sm text-secondary-500 mt-1">
                Ichki sahifalar uchun: /tours, /about, /contact <br />
                Tashqi saytlar uchun: https://example.com
              </p>
            </div>
          </div>

          {/* Options */}
          <div className="border-t border-secondary-200 pt-6">
            <h3 className="text-lg font-medium text-secondary-800 mb-4">Qo'shimcha sozlamalar</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Tartib raqami
                </label>
                <input
                  type="number"
                  value={formData.order_index}
                  onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  min="0"
                />
                <p className="text-sm text-secondary-500 mt-1">
                  Kichik raqam = birinchi o'rinda
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Icon (ixtiyoriy)
                </label>
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-4 py-3 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="home, map, user..."
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={formData.open_in_new_tab}
                  onChange={(e) => setFormData({ ...formData, open_in_new_tab: e.target.checked })}
                  className="w-5 h-5 text-primary-500 border-secondary-300 rounded focus:ring-primary-500"
                />
                <span className="text-sm font-medium text-secondary-700">
                  Yangi oynada ochish (tashqi havolalar uchun)
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-4 mt-6">
          <Link
            href="/admin/menus"
            className="px-6 py-3 border border-secondary-200 rounded-lg text-secondary-600 hover:bg-secondary-50 transition-colors"
          >
            Bekor qilish
          </Link>
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Saqlanmoqda...
              </>
            ) : (
              <>
                <Save size={20} />
                Saqlash
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
