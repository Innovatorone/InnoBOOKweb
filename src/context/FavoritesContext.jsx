import { createContext, useContext, useState, useEffect } from 'react';
import { bookmarksService } from '../services/api';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext();

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load bookmarks from Supabase when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      loadBookmarks();
    } else {
      setFavorites([]);
    }
  }, [isAuthenticated, user?.id]);

  const loadBookmarks = async () => {
    try {
      setLoading(true);
      const bookmarks = await bookmarksService.getByUser(user.id);
      const bookmarkIds = bookmarks.map(bm => bm.book_id);
      setFavorites(bookmarkIds);
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (bookId) => {
    if (!user?.id) return;

    try {
      const isBookmarked = await bookmarksService.toggle(user.id, bookId);
      
      if (isBookmarked) {
        setFavorites(prev => [...prev, bookId]);
      } else {
        setFavorites(prev => prev.filter(id => id !== bookId));
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  const isFavorite = (bookId) => {
    return favorites.includes(bookId);
  };

  const value = {
    favorites,
    loading,
    toggleFavorite,
    isFavorite
  };

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
};
