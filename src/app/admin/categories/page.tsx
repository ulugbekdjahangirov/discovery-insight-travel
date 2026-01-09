'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  GripVertical,
  Loader2,
  Save,
  X,
  Home,
  Mountain,
  Compass,
  Landmark,
  Sun,
  Map,
} from 'lucide-react';

interface Category {
  id: number;
  slug: string;
  name_en: string;
  name_de: string;
  name_ru: string;
  description_en: string;
  description_de: string;
  description_ru: string;
  icon: string;
  display_order: number;
  show_in_menu: boolean;
  status: string;
  image: string;
  tours_count?: number;
}

const iconOptions = [
  { value: 'home', label: 'Home', icon: Home },
  { value: 'mountain', label: 'Mountain', icon: Mountain },
  { value: 'compass', label: 'Compass', icon: Compass },
  { value: 'landmark', label: 'Landmark', icon: Landmark },
  { value: 'sun', label: 'Sun', icon: Sun },
  { value: 'map', label: 'Map', icon: Map },
];

const defaultCategory: Partial<Category> = {
  slug: '',
  name_en: '',
  name_de: '',
  name_ru: '',
  description_en: '',
  description_de: '',
  description_ru: '',
  icon: 'map',
  display_order: 0,
  show_in_menu: true,
  status: 'active',
  image: '',
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  // Fetch categories
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/tour-categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      setError('Kategoriyalarni yuklashda xatolik');
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
    } else {
      setEditingCategory({ ...defaultCategory, display_order: categories.length + 1 });
    }
    setIsModalOpen(true);
    setError('');
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setError('');
  };

  const handleSave = async () => {
    if (!editingCategory) return;

    if (!editingCategory.name_en || !editingCategory.slug) {
      setError('Nom (EN) va Slug kiritilishi shart');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      const isNew = !editingCategory.id;
      const url = isNew ? '/api/tour-categories' : `/api/tour-categories/${editingCategory.id}`;
      const method = isNew ? 'POST' : 'PUT';

      const body = {
        slug: editingCategory.slug,
        name: {
          en: editingCategory.name_en,
          de: editingCategory.name_de || '',
          ru: editingCategory.name_ru || '',
        },
        description: {
          en: editingCategory.description_en || '',
          de: editingCategory.description_de || '',
          ru: editingCategory.description_ru || '',
        },
        icon: editingCategory.icon,
        displayOrder: editingCategory.display_order,
        showInMenu: editingCategory.show_in_menu,
        status: editingCategory.status,
        image: editingCategory.image || '',
      };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        await fetchCategories();
        closeModal();
      } else {
        const data = await response.json();
        setError(data.error || 'Saqlashda xatolik');
      }
    } catch (error) {
      setError('Saqlashda xatolik yuz berdi');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu kategoriyani o\'chirishni xohlaysizmi?')) return;

    try {
      const response = await fetch(`/api/tour-categories/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchCategories();
      }
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const toggleVisibility = async (category: Category) => {
    try {
      await fetch(`/api/tour-categories/${category.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ showInMenu: !category.show_in_menu }),
      });
      await fetchCategories();
    } catch (error) {
      console.error('Error toggling visibility:', error);
    }
  };

  const getIconComponent = (iconName: string) => {
    const option = iconOptions.find(o => o.value === iconName);
    if (option) {
      const IconComponent = option.icon;
      return <IconComponent size={20} />;
    }
    return <Map size={20} />;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={48} className="animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-secondary-800">Tur Kategoriyalari</h1>
          <p className="text-secondary-500 mt-1">Menyuda ko'rsatiladigan kategoriyalarni boshqaring</p>
        </div>
        <button
          onClick={() => openModal()}
          className="btn-primary flex items-center gap-2"
        >
          <Plus size={20} />
          Yangi Kategoriya
        </button>
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-blue-800 text-sm">
          <strong>Eslatma:</strong> Bu kategoriyalar sayt menyusida ko'rsatiladi.
          Har bir kategoriya uchun turlarni "Tours" bo'limida biriktirishingiz mumkin.
        </p>
      </div>

      {/* Categories Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-secondary-50 border-b border-secondary-200">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-semibold text-secondary-600">Tartib</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-secondary-600">Nomi</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-secondary-600">Slug</th>
              <th className="text-left px-6 py-4 text-sm font-semibold text-secondary-600">Icon</th>
              <th className="text-center px-6 py-4 text-sm font-semibold text-secondary-600">Menyuda</th>
              <th className="text-center px-6 py-4 text-sm font-semibold text-secondary-600">Holat</th>
              <th className="text-right px-6 py-4 text-sm font-semibold text-secondary-600">Amallar</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-secondary-500">
                  Hali kategoriya yo'q. Yangi kategoriya qo'shing.
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr key={category.id} className="border-b border-secondary-100 hover:bg-secondary-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-secondary-400">
                      <GripVertical size={16} />
                      <span>{category.display_order}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-secondary-800">{category.name_en}</p>
                      {category.name_ru && (
                        <p className="text-sm text-secondary-500">{category.name_ru}</p>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <code className="px-2 py-1 bg-secondary-100 rounded text-sm text-secondary-600">
                      {category.slug}
                    </code>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-secondary-600">
                      {getIconComponent(category.icon)}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() => toggleVisibility(category)}
                      className={`p-2 rounded-lg transition-colors ${
                        category.show_in_menu
                          ? 'text-green-500 bg-green-50 hover:bg-green-100'
                          : 'text-secondary-400 bg-secondary-100 hover:bg-secondary-200'
                      }`}
                    >
                      {category.show_in_menu ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        category.status === 'active'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-secondary-100 text-secondary-600'
                      }`}
                    >
                      {category.status === 'active' ? 'Faol' : 'Nofaol'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openModal(category)}
                        className="p-2 text-secondary-600 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="p-2 text-secondary-600 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && editingCategory && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-secondary-200">
              <h2 className="text-xl font-bold text-secondary-800">
                {editingCategory.id ? 'Kategoriyani Tahrirlash' : 'Yangi Kategoriya'}
              </h2>
              <button onClick={closeModal} className="text-secondary-400 hover:text-secondary-600">
                <X size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                  {error}
                </div>
              )}

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-2">
                  Slug *
                </label>
                <input
                  type="text"
                  value={editingCategory.slug || ''}
                  onChange={(e) => setEditingCategory({ ...editingCategory, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                  className="input-field"
                  placeholder="cultural-tours"
                />
              </div>

              {/* Names */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Nomi (EN) *
                  </label>
                  <input
                    type="text"
                    value={editingCategory.name_en || ''}
                    onChange={(e) => setEditingCategory({ ...editingCategory, name_en: e.target.value })}
                    className="input-field"
                    placeholder="Cultural Tours"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Nomi (DE)
                  </label>
                  <input
                    type="text"
                    value={editingCategory.name_de || ''}
                    onChange={(e) => setEditingCategory({ ...editingCategory, name_de: e.target.value })}
                    className="input-field"
                    placeholder="Kulturreisen"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Nomi (RU)
                  </label>
                  <input
                    type="text"
                    value={editingCategory.name_ru || ''}
                    onChange={(e) => setEditingCategory({ ...editingCategory, name_ru: e.target.value })}
                    className="input-field"
                    placeholder="Культурные туры"
                  />
                </div>
              </div>

              {/* Icon & Order */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Icon
                  </label>
                  <select
                    value={editingCategory.icon || 'map'}
                    onChange={(e) => setEditingCategory({ ...editingCategory, icon: e.target.value })}
                    className="input-field"
                  >
                    {iconOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-secondary-700 mb-2">
                    Tartib raqami
                  </label>
                  <input
                    type="number"
                    value={editingCategory.display_order || 0}
                    onChange={(e) => setEditingCategory({ ...editingCategory, display_order: parseInt(e.target.value) })}
                    className="input-field"
                    min="0"
                  />
                </div>
              </div>

              {/* Options */}
              <div className="flex items-center gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingCategory.show_in_menu ?? true}
                    onChange={(e) => setEditingCategory({ ...editingCategory, show_in_menu: e.target.checked })}
                    className="w-5 h-5 rounded border-secondary-300 text-primary-500 focus:ring-primary-500"
                  />
                  <span className="text-secondary-700">Menyuda ko'rsatish</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingCategory.status === 'active'}
                    onChange={(e) => setEditingCategory({ ...editingCategory, status: e.target.checked ? 'active' : 'inactive' })}
                    className="w-5 h-5 rounded border-secondary-300 text-primary-500 focus:ring-primary-500"
                  />
                  <span className="text-secondary-700">Faol</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 p-6 border-t border-secondary-200 bg-secondary-50">
              <button
                onClick={closeModal}
                className="px-4 py-2 text-secondary-600 hover:text-secondary-800 transition-colors"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="btn-primary flex items-center gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Saqlanmoqda...
                  </>
                ) : (
                  <>
                    <Save size={18} />
                    Saqlash
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
