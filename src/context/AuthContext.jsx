import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { getAvatarUrl } from '../lib/storage';

const AuthContext = createContext();

// Local storage keys
const STORAGE_USER_KEY = 'bookbites_user';
const STORAGE_TOKEN_KEY = 'bookbites_token';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Check saved user on mount
  useEffect(() => {
    checkSavedUser();
  }, []);

  const checkSavedUser = () => {
    try {
      const savedUser = localStorage.getItem(STORAGE_USER_KEY);
      const savedToken = localStorage.getItem(STORAGE_TOKEN_KEY);
      
      if (savedUser && savedToken) {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error checking saved user:', error);
      localStorage.removeItem(STORAGE_USER_KEY);
      localStorage.removeItem(STORAGE_TOKEN_KEY);
    } finally {
      setLoading(false);
    }
  };

  const loadUserProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      
      // Convert avatar path to public URL if it's a storage path
      const userData = {
        ...data,
        avatar: getAvatarUrl(data.avatar) || data.avatar
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      
      // Update last_login
      await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', userId);
    } catch (error) {
      console.error('Error loading user profile:', error);
    }
  };

  const login = async (phone, password) => {
    try {
      // Call authenticate function
      const { data, error } = await supabase
        .rpc('authenticate_user', {
          p_phone: phone,
          p_password: password
        });
      
      if (error) throw error;
      
      if (!data || data.length === 0) {
        return { success: false, error: 'Telefon raqam yoki parol noto\'g\'ri' };
      }
      
      const userData = data[0];
      
      // Convert avatar to URL
      const userWithAvatar = {
        id: userData.user_id,
        name: userData.user_name,
        avatar: getAvatarUrl(userData.user_avatar) || userData.user_avatar,
        type: userData.user_type,
        plan: userData.user_plan,
        email: userData.user_email,
        phone: userData.user_phone
      };
      
      // Save to localStorage
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(userWithAvatar));
      localStorage.setItem(STORAGE_TOKEN_KEY, userData.user_id);
      
      setUser(userWithAvatar);
      setIsAuthenticated(true);
      
      // Update last_login
      await supabase
        .from('users')
        .update({ last_login: new Date().toISOString() })
        .eq('id', userData.user_id);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message };
    }
  };

  const signUp = async (phone, password, name, avatar = '👤') => {
    try {
      // Call create user function
      const { data: userId, error } = await supabase
        .rpc('create_user_with_phone', {
          p_phone: phone,
          p_password: password,
          p_name: name,
          p_avatar: avatar
        });
      
      if (error) throw error;
      
      // Auto login after signup
      return await login(phone, password);
    } catch (error) {
      console.error('Sign up error:', error);
      
      if (error.message.includes('allaqachon')) {
        return { success: false, error: 'Bu telefon raqam allaqachon ro\'yxatdan o\'tgan' };
      }
      
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_USER_KEY);
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateUser = async (updatedData) => {
    try {
      const { error } = await supabase
        .from('users')
        .update(updatedData)
        .eq('id', user.id);
      
      if (error) throw error;
      
      const newUserData = { ...user, ...updatedData };
      setUser(newUserData);
      
      // Update localStorage
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(newUserData));
      
      return { success: true };
    } catch (error) {
      console.error('Update user error:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    signUp,
    logout,
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
