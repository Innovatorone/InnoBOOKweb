import BookCard from '../components/BookCard';
import { Filter } from 'lucide-react';

export default function ReadingHistoryPage({ books, onBookClick }) {
  const readingHistory = books.filter(book => book.currentPage && book.currentPage > 0);
  
  return (
    <div className="min-h-screen bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">O'qish tarixi</h1>
            <p className="text-gray-600 mt-1">{readingHistory.length} kitob o'qilmoqda</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-all">
            <Filter size={20} />
            <span>Filtr</span>
          </button>
        </div>

        {readingHistory.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {readingHistory.map((book) => (
              <div key={book.id} className="space-y-2">
                <BookCard 
                  book={book} 
                  onClick={() => onBookClick(book)}
                  size="large"
                />
                <div className="px-2">
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${(book.currentPage / book.pageCount) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-600 text-center">
                    {book.currentPage} / {book.pageCount} sahifa
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="text-6xl mb-4">📚</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Hali kitob o'qimagan ekansiz
              </h2>
              <p className="text-gray-600">
                Kitob o'qishni boshlang va bu yerda ko'ring
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
