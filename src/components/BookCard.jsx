import { useFavorites } from '../context/FavoritesContext';
import { Bookmark } from 'lucide-react';

export default function BookCard({ book, onClick, size = 'medium' }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const bookIsFavorite = isFavorite(book.id);

  const sizes = {
    small: 'w-28 sm:w-32',
    medium: 'w-32 sm:w-40',
    large: 'w-36 sm:w-48'
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation(); // Prevent triggering onClick
    toggleFavorite(book.id);
  };

  return (
    <div 
      className={`${sizes[size]} cursor-pointer group flex-shrink-0`}
      onClick={onClick}
    >
      <div className="relative mb-3 rounded-lg overflow-hidden shadow-lg transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-2xl">
        <div 
          className="aspect-[2/3] bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center"
          style={{ backgroundColor: book.coverColor }}
        >
          {book.cover ? (
            <img 
              src={book.cover} 
              alt={book.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-white text-4xl">📚</span>
          )}
        </div>
        
        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-2 left-2 w-8 h-8 rounded-lg bg-white bg-opacity-90 hover:bg-opacity-100 flex items-center justify-center transition-all shadow-md z-10"
        >
          <Bookmark 
            size={16} 
            className={`${bookIsFavorite ? 'text-primary' : 'text-gray-400'} transition-colors`}
            fill={bookIsFavorite ? 'currentColor' : 'none'}
          />
        </button>
        
        {/* Audio Badge */}
        {book.hasAudiobook && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
            🎧
          </div>
        )}
        
        {/* Premium Badge */}
        {book.isPremium && (
          <div className="absolute top-12 left-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
            PREMIUM
          </div>
        )}
      </div>
      <h3 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
        {book.title}
      </h3>
      {book.author && (
        <p className="text-xs text-gray-500">{book.author}</p>
      )}
    </div>
  );
}
