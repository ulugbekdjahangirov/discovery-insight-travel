'use client';

import { useState, useEffect } from 'react';
import {
  Save,
  Loader2,
  Plus,
  Trash2,
  Image as ImageIcon,
  Award,
  Users,
  Globe,
  Heart,
  Star,
  Shield,
  Zap,
  Target,
} from 'lucide-react';

interface StoryImage {
  url: string;
  alt: string;
}

interface Stat {
  value: string;
  label_en: string;
  label_de: string;
  label_ru: string;
}

interface Value {
  icon: string;
  title_en: string;
  title_de: string;
  title_ru: string;
  description_en: string;
  description_de: string;
  description_ru: string;
}

interface TeamMember {
  name: string;
  role_en: string;
  role_de: string;
  role_ru: string;
  image: string;
}

interface AboutContent {
  id?: number;
  hero_image: string;
  hero_subtitle_en: string;
  hero_subtitle_de: string;
  hero_subtitle_ru: string;
  story_title_en: string;
  story_title_de: string;
  story_title_ru: string;
  story_paragraph1_en: string;
  story_paragraph1_de: string;
  story_paragraph1_ru: string;
  story_paragraph2_en: string;
  story_paragraph2_de: string;
  story_paragraph2_ru: string;
  story_images: StoryImage[];
  stats: Stat[];
  values: Value[];
  team_title_en: string;
  team_title_de: string;
  team_title_ru: string;
  team_subtitle_en: string;
  team_subtitle_de: string;
  team_subtitle_ru: string;
  team_members: TeamMember[];
}

const iconOptions = [
  { value: 'Heart', label: 'Heart', icon: Heart },
  { value: 'Award', label: 'Award', icon: Award },
  { value: 'Users', label: 'Users', icon: Users },
  { value: 'Globe', label: 'Globe', icon: Globe },
  { value: 'Star', label: 'Star', icon: Star },
  { value: 'Shield', label: 'Shield', icon: Shield },
  { value: 'Zap', label: 'Zap', icon: Zap },
  { value: 'Target', label: 'Target', icon: Target },
];

const defaultContent: AboutContent = {
  hero_image: '',
  hero_subtitle_en: '',
  hero_subtitle_de: '',
  hero_subtitle_ru: '',
  story_title_en: 'Our Story',
  story_title_de: 'Unsere Geschichte',
  story_title_ru: 'Наша история',
  story_paragraph1_en: '',
  story_paragraph1_de: '',
  story_paragraph1_ru: '',
  story_paragraph2_en: '',
  story_paragraph2_de: '',
  story_paragraph2_ru: '',
  story_images: [],
  stats: [],
  values: [],
  team_title_en: 'Meet Our Team',
  team_title_de: 'Unser Team',
  team_title_ru: 'Наша команда',
  team_subtitle_en: '',
  team_subtitle_de: '',
  team_subtitle_ru: '',
  team_members: [],
};

