/**
 * SMS Verification Service
 * Hozircha console'ga chiqaradi, keyinchalik Eskiz.uz bilan integratsiya qilinadi
 */

// Temporary storage for verification codes (production'da Redis ishlatiladi)
const verificationCodes = new Map();

/**
 * Generate 6-digit verification code
 */
const generateCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

/**
 * Send verification SMS
 * @param {string} phone - Phone number (+998XXXXXXXXX)
 * @returns {Promise<{success: boolean, code?: string, error?: string}>}
 */
export const sendVerificationSMS = async (phone) => {
  try {
    // Validate phone format
    if (!phone.startsWith('+998') || phone.length !== 13) {
      return {
        success: false,
        error: 'Noto\'g\'ri telefon raqam formati. +998XXXXXXXXX formatida kiriting'
      };
    }

    // Generate verification code
    const code = generateCode();
    
    // Store code with expiration (5 minutes)
    const expiresAt = Date.now() + 5 * 60 * 1000;
    verificationCodes.set(phone, {
      code,
      expiresAt,
      attempts: 0
    });

    // TODO: Eskiz.uz API integration
    // const response = await fetch('https://notify.eskiz.uz/api/message/sms/send', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': `Bearer ${ESKIZ_TOKEN}`
    //   },
    //   body: JSON.stringify({
    //     mobile_phone: phone,
    //     message: `BookBites tasdiqlash kodi: ${code}`,
    //     from: '4546',
    //   })
    // });

    // Temporary: Show code in console and alert
    console.log('=================================');
    console.log(`📱 SMS Verification Code`);
    console.log(`Phone: ${phone}`);
    console.log(`Code: ${code}`);
    console.log(`Expires: ${new Date(expiresAt).toLocaleTimeString()}`);
    console.log('=================================');

    // Show on screen temporarily
    if (typeof window !== 'undefined') {
      const message = `📱 Tasdiqlash kodi:\n\n${code}\n\n(5 daqiqa amal qiladi)`;
      
      // Create notification element
      const notification = document.createElement('div');
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 20px 30px;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.3);
        z-index: 9999;
        font-family: system-ui, -apple-system, sans-serif;
        max-width: 300px;
        animation: slideIn 0.3s ease-out;
      `;
      
      notification.innerHTML = `
        <div style="font-size: 14px; font-weight: 600; margin-bottom: 8px;">
          📱 SMS Tasdiqlash Kodi
        </div>
        <div style="font-size: 32px; font-weight: bold; letter-spacing: 4px; margin: 10px 0;">
          ${code}
        </div>
        <div style="font-size: 12px; opacity: 0.9;">
          5 daqiqa amal qiladi
        </div>
      `;
      
      // Add animation
      const style = document.createElement('style');
      style.textContent = `
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `;
      document.head.appendChild(style);
      
      document.body.appendChild(notification);
      
      // Auto remove after 10 seconds
      setTimeout(() => {
        notification.style.animation = 'slideIn 0.3s ease-out reverse';
        setTimeout(() => notification.remove(), 300);
      }, 10000);
    }

    return {
      success: true,
      code // Return code for development (remove in production)
    };
  } catch (error) {
    console.error('SMS send error:', error);
    return {
      success: false,
      error: 'SMS yuborishda xatolik yuz berdi'
    };
  }
};

/**
 * Verify SMS code
 * @param {string} phone - Phone number
 * @param {string} code - Verification code
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const verifyCode = async (phone, code) => {
  try {
    const stored = verificationCodes.get(phone);

    if (!stored) {
      return {
        success: false,
        error: 'Tasdiqlash kodi topilmadi. Qaytadan yuborish kerak'
      };
    }

    // Check expiration
    if (Date.now() > stored.expiresAt) {
      verificationCodes.delete(phone);
      return {
        success: false,
        error: 'Tasdiqlash kodi muddati tugagan. Qaytadan yuborish kerak'
      };
    }

    // Check attempts (max 3)
    if (stored.attempts >= 3) {
      verificationCodes.delete(phone);
      return {
        success: false,
        error: 'Juda ko\'p urinish. Qaytadan SMS yuboring'
      };
    }

    // Verify code
    if (stored.code !== code) {
      stored.attempts++;
      return {
        success: false,
        error: `Noto'g'ri kod. ${3 - stored.attempts} ta urinish qoldi`
      };
    }

    // Success - remove code
    verificationCodes.delete(phone);
    return {
      success: true
    };
  } catch (error) {
    console.error('Verification error:', error);
    return {
      success: false,
      error: 'Tekshirishda xatolik yuz berdi'
    };
  }
};

/**
 * Resend verification code
 * @param {string} phone - Phone number
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const resendVerificationSMS = async (phone) => {
  // Delete old code
  verificationCodes.delete(phone);
  
  // Send new code
  return sendVerificationSMS(phone);
};

export default {
  sendVerificationSMS,
  verifyCode,
  resendVerificationSMS
};
