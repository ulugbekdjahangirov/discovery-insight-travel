'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Edit, Trash2, Eye, Search, Loader2, FileText } from 'lucide-react';

interface BlogPost {
  id: number;
  slug: string;
  title_en: string;
  title_de: string;
  title_ru: string;
  excerpt_en: string;
  image: string;
  author: string;
  status: string;
  created_at: string;
}

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/blog');
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Bu postni o\'chirmoqchimisiz?')) return;

    try {
      const response = await fetch(`/api/blog/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setPosts(posts.filter((post) => post.id !== id));
      } else {
        alert('Xatolik yuz berdi');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Xatolik yuz berdi');
    }
  };

  const filteredPosts = posts.filter(
    (post) =>
      post.title_en?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 size={48} className="animate-spin text-primary-500" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-secondary-800">Blog Posts</h1>
          <p className="text-secondary-600">Barcha blog postlarni boshqaring</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          <Plus size={20} />
          Yangi Post
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary-400" size={20} />
          <input
            type="text"
            placeholder="Post qidirish..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-secondary-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {filteredPosts.length > 0 ? (
          <table className="w-full">
            <thead className="bg-secondary-50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-secondary-600">Post</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-secondary-600 hidden md:table-cell">Muallif</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-secondary-600 hidden sm:table-cell">Holat</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-secondary-600 hidden lg:table-cell">Sana</th>
                <th className="text-right px-6 py-4 text-sm font-medium text-secondary-600">Amallar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-secondary-100">
              {filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-secondary-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {post.image ? (
                        <img
                          src={post.image}
                          alt={post.title_en}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                          <FileText size={20} className="text-secondary-400" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-secondary-800">{post.title_en || 'Untitled'}</p>
                        <p className="text-sm text-secondary-500 line-clamp-1">{post.excerpt_en}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 hidden md:table-cell">
                    <span className="text-secondary-600">{post.author || '-'}</span>
                  </td>
                  <td className="px-6 py-4 hidden sm:table-cell">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        post.status === 'published'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {post.status === 'published' ? 'Chop etilgan' : 'Qoralama'}
                    </span>
                  </td>
                  <td className="px-6 py-4 hidden lg:table-cell">
                    <span className="text-secondary-600">
                      {post.created_at ? new Date(post.created_at).toLocaleDateString() : '-'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/en/blog/${post.slug}`}
                        target="_blank"
                        className="p-2 text-secondary-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Ko'rish"
                      >
                        <Eye size={18} />
                      </Link>
                      <Link
                        href={`/admin/blog/${post.id}/edit`}
                        className="p-2 text-secondary-400 hover:text-primary-500 hover:bg-primary-50 rounded-lg transition-colors"
                        title="Tahrirlash"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="p-2 text-secondary-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="O'chirish"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-12">
            <FileText size={48} className="mx-auto text-secondary-300 mb-4" />
            <p className="text-secondary-500">Hech qanday post topilmadi</p>
            <Link
              href="/admin/blog/new"
              className="inline-flex items-center gap-2 mt-4 text-primary-500 hover:text-primary-600"
            >
              <Plus size={18} />
              Birinchi postni yarating
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
