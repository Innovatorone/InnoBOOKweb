import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, ArrowLeft } from 'lucide-react';
import { categoriesService } from '../services/api';

export default function AdminCategoriesPage({ onBack }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCategory, setEditingCategory] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    icon: '📚',
    description: ''
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await categoriesService.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Kategoriyalarni yuklashda xatolik:', error);
      alert('Kategoriyalarni yuklashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category.id);
    setFormData({
      name: category.name,
      icon: category.icon,
      description: category.description
    });
  };

  const handleSave = async () => {
    try {
      if (editingCategory) {
        await categoriesService.update(editingCategory, formData);
        setEditingCategory(null);
      } else {
        await categoriesService.create(formData);
        setShowAddForm(false);
      }
      await loadCategories();
      resetForm();
    } catch (error) {
      console.error('Saqlashda xatolik:', error);
      alert('Saqlashda xatolik yuz berdi');
    }
  };

  const handleDelete = async (id) => {
    const category = categories.find(c => c.id === id);
    if (category.book_count > 0) {
      alert(`Bu kategoriyada ${category.book_count} ta kitob bor. Avval kitoblarni boshqa kategoriyaga o'tkazing.`);
      return;
    }
    
    if (window.confirm('Bu kategoriyani o\'chirmoqchimisiz?')) {
      try {
        await categoriesService.delete(id);
        await loadCategories();
      } catch (error) {
        console.error('O\'chirishda xatolik:', error);
        alert('O\'chirishda xatolik yuz berdi');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      icon: '📚',
      description: ''
    });
  };

  const handleCancel = () => {
    setEditingCategory(null);
    setShowAddForm(false);
    resetForm();
  };

  const commonIcons = ['📚', '🧙', '🚀', '💕', '🧚', '🦸', '🏰', '🎭', '🎨', '🔬', '⚔️', '🌟', '🎯', '🌈'];

  return (
    <div className="min-h-screen bg-secondary">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Kategoriyalar boshqaruvi</h1>
            <p className="text-gray-600 mt-2">Kitob kategoriyalarini boshqaring</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onBack}
              className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-all"
            >
              <ArrowLeft size={20} />
              Orqaga
            </button>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-gray-800 transition-all"
            >
              <Plus size={20} />
              Yangi kategoriya
            </button>
          </div>
        </div>

        {/* Add/Edit Form */}
        {(showAddForm || editingCategory) && (
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
            <h3 className="text-xl font-semibold mb-4">
              {editingCategory ? 'Kategoriyani tahrirlash' : 'Yangi kategoriya qo\'shish'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kategoriya nomi
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Fantasy, Science Fiction..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tavsif
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Qisqacha tavsif..."
                />
              </div>
            </div>

            {/* Icon Selector */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Belgi tanlang
              </label>
              <div className="grid grid-cols-7 gap-2">
                {commonIcons.map((icon) => (
                  <button
                    key={icon}
                    onClick={() => setFormData({ ...formData, icon })}
                    className={`p-4 text-3xl rounded-lg border-2 transition-all ${
                      formData.icon === icon
                        ? 'border-primary bg-primary/10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
              <div className="mt-2">
                <input
                  type="text"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-32 px-4 py-2 border border-gray-300 rounded-lg text-center text-2xl"
                  placeholder="😀"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-6 py-2 bg-primary text-white rounded-lg hover:bg-gray-800"
              >
                <Save size={18} />
                Saqlash
              </button>
              <button
                onClick={handleCancel}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Bekor qilish
              </button>
            </div>
          </div>
        )}

        {/* Categories Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {categories.map((category) => (
            <div key={category.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="text-4xl">{category.icon}</div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(category)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-1">
                {category.name}
              </h3>
              <p className="text-sm text-gray-600 mb-3">
                {category.description}
              </p>
              <div className="text-sm text-gray-500">
                {category.book_count || 0} ta kitob
              </div>
            </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
