import { useState, useEffect } from 'react';
import { Users, BookOpen, Crown, TrendingUp, Filter } from 'lucide-react';
import { usersService, adminStatsService } from '../services/api';

export default function AdminPanel({ onBack, onNavigate }) {
  const [activeTab, setActiveTab] = useState('stats');
  const [userFilter, setUserFilter] = useState('all');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    freeUsers: 0,
    proUsers: 0,
    vipUsers: 0,
    totalBooks: 0,
    premiumBooks: 0,
    freeBooks: 0
  });

  // Admin sahifalarga o'tish
  const adminPages = [
    { id: 'admin-books', name: 'Kitoblar', icon: '📚', description: 'Kitoblarni boshqarish' },
    { id: 'admin-plans', name: 'Tariflar', icon: '💰', description: 'Obuna tariflarini boshqarish' },
    { id: 'admin-categories', name: 'Kategoriyalar', icon: '📁', description: 'Kitob kategoriyalarini boshqarish' },
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, usersData] = await Promise.all([
        adminStatsService.getOverview(),
        usersService.getAll()
      ]);
      setStats(statsData);
      setUsers(usersData);
    } catch (error) {
      console.error('Ma\'lumotlarni yuklashda xatolik:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter users based on selected plan
  const filteredUsers = userFilter === 'all' 
    ? users 
    : users.filter(user => user.plan === userFilter.toUpperCase());

  const handlePlanChange = async (userId, newPlan) => {
    try {
      await usersService.updatePlan(userId, newPlan);
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId ? { ...user, plan: newPlan } : user
        )
      );
      await loadData(); // Statistikani yangilash
    } catch (error) {
      console.error('Tarifni o\'zgartirishda xatolik:', error);
      alert('Tarifni o\'zgartirishda xatolik yuz berdi');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Foydalanuvchini o\'chirmoqchimisiz?')) {
      try {
        await usersService.delete(userId);
        setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
        await loadData(); // Statistikani yangilash
      } catch (error) {
        console.error('Foydalanuvchini o\'chirishda xatolik:', error);
        alert('Foydalanuvchini o\'chirishda xatolik yuz berdi');
      }
    }
  };

  return (
    <div className="min-h-screen bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-gray-600 mt-1">Tizim boshqaruvi</p>
          </div>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
          >
            Orqaga
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('stats')}
            className={`pb-3 px-4 font-medium transition-all ${
              activeTab === 'stats'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Statistika
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-3 px-4 font-medium transition-all ${
              activeTab === 'users'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Foydalanuvchilar
          </button>
          <button
            onClick={() => setActiveTab('pages')}
            className={`pb-3 px-4 font-medium transition-all ${
              activeTab === 'pages'
                ? 'border-b-2 border-primary text-primary'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Boshqaruv sahifalari
          </button>
        </div>

        {/* Admin Pages Tab */}
        {activeTab === 'pages' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminPages.map((page) => (
              <button
                key={page.id}
                onClick={() => onNavigate(page.id)}
                className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-all text-left group"
              >
                <div className="text-5xl mb-4">{page.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">
                  {page.name}
                </h3>
                <p className="text-gray-600 text-sm">
                  {page.description}
                </p>
              </button>
            ))}
          </div>
        )}

        {/* Statistics Tab */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4 animate-pulse">⏳</div>
                <p className="text-gray-600">Yuklanmoqda...</p>
              </div>
            ) : (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-gray-600 font-medium">Jami foydalanuvchilar</h3>
                      <Users className="text-primary" size={24} />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-gray-600 font-medium">FREE</h3>
                      <Users className="text-gray-500" size={24} />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{stats.freeUsers}</p>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-gray-600 font-medium">PRO</h3>
                      <Crown className="text-blue-500" size={24} />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{stats.proUsers}</p>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-gray-600 font-medium">VIP</h3>
                      <Crown className="text-yellow-500" size={24} />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{stats.vipUsers}</p>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-gray-600 font-medium">Jami kitoblar</h3>
                      <BookOpen className="text-green-500" size={24} />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalBooks}</p>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-gray-600 font-medium">Premium kitoblar</h3>
                      <BookOpen className="text-yellow-500" size={24} />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{stats.premiumBooks}</p>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-gray-600 font-medium">Bepul kitoblar</h3>
                      <BookOpen className="text-gray-500" size={24} />
                    </div>
                    <p className="text-3xl font-bold text-gray-900">{stats.freeBooks}</p>
                  </div>

                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-gray-600 font-medium">Oylik daromad</h3>
                      <TrendingUp className="text-green-500" size={24} />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">0 so'm</p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            {loading ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4 animate-pulse">⏳</div>
                <p className="text-gray-600">Yuklanmoqda...</p>
              </div>
            ) : (
              <>
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">Foydalanuvchilar</h2>
                    
                    {/* Filter Buttons */}
                    <div className="flex items-center gap-2">
                      <Filter size={20} className="text-gray-500" />
                      <button
                        onClick={() => setUserFilter('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          userFilter === 'all'
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Barchasi ({users.length})
                      </button>
                      <button
                        onClick={() => setUserFilter('free')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          userFilter === 'free'
                            ? 'bg-gray-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        FREE ({users.filter(u => u.plan === 'FREE').length})
                      </button>
                      <button
                        onClick={() => setUserFilter('pro')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          userFilter === 'pro'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        PRO ({users.filter(u => u.plan === 'PRO').length})
                      </button>
                      <button
                        onClick={() => setUserFilter('vip')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          userFilter === 'vip'
                            ? 'bg-yellow-500 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        VIP ({users.filter(u => u.plan === 'VIP').length})
                      </button>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Foydalanuvchi</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reja</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qo'shilgan sana</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amallar</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{user.avatar}</span>
                              <span className="font-medium text-gray-900">{user.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <select 
                              value={user.plan}
                              onChange={(e) => handlePlanChange(user.id, e.target.value)}
                              className={`px-3 py-1 rounded-full text-xs font-semibold border-2 outline-none cursor-pointer ${
                                user.plan === 'VIP' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                                user.plan === 'PRO' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                                'bg-gray-100 text-gray-800 border-gray-300'
                              }`}
                            >
                              <option value="FREE">FREE</option>
                              <option value="PRO">PRO</option>
                              <option value="VIP">VIP</option>
                            </select>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-600">
                            {new Date(user.created_at).toLocaleDateString('uz-UZ')}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button 
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600 hover:text-red-800 text-sm font-medium"
                            >
                              O'chirish
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredUsers.length === 0 && (
                    <div className="text-center py-12">
                      <p className="text-gray-500">Foydalanuvchilar topilmadi</p>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
