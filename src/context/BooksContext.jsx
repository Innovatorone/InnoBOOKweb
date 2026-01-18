import { createContext, useContext, useState, useEffect } from 'react';
import { booksService } from '../services/api';
import { getBookImageUrl } from '../lib/storage';

const BooksContext = createContext();

export const useBooks = () => {
  const context = useContext(BooksContext);
  if (!context) {
    throw new Error('useBooks must be used within a BooksProvider');
  }
  return context;
};

export const BooksProvider = ({ children }) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await booksService.getAll();
      
      // Convert cover URLs to public URLs
      const booksWithUrls = data.map(book => {
        const coverUrl = getBookImageUrl(book.cover_url) || book.cover_url;
        return {
          ...book,
          cover_url: coverUrl,
          cover: coverUrl // For backward compatibility with BookCard
        };
      });
      
      setBooks(booksWithUrls);
    } catch (err) {
      console.error('Error loading books:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const refreshBooks = () => {
    return loadBooks();
  };

  const value = {
    books,
    loading,
    error,
    refreshBooks
  };

  return <BooksContext.Provider value={value}>{children}</BooksContext.Provider>;
};
