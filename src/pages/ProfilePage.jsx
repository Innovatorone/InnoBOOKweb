import { useState, useEffect } from 'react';
import { Camera, BookOpen, Clock, Award, TrendingUp, Calendar, Star } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { usersService } from '../services/api';

export default function ProfilePage({ onBack }) {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [avatar, setAvatar] = useState(user?.avatar || '👤');
  const [name, setName] = useState(user?.name || '');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    booksRead: 0,
    totalPages: 0,
    reviewsCount: 0,
    averageRating: 0
  });

  useEffect(() => {
    if (user?.id) {
      loadUserStats();
    }
  }, [user?.id]);

  const loadUserStats = async () => {
    try {
      setLoading(true);
      const statsData = await usersService.getStats(user.id);
      setStats(statsData);
    } catch (error) {
      console.error('Statistikani yuklashda xatolik:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = () => {
    updateUser({ ...user, name, avatar });
    setIsEditing(false);
  };

  const handleAvatarChange = (emoji) => {
    setAvatar(emoji);
  };

  const avatarOptions = ['👤', '👨', '👩', '🧑', '👨‍💼', '👩‍💼', '👨‍🎓', '👩‍🎓', '🧙‍♂️', '🧙‍♀️', '🦸‍♂️', '🦸‍♀️'];

  return (
    <div className="min-h-screen bg-secondary">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-12">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Profil</h1>
            <p className="text-gray-600 mt-1">Shaxsiy ma'lumotlar va statistika</p>
          </div>
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
          >
            Orqaga
          </button>
        </div>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center text-6xl relative overflow-hidden">
                {avatar}
              </div>
              {isEditing && (
                <button className="absolute bottom-0 right-0 w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-all">
                  <Camera size={20} />
                </button>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              {isEditing ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-2xl font-bold text-gray-900 mb-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                />
              ) : (
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{user?.name}</h2>
              )}
              <p className="text-gray-600 mb-4">{user?.email || 'user@bookbites.com'}</p>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {user?.plan || 'FREE'} Plan
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  {stats.readingStreak} kunlik seriya 🔥
                </span>
              </div>
            </div>

            {/* Edit Button */}
            <div>
              {isEditing ? (
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveProfile}
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-gray-800 transition-all"
                  >
                    Saqlash
                  </button>
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
                  >
                    Bekor
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all"
                >
                  Tahrirlash
                </button>
              )}
            </div>
          </div>

          {/* Avatar Selector */}
          {isEditing && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-3">Avatar tanlang:</p>
              <div className="flex flex-wrap gap-3">
                {avatarOptions.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleAvatarChange(emoji)}
                    className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl transition-all ${
                      avatar === emoji ? 'bg-primary text-white ring-4 ring-primary/30' : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <BookOpen className="mx-auto mb-3 text-blue-500" size={32} />
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {loading ? '...' : stats.booksRead}
            </p>
            <p className="text-sm text-gray-600">O'qilgan kitoblar</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <Star className="mx-auto mb-3 text-yellow-500" size={32} />
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {loading ? '...' : stats.averageRating}
            </p>
            <p className="text-sm text-gray-600">O'rtacha baho</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <Calendar className="mx-auto mb-3 text-purple-500" size={32} />
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {loading ? '...' : stats.totalPages}
            </p>
            <p className="text-sm text-gray-600">Sahifalar</p>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <Award className="mx-auto mb-3 text-green-500" size={32} />
            <p className="text-3xl font-bold text-gray-900 mb-1">
              {loading ? '...' : stats.reviewsCount}
            </p>
            <p className="text-sm text-gray-600">Sharhlar</p>
          </div>
        </div>

        {/* Plan Info */}
        <div className="bg-white rounded-2xl shadow-lg p-6 lg:p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Obuna rejasi</h3>
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-primary/10 to-purple-100 rounded-xl">
            <div className="flex items-center gap-4">
              <Crown className="text-primary" size={32} />
              <div>
                <p className="font-bold text-gray-900 text-lg">{user?.plan || 'FREE'}</p>
                <p className="text-sm text-gray-600">Joriy tarif</p>
              </div>
            </div>
            <button className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-gray-800 transition-all">
              Yangilash
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
