import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, ArrowLeft } from 'lucide-react';
import { plansService } from '../services/api';

export default function AdminPlansPage({ onBack }) {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPlan, setEditingPlan] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    duration: 'Oylik',
    features: [],
    color: '#3b82f6'
  });
  const [newFeature, setNewFeature] = useState('');

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const data = await plansService.getAll();
      setPlans(data);
    } catch (error) {
      console.error('Tariflarni yuklashda xatolik:', error);
      alert('Tariflarni yuklashda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (plan) => {
    setEditingPlan(plan.id);
    setFormData({
      name: plan.name,
      price: plan.price,
      duration: plan.duration,
      features: [...plan.features],
      color: plan.color
    });
  };

  const handleSave = async () => {
    try {
      if (editingPlan) {
        await plansService.update(editingPlan, formData);
        setEditingPlan(null);
      } else {
        await plansService.create(formData);
        setShowAddForm(false);
      }
      await loadPlans();
      resetForm();
    } catch (error) {
      console.error('Saqlashda xatolik:', error);
      alert('Saqlashda xatolik yuz berdi');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bu tarifni o\'chirmoqchimisiz?')) {
      try {
        await plansService.delete(id);
        await loadPlans();
      } catch (error) {
        console.error('O\'chirishda xatolik:', error);
        alert('O\'chirishda xatolik yuz berdi');
      }
    }
  };

  const addFeature = () => {
    if (newFeature.trim()) {
      setFormData({ ...formData, features: [...formData.features, newFeature] });
      setNewFeature('');
    }
  };

  const removeFeature = (index) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index)
    });
  };

  const resetForm = () => {
    setFormData({
      name: '',
      price: 0,
      duration: 'Oylik',
      features: [],
      color: '#3b82f6'
    });
    setNewFeature('');
  };

  const handleCancel = () => {
    setEditingPlan(null);
    setShowAddForm(false);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-secondary">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tariflar boshqaruvi</h1>
            <p className="text-gray-600 mt-2">Obuna tariflarini boshqaring</p>
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
              Yangi tarif
            </button>
          </div>
        </div>

        {/* Add/Edit Form */}
        {(showAddForm || editingPlan) && (
          <div className="bg-white rounded-2xl p-6 shadow-sm mb-6">
            <h3 className="text-xl font-semibold mb-4">
              {editingPlan ? 'Tarifni tahrirlash' : 'Yangi tarif qo\'shish'}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tarif nomi
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="FREE, PRO, VIP"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Narx (so'm)
                </label>
                <input
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Davomiyligi
                </label>
                <select
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="Doimiy">Doimiy</option>
                  <option value="Oylik">Oylik</option>
                  <option value="Yillik">Yillik</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rang
                </label>
                <input
                  type="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-full h-10 px-2 border border-gray-300 rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Features */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Imkoniyatlar
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addFeature()}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="Yangi imkoniyat kiriting..."
                />
                <button
                  onClick={addFeature}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Qo'shish
                </button>
              </div>
              <div className="space-y-2">
                {formData.features.map((feature, index) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 px-4 py-2 rounded-lg">
                    <span className="text-sm text-gray-700">✓ {feature}</span>
                    <button
                      onClick={() => removeFeature(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
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

        {/* Plans Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <div key={plan.id} className="bg-white rounded-2xl p-6 shadow-sm border-2 border-gray-100 hover:border-primary transition-all">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: plan.color }}
                    />
                    <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                  </div>
                  <p className="text-sm text-gray-500">{plan.duration}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(plan)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(plan.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-900">
                  {plan.price.toLocaleString('uz-UZ')}
                </span>
                <span className="text-gray-600 ml-2">so'm</span>
              </div>

              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