export default function AdminAboutPage() {
  const [content, setContent] = useState<AboutContent>(defaultContent);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'hero' | 'story' | 'stats' | 'values' | 'team'>('hero');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await fetch('/api/about');
      if (response.ok) {
        const data = await response.json();
        setContent(data);
      }
    } catch (error) {
      console.error('Error fetching about content:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(content),
      });

      if (response.ok) {
        setMessage({ type: 'success', text: "Ma'lumotlar muvaffaqiyatli saqlandi!" });
      } else {
        setMessage({ type: 'error', text: 'Xatolik yuz berdi!' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Xatolik yuz berdi!' });
    } finally {
      setIsSaving(false);
    }
  };

  // Stats handlers
  const addStat = () => {
    setContent({
      ...content,
      stats: [...content.stats, { value: '', label_en: '', label_de: '', label_ru: '' }],
    });
  };

  const updateStat = (index: number, field: keyof Stat, value: string) => {
    const newStats = [...content.stats];
    newStats[index] = { ...newStats[index], [field]: value };
    setContent({ ...content, stats: newStats });
  };

  const removeStat = (index: number) => {
    setContent({ ...content, stats: content.stats.filter((_, i) => i !== index) });
  };

  // Values handlers
  const addValue = () => {
    setContent({
      ...content,
      values: [
        ...content.values,
        {
          icon: 'Heart',
          title_en: '',
          title_de: '',
          title_ru: '',
          description_en: '',
          description_de: '',
          description_ru: '',
        },
      ],
    });
  };

  const updateValue = (index: number, field: keyof Value, value: string) => {
    const newValues = [...content.values];
    newValues[index] = { ...newValues[index], [field]: value };
    setContent({ ...content, values: newValues });
  };

  const removeValue = (index: number) => {
    setContent({ ...content, values: content.values.filter((_, i) => i !== index) });
  };

  // Team handlers
  const addTeamMember = () => {
    setContent({
      ...content,
      team_members: [
        ...content.team_members,
        { name: '', role_en: '', role_de: '', role_ru: '', image: '' },
      ],
    });
  };

  const updateTeamMember = (index: number, field: keyof TeamMember, value: string) => {
    const newMembers = [...content.team_members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setContent({ ...content, team_members: newMembers });
  };

  const removeTeamMember = (index: number) => {
    setContent({ ...content, team_members: content.team_members.filter((_, i) => i !== index) });
  };

  // Story images handlers
  const addStoryImage = () => {
    setContent({
      ...content,
      story_images: [...content.story_images, { url: '', alt: '' }],
    });
  };

  const updateStoryImage = (index: number, field: keyof StoryImage, value: string) => {
    const newImages = [...content.story_images];
    newImages[index] = { ...newImages[index], [field]: value };
    setContent({ ...content, story_images: newImages });
  };

  const removeStoryImage = (index: number) => {
    setContent({ ...content, story_images: content.story_images.filter((_, i) => i !== index) });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={48} className="animate-spin text-primary-500" />
      </div>
    );
  }

  const tabs = [
    { id: 'hero', label: 'Hero Bo\'limi' },
    { id: 'story', label: 'Bizning Hikoya' },
    { id: 'stats', label: 'Statistika' },
    { id: 'values', label: 'Qadriyatlar' },
    { id: 'team', label: 'Jamoa' },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-secondary-800">About Us sahifasini tahrirlash</h1>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
        >
          {isSaving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
          Saqlash
        </button>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? 'bg-primary-500 text-white'
                : 'bg-white text-secondary-600 hover:bg-secondary-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Hero Section Tab */}
      {activeTab === 'hero' && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Hero Bo'limi</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Fon rasmi URL
              </label>
              <input
                type="text"
                value={content.hero_image}
                onChange={(e) => setContent({ ...content, hero_image: e.target.value })}
                className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                placeholder="https://..."
              />
              {content.hero_image && (
                <img src={content.hero_image} alt="Hero preview" className="mt-2 h-32 object-cover rounded-lg" />
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Sarlavha (EN)
                </label>
                <textarea
                  value={content.hero_subtitle_en}
                  onChange={(e) => setContent({ ...content, hero_subtitle_en: e.target.value })}
                  className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Sarlavha (DE)
                </label>
                <textarea
                  value={content.hero_subtitle_de}
                  onChange={(e) => setContent({ ...content, hero_subtitle_de: e.target.value })}
                  className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">
                  Sarlavha (RU)
                </label>
                <textarea
                  value={content.hero_subtitle_ru}
                  onChange={(e) => setContent({ ...content, hero_subtitle_ru: e.target.value })}
                  className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                  rows={3}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Story Section Tab */}
      {activeTab === 'story' && (
        <div className="bg-white rounded-xl p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-semibold">Bizning Hikoya</h2>

          {/* Story Titles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Sarlavha (EN)
              </label>
              <input
                type="text"
                value={content.story_title_en}
                onChange={(e) => setContent({ ...content, story_title_en: e.target.value })}
                className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Sarlavha (DE)
              </label>
              <input
                type="text"
                value={content.story_title_de}
                onChange={(e) => setContent({ ...content, story_title_de: e.target.value })}
                className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Sarlavha (RU)
              </label>
              <input
                type="text"
                value={content.story_title_ru}
                onChange={(e) => setContent({ ...content, story_title_ru: e.target.value })}
                className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Paragraph 1 */}
          <div>
            <h3 className="font-medium text-secondary-800 mb-2">Birinchi paragraf</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">EN</label>
                <textarea
                  value={content.story_paragraph1_en}
                  onChange={(e) => setContent({ ...content, story_paragraph1_en: e.target.value })}
                  className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">DE</label>
                <textarea
                  value={content.story_paragraph1_de}
                  onChange={(e) => setContent({ ...content, story_paragraph1_de: e.target.value })}
                  className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">RU</label>
                <textarea
                  value={content.story_paragraph1_ru}
                  onChange={(e) => setContent({ ...content, story_paragraph1_ru: e.target.value })}
                  className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* Paragraph 2 */}
          <div>
            <h3 className="font-medium text-secondary-800 mb-2">Ikkinchi paragraf</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">EN</label>
                <textarea
                  value={content.story_paragraph2_en}
                  onChange={(e) => setContent({ ...content, story_paragraph2_en: e.target.value })}
                  className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">DE</label>
                <textarea
                  value={content.story_paragraph2_de}
                  onChange={(e) => setContent({ ...content, story_paragraph2_de: e.target.value })}
                  className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-secondary-700 mb-1">RU</label>
                <textarea
                  value={content.story_paragraph2_ru}
                  onChange={(e) => setContent({ ...content, story_paragraph2_ru: e.target.value })}
                  className="w-full px-4 py-2 border border-secondary-200 rounded-lg focus:ring-2 focus:ring-primary-500"
                  rows={4}
                />
              </div>
            </div>
          </div>

          {/* Story Images */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-secondary-800">Rasmlar (4 ta)</h3>
              <button
                onClick={addStoryImage}
                disabled={content.story_images.length >= 4}
                className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
              >
                <Plus size={18} />
                Rasm qo'shish
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {content.story_images.map((img, index) => (
                <div key={index} className="border border-secondary-200 rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    {img.url && (
                      <img src={img.url} alt={img.alt} className="w-24 h-24 object-cover rounded-lg" />
                    )}
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={img.url}
                        onChange={(e) => updateStoryImage(index, 'url', e.target.value)}
                        className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm"
                        placeholder="Rasm URL"
                      />
                      <input
                        type="text"
                        value={img.alt}
                        onChange={(e) => updateStoryImage(index, 'alt', e.target.value)}
                        className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm"
                        placeholder="Alt text"
                      />
                    </div>
                    <button
                      onClick={() => removeStoryImage(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Stats Section Tab */}
      {activeTab === 'stats' && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Statistika (4 ta)</h2>
            <button
              onClick={addStat}
              disabled={content.stats.length >= 4}
              className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
            >
              <Plus size={18} />
              Qo'shish
            </button>
          </div>

          <div className="space-y-4">
            {content.stats.map((stat, index) => (
              <div key={index} className="border border-secondary-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-secondary-700">Statistika #{index + 1}</span>
                  <button
                    onClick={() => removeStat(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Qiymat
                    </label>
                    <input
                      type="text"
                      value={stat.value}
                      onChange={(e) => updateStat(index, 'value', e.target.value)}
                      className="w-full px-3 py-2 border border-secondary-200 rounded-lg"
                      placeholder="15+"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Label (EN)
                    </label>
                    <input
                      type="text"
                      value={stat.label_en}
                      onChange={(e) => updateStat(index, 'label_en', e.target.value)}
                      className="w-full px-3 py-2 border border-secondary-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Label (DE)
                    </label>
                    <input
                      type="text"
                      value={stat.label_de}
                      onChange={(e) => updateStat(index, 'label_de', e.target.value)}
                      className="w-full px-3 py-2 border border-secondary-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Label (RU)
                    </label>
                    <input
                      type="text"
                      value={stat.label_ru}
                      onChange={(e) => updateStat(index, 'label_ru', e.target.value)}
                      className="w-full px-3 py-2 border border-secondary-200 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            ))}
            {content.stats.length === 0 && (
              <p className="text-center text-secondary-500 py-8">
                Hech qanday statistika qo'shilmagan
              </p>
            )}
          </div>
        </div>
      )}

      {/* Values Section Tab */}
      {activeTab === 'values' && (
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Qadriyatlar (4 ta)</h2>
            <button
              onClick={addValue}
              disabled={content.values.length >= 4}
              className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50"
            >
              <Plus size={18} />
              Qo'shish
            </button>
          </div>

          <div className="space-y-4">
            {content.values.map((value, index) => (
              <div key={index} className="border border-secondary-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium text-secondary-700">Qadriyat #{index + 1}</span>
                  <button
                    onClick={() => removeValue(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Icon
                    </label>
                    <select
                      value={value.icon}
                      onChange={(e) => updateValue(index, 'icon', e.target.value)}
                      className="w-full px-3 py-2 border border-secondary-200 rounded-lg"
                    >
                      {iconOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Sarlavha (EN)
                    </label>
                    <input
                      type="text"
                      value={value.title_en}
                      onChange={(e) => updateValue(index, 'title_en', e.target.value)}
                      className="w-full px-3 py-2 border border-secondary-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Sarlavha (DE)
                    </label>
                    <input
                      type="text"
                      value={value.title_de}
                      onChange={(e) => updateValue(index, 'title_de', e.target.value)}
                      className="w-full px-3 py-2 border border-secondary-200 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Sarlavha (RU)
                    </label>
                    <input
                      type="text"
                      value={value.title_ru}
                      onChange={(e) => updateValue(index, 'title_ru', e.target.value)}
                      className="w-full px-3 py-2 border border-secondary-200 rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Tavsif (EN)
                    </label>
                    <textarea
                      value={value.description_en}
                      onChange={(e) => updateValue(index, 'description_en', e.target.value)}
                      className="w-full px-3 py-2 border border-secondary-200 rounded-lg"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Tavsif (DE)
                    </label>
                    <textarea
                      value={value.description_de}
                      onChange={(e) => updateValue(index, 'description_de', e.target.value)}
                      className="w-full px-3 py-2 border border-secondary-200 rounded-lg"
                      rows={2}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-secondary-700 mb-1">
                      Tavsif (RU)
                    </label>
                    <textarea
                      value={value.description_ru}
                      onChange={(e) => updateValue(index, 'description_ru', e.target.value)}
                      className="w-full px-3 py-2 border border-secondary-200 rounded-lg"
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            ))}
            {content.values.length === 0 && (
              <p className="text-center text-secondary-500 py-8">
                Hech qanday qadriyat qo'shilmagan
              </p>
            )}
          </div>
        </div>
      )}

      {/* Team Section Tab */}
      {activeTab === 'team' && (
        <div className="bg-white rounded-xl p-6 shadow-sm space-y-6">
          <h2 className="text-lg font-semibold">Jamoa</h2>

          {/* Team Section Titles */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Sarlavha (EN)
              </label>
              <input
                type="text"
                value={content.team_title_en}
                onChange={(e) => setContent({ ...content, team_title_en: e.target.value })}
                className="w-full px-4 py-2 border border-secondary-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Sarlavha (DE)
              </label>
              <input
                type="text"
                value={content.team_title_de}
                onChange={(e) => setContent({ ...content, team_title_de: e.target.value })}
                className="w-full px-4 py-2 border border-secondary-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Sarlavha (RU)
              </label>
              <input
                type="text"
                value={content.team_title_ru}
                onChange={(e) => setContent({ ...content, team_title_ru: e.target.value })}
                className="w-full px-4 py-2 border border-secondary-200 rounded-lg"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Tavsif (EN)
              </label>
              <textarea
                value={content.team_subtitle_en}
                onChange={(e) => setContent({ ...content, team_subtitle_en: e.target.value })}
                className="w-full px-4 py-2 border border-secondary-200 rounded-lg"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Tavsif (DE)
              </label>
              <textarea
                value={content.team_subtitle_de}
                onChange={(e) => setContent({ ...content, team_subtitle_de: e.target.value })}
                className="w-full px-4 py-2 border border-secondary-200 rounded-lg"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-secondary-700 mb-1">
                Tavsif (RU)
              </label>
              <textarea
                value={content.team_subtitle_ru}
                onChange={(e) => setContent({ ...content, team_subtitle_ru: e.target.value })}
                className="w-full px-4 py-2 border border-secondary-200 rounded-lg"
                rows={2}
              />
            </div>
          </div>

          {/* Team Members */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-medium text-secondary-800">Jamoa a'zolari</h3>
              <button
                onClick={addTeamMember}
                className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
              >
                <Plus size={18} />
                A'zo qo'shish
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {content.team_members.map((member, index) => (
                <div key={index} className="border border-secondary-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-secondary-700">A'zo #{index + 1}</span>
                    <button
                      onClick={() => removeTeamMember(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="flex gap-4">
                    {member.image && (
                      <img
                        src={member.image}
                        alt={member.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                    )}
                    <div className="flex-1 space-y-2">
                      <input
                        type="text"
                        value={member.image}
                        onChange={(e) => updateTeamMember(index, 'image', e.target.value)}
                        className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm"
                        placeholder="Rasm URL"
                      />
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) => updateTeamMember(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm"
                        placeholder="Ism"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 mt-3">
                    <input
                      type="text"
                      value={member.role_en}
                      onChange={(e) => updateTeamMember(index, 'role_en', e.target.value)}
                      className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm"
                      placeholder="Lavozim (EN)"
                    />
                    <input
                      type="text"
                      value={member.role_de}
                      onChange={(e) => updateTeamMember(index, 'role_de', e.target.value)}
                      className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm"
                      placeholder="Lavozim (DE)"
                    />
                    <input
                      type="text"
                      value={member.role_ru}
                      onChange={(e) => updateTeamMember(index, 'role_ru', e.target.value)}
                      className="w-full px-3 py-2 border border-secondary-200 rounded-lg text-sm"
                      placeholder="Lavozim (RU)"
                    />
                  </div>
                </div>
              ))}
            </div>
            {content.team_members.length === 0 && (
              <p className="text-center text-secondary-500 py-8">
                Hech qanday jamoa a'zosi qo'shilmagan
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
