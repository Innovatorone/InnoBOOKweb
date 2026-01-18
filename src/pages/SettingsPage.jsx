import { useState } from 'react';
import { User, Globe, LogOut, Crown, Camera } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SUBSCRIPTION_PLANS = [
  {
    id: 'FREE',
    name: 'FREE',
    price: 0,
    currency: 'so\'m',
    features: [
      'Oddiy kitoblarni o\'qish',
      'Asosiy funksiyalar',
      'Cheklangan kirish'
    ],
    color: 'gray'
  },
  {
    id: 'PRO',
    name: 'PRO',
    price: 49000,
    currency: 'so\'m/oy',
    features: [
      'Premium kitoblar',
      'Audiobook tinglash',
      'Offline rejim',
      'Reklama yo\'q',
      'Cheksiz yuklab olish'
    ],
    color: 'blue',
    popular: true
  },
  {
    id: 'VIP',
    name: 'VIP',
    price: 99000,
    currency: 'so\'m/oy',
    features: [
      'Barcha PRO funksiyalar',
      'Yangi kitoblardan birinchi bo\'lib foydalanish',
      'Shaxsiy tavsiyalar',
      'Muallif bilan aloqa',
      'Maxsus kontentlar',
      'Offline library'
    ],
    color: 'yellow'
  }
];

export default function SettingsPage() {
  const { user, logout, updateUser } = useAuth();
  const [selectedLanguage, setSelectedLanguage] = useState('uz');
  const [profileImage, setProfileImage] = useState(user?.avatar || '👤');
  const [userName, setUserName] = useState(user?.name || 'Foydalanuvchi');
  const [isEditingName, setIsEditingName] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(user?.plan || 'free');

  const languages = [
    { code: 'uz', name: 'O\'zbekcha', flag: '🇺🇿' },
    { code: 'ru', name: 'Русский', flag: '🇷🇺' },
    { code: 'eng', name: 'English', flag: '🇬🇧' }
  ];

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
        updateUser({ avatar: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNameSave = () => {
    setIsEditingName(false);
    updateUser({ name: userName });
  };

  return (
    <div className="min-h-screen bg-secondary">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Sozlamalar</h1>

        {/* Profile Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <User size={24} />
            Profil
          </h2>

          <div className="flex items-center gap-6 mb-6">
            {/* Profile Image */}
            <div className="relative">
              <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-4xl overflow-hidden">
                {typeof profileImage === 'string' && profileImage.startsWith('data:') ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span>{profileImage}</span>
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-gray-800 transition-all">
                <Camera size={16} />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Name */}
            <div className="flex-1">
              {isEditingName ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                  />
                  <button
                    onClick={handleNameSave}
                    className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-gray-800 transition-all"
                  >
                    Saqlash
                  </button>
                </div>
              ) : (
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">{userName}</h3>
                  <button
                    onClick={() => setIsEditingName(true)}
                    className="text-sm text-primary hover:underline"
                  >
                    Tahrirlash
                  </button>
                </div>
              )}
              <p className="text-gray-600 mt-1">
                {user?.type === 'admin' ? '👑 Administrator' : 
                 user?.type === 'guest' ? '🚶 Mehmon' : '👤 Foydalanuvchi'}
              </p>
            </div>
          </div>
        </div>

        {/* Language Settings */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Globe size={24} />
            Til
          </h2>
          
          <div className="grid grid-cols-3 gap-4">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => setSelectedLanguage(lang.code)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  selectedLanguage === lang.code
                    ? 'border-primary bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-3xl mb-2">{lang.flag}</div>
                <div className="font-medium text-gray-900">{lang.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Subscription Plans */}
        {user?.type !== 'admin' && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Crown size={24} />
              Obuna rejalari
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {SUBSCRIPTION_PLANS.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative p-6 rounded-xl border-2 transition-all ${
                    currentPlan === plan.id
                      ? 'border-primary bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  } ${plan.popular ? 'ring-2 ring-blue-400' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                      Mashhur
                    </div>
                  )}
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-gray-900">{plan.price.toLocaleString()}</span>
                    <span className="text-gray-600 ml-1">{plan.currency}</span>
                  </div>

                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => setCurrentPlan(plan.id)}
                    className={`w-full py-2 rounded-lg font-medium transition-all ${
                      currentPlan === plan.id
                        ? 'bg-gray-200 text-gray-600 cursor-default'
                        : 'bg-primary text-white hover:bg-gray-800'
                    }`}
                    disabled={currentPlan === plan.id}
                  >
                    {currentPlan === plan.id ? 'Joriy reja' : 'Tanlash'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Logout Button */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 bg-red-500 text-white py-3 rounded-lg font-medium hover:bg-red-600 transition-all"
          >
            <LogOut size={20} />
            Chiqish
          </button>
        </div>
      </div>
    </div>
  );
}
