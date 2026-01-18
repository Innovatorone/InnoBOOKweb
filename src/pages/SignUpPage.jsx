import { useState } from 'react';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { sendVerificationSMS, verifyCode } from '../services/sms';

export default function SignUpPage({ onBackToLogin }) {
  const { signUp } = useAuth();
  const [step, setStep] = useState(1); // 1: Phone, 2: Verify, 3: Details
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    password: '',
    confirmPassword: '',
    avatar: '👤',
    verificationCode: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  // Avatar options
  const avatarOptions = ['👤', '👨', '👩', '🧑', '👨‍💼', '👩‍💼', '👨‍🎓', '👩‍🎓', '👨‍🏫', '👩‍🏫', '🧔', '👱'];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Step 1: Send SMS
  const handleSendSMS = async (e) => {
    e.preventDefault();
    setError('');

    // Telefon raqam validatsiya
    if (!formData.phone.startsWith('+998') || formData.phone.length !== 13) {
      setError('Telefon raqam +998XXXXXXXXX formatida bo\'lishi kerak');
      return;
    }

    setLoading(true);

    try {
      const result = await sendVerificationSMS(formData.phone);
      
      if (result.success) {
        setStep(2);
        startResendTimer();
      } else {
        setError(result.error || 'SMS yuborishda xatolik. Qaytadan urinib ko\'ring');
      }
    } catch (err) {
      setError('Tizimda xatolik. Iltimos qaytadan urinib ko\'ring');
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify code
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.verificationCode || formData.verificationCode.length !== 6) {
      setError('6 raqamli kodni kiriting');
      return;
    }

    setLoading(true);

    try {
      const result = await verifyCode(formData.phone, formData.verificationCode);
      
      if (result.success) {
        setStep(3);
      } else {
        setError(result.error || 'Tasdiqlash kodi noto\'g\'ri. Qaytadan urinib ko\'ring');
      }
    } catch (err) {
      setError('Tizimda xatolik. Iltimos qaytadan urinib ko\'ring');
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Complete registration
  const handleCompleteRegistration = async (e) => {
    e.preventDefault();
    setError('');

    // Ma'lumotlarni tekshirish
    if (!formData.name || !formData.password) {
      setError('Barcha majburiy maydonlarni to\'ldiring');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Parollar bir xil emas. Qaytadan kiriting');
      return;
    }

    if (formData.password.length < 6) {
      setError('Parol kamida 6 ta belgidan iborat bo\'lishi kerak');
      return;
    }

    setLoading(true);

    try {
      const result = await signUp(
        formData.phone,
        formData.password,
        formData.name,
        formData.avatar
      );
      
      if (!result.success) {
        setError(result.error || 'Ro\'yxatdan o\'tishda xatolik. Qaytadan urinib ko\'ring');
      }
    } catch (err) {
      setError('Tizimda xatolik. Iltimos qaytadan urinib ko\'ring');
    } finally {
      setLoading(false);
    }
  };

  // Resend timer
  const startResendTimer = () => {
    setResendTimer(60);
    const interval = setInterval(() => {
      setResendTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleResendSMS = async () => {
    if (resendTimer > 0) return;
    
    setError('');
    setLoading(true);

    try {
      const result = await sendVerificationSMS(formData.phone);
      
      if (result.success) {
        startResendTimer();
      } else {
        setError(result.error || 'SMS yuborishda xatolik');
      }
    } catch (err) {
      setError('Tizimda xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif font-bold text-white mb-2">📚 BookBites</h1>
          <p className="text-gray-400">Yangi akkaunt yaratish</p>
        </div>

        {/* Sign Up Form */}
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <button
            onClick={onBackToLogin}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-all"
          >
            <ArrowLeft size={20} />
            <span>Orqaga</span>
          </button>

          {/* Progress Steps */}
          <div className="flex items-center justify-between mb-6">
            <div className={`flex items-center ${step >= 1 ? 'text-primary' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <span className="ml-2 text-sm font-medium">Telefon</span>
            </div>
            <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-primary' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center ${step >= 2 ? 'text-primary' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <span className="ml-2 text-sm font-medium">Tasdiqlash</span>
            </div>
            <div className={`flex-1 h-1 mx-2 ${step >= 3 ? 'bg-primary' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center ${step >= 3 ? 'text-primary' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-primary text-white' : 'bg-gray-200'}`}>
                3
              </div>
              <span className="ml-2 text-sm font-medium">Ma'lumot</span>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Step 1: Phone Number */}
          {step === 1 && (
            <form onSubmit={handleSendSMS} className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Telefon raqamingizni kiriting</h2>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefon raqam *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder="+998901234567"
                  required
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Yuborilmoqda...' : 'SMS kod yuborish'}
              </button>
            </form>
          )}

          {/* Step 2: Verification */}
          {step === 2 && (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Tasdiqlash kodi</h2>
              <p className="text-sm text-gray-600 mb-4">
                {formData.phone} raqamiga yuborilgan 6 raqamli kodni kiriting
              </p>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tasdiqlash kodi *
                </label>
                <input
                  type="text"
                  name="verificationCode"
                  value={formData.verificationCode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-center text-2xl tracking-widest"
                  placeholder="000000"
                  maxLength="6"
                  required
                  autoFocus
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Tekshirilmoqda...' : 'Tasdiqlash'}
              </button>

              <div className="text-center">
                {resendTimer > 0 ? (
                  <p className="text-sm text-gray-600">
                    Qayta yuborish: {resendTimer} soniya
                  </p>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendSMS}
                    className="text-sm text-primary hover:underline"
                  >
                    Kodni qayta yuborish
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-sm text-gray-600 hover:text-gray-900"
              >
                Telefon raqamni o'zgartirish
              </button>
            </form>
          )}

          {/* Step 3: User Details */}
          {step === 3 && (
            <form onSubmit={handleCompleteRegistration} className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Shaxsiy ma'lumotlar</h2>
              
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To'liq ism *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                  placeholder="Ism Familiya"
                  required
                  autoFocus
                />
              </div>

              {/* Avatar Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Avatar tanlang
                </label>
                <div className="grid grid-cols-6 gap-2">
                  {avatarOptions.map((av) => (
                    <button
                      key={av}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, avatar: av }))}
                      className={`text-3xl p-2 rounded-lg transition-all ${
                        formData.avatar === av
                          ? 'bg-primary text-white ring-2 ring-primary'
                          : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      {av}
                    </button>
                  ))}
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parol *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all pr-12"
                    placeholder="Kamida 6 ta belgi"
                    required
                    minLength={6}
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

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Parolni tasdiqlang *
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all pr-12"
                    placeholder="Parolni qayta kiriting"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-all mt-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Yuklanmoqda...' : 'Ro\'yxatdan o\'tish'}
              </button>
            </form>
          )}

          {/* Login Link */}
          <div className="text-center mt-6">
            <p className="text-sm text-gray-600">
              Hisobingiz bormi?{' '}
              <button
                onClick={onBackToLogin}
                className="text-primary font-medium hover:underline"
              >
                Kirish
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
