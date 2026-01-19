import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AppLogo from '../AppLogo.png';

export default function LoginPage({ onSignUpClick }) {
  const { login } = useAuth();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(phone, password);
      
      if (!result.success) {
        setError(result.error || 'Kirish xatosi');
      }
    } catch (err) {
      setError('Tizimda xatolik. Iltimos qaytadan urinib ko\'ring');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setPhone('+998901234567');
    setPassword('demo123');
    setError('');
    setLoading(true);

    try {
      const result = await login('+998901234567', 'demo123');
      
      if (!result.success) {
        setError(result.error || 'Kirish xatosi');
      }
    } catch (err) {
      setError('Tizimda xatolik. Iltimos qaytadan urinib ko\'ring');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-3">
            <img src={AppLogo} alt="Logo" className="w-20 h-20 object-contain" />
            <h1 className="text-4xl font-bold" style={{ fontFamily: 'Amiri, serif', color: '#22c55e', letterSpacing: '0.05em' }}>
              Maktabatu Ahlis-Sunnah
            </h1>
          </div>
          <p className="text-gray-400">Kitoblar olamiga xush kelibsiz</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Kirish</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Qoʻngʻiroq raqamingiz
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                placeholder="+998901234567"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sirli kalit
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all pr-12"
                  placeholder="Sirli kalitni kiriting"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Yuklanmoqda...' : 'Kirish'}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">yoki</span>
            </div>
          </div>

          {/* Demo Login */}
          <button
            onClick={handleDemoLogin}
            disabled={loading}
            className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-all mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Mehmon sifatida kirish
          </button>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Hisobingiz yoʻqmi?{' '}
              <button
                onClick={onSignUpClick}
                className="text-primary font-medium hover:underline"
              >
                Roʻyxatdan oʻtish
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
