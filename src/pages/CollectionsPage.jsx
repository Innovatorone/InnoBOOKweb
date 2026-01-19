import { useState, useMemo } from 'react';
import { Filter, SlidersHorizontal, X } from 'lucide-react';
import BookCard from '../components/BookCard';

export default function CollectionsPage({ books, authors, onBookClick, searchQuery }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPlan, setSelectedPlan] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);

  // Kategoriyalar
  const categories = useMemo(() => {
    const cats = ['all', ...new Set(books.map(b => b.category))];
    return cats;
  }, [books]);

  // Filterlangan va tartiblangan kitoblar
  const filteredAndSortedBooks = useMemo(() => {
    let result = books;

    // Qidiruv
    if (searchQuery) {
      result = result.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Kategoriya filter
    if (selectedCategory !== 'all') {
      result = result.filter(b => b.category === selectedCategory);
    }

    // Plan/Tarif filter
    if (selectedPlan === 'free') {
      result = result.filter(b => !b.is_premium);
    } else if (selectedPlan === 'premium') {
      result = result.filter(b => b.is_premium);
    }

    // Saralash
    switch (sortBy) {
      case 'newest':
        result = [...result].sort((a, b) => 
          new Date(b.created_at || 0) - new Date(a.created_at || 0)
        );
        break;
      case 'oldest':
        result = [...result].sort((a, b) => 
          new Date(a.created_at || 0) - new Date(b.created_at || 0)
        );
        break;
      case 'rating':
        result = [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'title':
        result = [...result].sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    return result;
  }, [books, searchQuery, selectedCategory, selectedPlan, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedPlan('all');
    setSortBy('newest');
  };

  const hasActiveFilters = selectedCategory !== 'all' || selectedPlan !== 'all' || sortBy !== 'newest';

  return (
    <div className="min-h-screen bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-gray-900 mb-2">
            Jamlanma
          </h1>
          <p className="text-gray-600">
            {filteredAndSortedBooks.length} ta kitob topildi
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm mb-6">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="w-full flex items-center justify-between px-4 py-3 bg-gray-100 rounded-xl"
            >
              <span className="flex items-center gap-2 font-medium">
                <SlidersHorizontal size={20} />
                Filterlar
              </span>
              {hasActiveFilters && (
                <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
                  Faol
                </span>
              )}
            </button>
          </div>

          {/* Desktop Filters - Single Row with Dropdowns */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Category Dropdown */}
            <div className="flex-1">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer"
              >
                <option value="all">Turkum: Hammasi</option>
                {categories.filter(c => c !== 'all').map(cat => (
                  <option key={cat} value={cat}>Turkum: {cat}</option>
                ))}
              </select>
            </div>

            {/* Plan Dropdown */}
            <div className="flex-1">
              <select
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer"
              >
                <option value="all">Tarif: Hammasi</option>
                <option value="free">Tarif: Bepul</option>
                <option value="premium">Tarif: Premium</option>
              </select>
            </div>

            {/* Sort Dropdown */}
            <div className="flex-1">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer"
              >
                <option value="newest">Saralash: Yangilar</option>
                <option value="oldest">Saralash: Eskilar</option>
                <option value="rating">Saralash: Baho</option>
                <option value="title">Saralash: Nom</option>
              </select>
            </div>

            {/* Reset Button */}
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-2 px-5 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all border border-red-200"
              >
                <X size={16} />
                Tozalash
              </button>
            )}
          </div>

          {/* Mobile Filter Content */}
          <div className={`${showFilters ? 'block' : 'hidden'} lg:hidden space-y-4`}>
            {/* Categories */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Turkum
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === cat
                        ? 'bg-primary text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cat === 'all' ? 'Hammasi' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Plan/Tariff */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Tarif
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedPlan('all')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedPlan === 'all'
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Hammasi
                </button>
                <button
                  onClick={() => setSelectedPlan('free')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedPlan === 'free'
                      ? 'bg-green-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Bepul
                </button>
                <button
                  onClick={() => setSelectedPlan('premium')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedPlan === 'premium'
                      ? 'bg-yellow-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Premium
                </button>
              </div>
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                Saralash
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSortBy('newest')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    sortBy === 'newest'
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Yangilar
                </button>
                <button
                  onClick={() => setSortBy('oldest')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    sortBy === 'oldest'
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Eskilar
                </button>
                <button
                  onClick={() => setSortBy('rating')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    sortBy === 'rating'
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Baho
                </button>
                <button
                  onClick={() => setSortBy('title')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    sortBy === 'title'
                      ? 'bg-primary text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  Nom
                </button>
              </div>
            </div>

            {/* Reset Button */}
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-all border border-red-200"
              >
                <X size={16} />
                Tozalash
              </button>
            )}
          </div>
        </div>

        {/* Books Grid */}
        {filteredAndSortedBooks.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredAndSortedBooks.map((book) => (
              <BookCard 
                key={book.id}
                book={book} 
                onClick={() => onBookClick(book)}
                size="large"
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Hech narsa topilmadi
            </h3>
            <p className="text-gray-600 mb-4">
              {searchQuery 
                ? `"${searchQuery}" bo'yicha natija yo'q`
                : 'Bu filterlar bo\'yicha kitob yo\'q'
              }
            </p>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="px-6 py-3 bg-primary text-white rounded-full hover:bg-gray-800 transition-all"
              >
                Filterlarni tozalash
              </button>
            )}
          </div>
        )}

        {/* Author Quote Section */}
        {authors && authors.length > 0 && !searchQuery && (
          <section className="bg-white rounded-2xl lg:rounded-3xl p-6 lg:p-12 shadow-sm mt-8">
            <div className="flex flex-col sm:flex-row gap-6 lg:gap-8 items-start">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gray-200 flex items-center justify-center text-4xl sm:text-5xl flex-shrink-0 mx-auto sm:mx-0">
                {authors[0].avatar}
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                  {authors[0].name}
                </h3>
                <p className="text-sm text-gray-500 mb-4">{authors[0].title}</p>
                <p className="text-gray-700 leading-relaxed italic">
                  "{authors[0].quote}"
                </p>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
