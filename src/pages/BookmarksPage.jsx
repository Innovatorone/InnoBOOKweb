import BookCard from '../components/BookCard';
import { useFavorites } from '../context/FavoritesContext';
import { Filter, Bookmark } from 'lucide-react';

export default function BookmarksPage({ books, onBookClick }) {
  const { favorites } = useFavorites();
  
  const favoriteBooks = books.filter(book => favorites.includes(book.id));

  return (
    <div className="min-h-screen bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Bookmark className="text-primary" fill="currentColor" />
              Belgilar
            </h1>
            <p className="text-gray-600 mt-1">{favoriteBooks.length} ta saqlangan kitob</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-all">
            <Filter size={20} />
            <span>Filtr</span>
          </button>
        </div>

        {favoriteBooks.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {favoriteBooks.map((book) => (
              <BookCard 
                key={book.id}
                book={book} 
                onClick={() => onBookClick(book)}
                size="large"
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="text-6xl mb-4">📑</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Saqlangan kitoblar yo'q
              </h2>
              <p className="text-gray-600">
                Kitoblarga bookmark belgisini bosing va bu yerda ko'ring
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
