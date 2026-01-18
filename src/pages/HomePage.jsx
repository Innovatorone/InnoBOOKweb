import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { useState } from 'react';
import BookCard from '../components/BookCard';

export default function HomePage({ books, currentUser, friends, schedule, onBookClick, searchQuery }) {
  const currentBook = currentUser?.currentReading?.bookId 
    ? books.find(b => b.id === currentUser.currentReading.bookId)
    : books[0]; // Fallback to first book if no current reading
  
  // Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Generate calendar days
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty slots for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    return days;
  };
  
  const monthNames = ['Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 
                      'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'];
  const dayNames = ['Ya', 'Du', 'Se', 'Ch', 'Pa', 'Ju', 'Sh'];
  
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };
  
  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };
  
  const today = new Date();
  const isToday = (day) => {
    return day === today.getDate() && 
           currentMonth.getMonth() === today.getMonth() && 
           currentMonth.getFullYear() === today.getFullYear();
  };
  
  const calendarDays = generateCalendarDays();
  
  // Qidiruv funksiyasi
  const filteredBooks = searchQuery
    ? books.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : books;
  
  const popularBooks = searchQuery ? filteredBooks.slice(0, 10) : filteredBooks.slice(6, 10);

  return (
    <div className="min-h-screen bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6 lg:space-y-8">
            {/* Current Reading Section */}
            <section className="bg-white rounded-2xl lg:rounded-3xl p-6 lg:p-8 shadow-sm">
              <h1 className="text-3xl lg:text-4xl font-serif font-bold text-gray-900 mb-2">
                Happy reading,
              </h1>
              <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">
                {currentUser?.name || 'Guest'}
              </h2>
              <p className="text-gray-600 mb-6">
                Wow! you've delved deep into the wizarding world's secrets.<br />
                Have Harry's parents died yet? Oops, looks like you're not there yet. Get reading now!
              </p>
              <button className="bg-primary text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-all">
                Start reading ↗
              </button>
            </section>

            {/* Currently Reading Book */}
            <section className="bg-white rounded-2xl lg:rounded-3xl p-6 lg:p-8 shadow-sm flex flex-col sm:flex-row gap-6 lg:gap-8">
              <div className="flex-shrink-0 mx-auto sm:mx-0">
                <div className="relative">
                  <div 
                    className="w-48 h-64 sm:w-56 sm:h-72 lg:w-64 lg:h-80 rounded-xl shadow-lg overflow-hidden"
                    style={{ backgroundColor: currentBook?.coverColor }}
                  >
                    {currentBook?.cover ? (
                      <img 
                        src={currentBook.cover} 
                        alt={currentBook.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white text-6xl">
                        📖
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-gray-900 mb-3 lg:mb-4">
                  {currentBook?.title || 'The Cambers of Secrets'}
                </h3>
                <p className="text-lg text-gray-600 mb-4">
                  {currentUser?.currentReading?.progress || 0} / {currentUser?.currentReading?.totalPages || currentBook?.pageCount || 300} pages
                </p>
                <p className="text-gray-700 mb-6">
                  {currentBook?.description || 'Harry as he returns to Hogwarts school of witchcraft and wizardry for his 2nd year, only to discover that...'}
                </p>
                <p className="text-sm text-gray-500 mb-2">- {currentBook?.author || 'JK Rowlings'}</p>
              </div>
            </section>

            {/* Popular Now */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-gray-900">
                  {searchQuery ? `Qidiruv natijalari (${filteredBooks.length})` : 'Popular Now'}
                </h2>
                <button className="text-gray-600 hover:text-gray-900">
                  <MoreHorizontal size={24} />
                </button>
              </div>
              
              {searchQuery ? (
                // Qidiruv natijalari - grid ko'rinishda
                filteredBooks.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {filteredBooks.map((book) => (
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
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Hech narsa topilmadi
                    </h3>
                    <p className="text-gray-600">
                      "{searchQuery}" bo'yicha natija yo'q. Boshqa so'z bilan qidiring.
                    </p>
                  </div>
                )
              ) : (
                // Odatiy ko'rinish - horizontal scroll
                <div className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 scrollbar-hide">
                  {popularBooks.map((book) => (
                    <BookCard 
                      key={book.id} 
                      book={book} 
                      onClick={() => onBookClick(book)}
                      size="medium"
                    />
                  ))}
                </div>
              )}
            </section>

            {/* New Series Collection */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-gray-900">New Series Collection</h2>
                <button className="text-gray-600 hover:text-gray-900">
                  <MoreHorizontal size={24} />
                </button>
              </div>
              <div className="bg-white rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-6 shadow-sm">
                <div className="flex gap-3">
                  <div className="w-16 h-24 bg-gray-200 rounded-lg"></div>
                  <div className="w-16 h-24 bg-gray-300 rounded-lg"></div>
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-semibold text-gray-900 mb-1">
                    A Legend of Ice and Fire: The Ice Horse
                  </h3>
                  <p className="text-sm text-gray-600">8 chapters each vol</p>
                </div>
                <div className="text-center sm:text-right">
                  <span className="text-2xl font-bold text-gray-900">2 vol</span>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column - Sidebar Widgets */}
          <div className="space-y-6">
            {/* Schedule Reading - Modern Calendar */}
            <section className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-gray-900 text-lg">O'qish jadvali</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={goToPreviousMonth}
                    className="w-9 h-9 rounded-xl hover:bg-gray-100 flex items-center justify-center transition-all"
                  >
                    <ChevronLeft size={18} className="text-gray-600" />
                  </button>
                  <button 
                    onClick={goToNextMonth}
                    className="w-9 h-9 rounded-xl hover:bg-gray-100 flex items-center justify-center transition-all"
                  >
                    <ChevronRight size={18} className="text-gray-600" />
                  </button>
                </div>
              </div>
              
              {/* Calendar Grid */}
              <div className="space-y-3">
                {/* Day names */}
                <div className="grid grid-cols-7 gap-3 mb-2">
                  {dayNames.map((day, idx) => (
                    <div key={idx} className="text-center">
                      <span className="text-xs font-medium text-gray-500">{day}</span>
                    </div>
                  ))}
                </div>
                
                {/* Calendar days */}
                <div className="grid grid-cols-7 gap-3">
                  {calendarDays.map((day, idx) => (
                    <div key={idx} className="aspect-square">
                      {day ? (
                        <button
                          className={`w-full h-full rounded-2xl flex items-center justify-center font-medium text-sm transition-all ${
                            isToday(day)
                              ? 'bg-gradient-to-br from-primary to-purple-600 text-white shadow-lg scale-105'
                              : 'text-gray-700 hover:bg-gray-100 hover:scale-105'
                          }`}
                        >
                          {day}
                        </button>
                      ) : (
                        <div className="w-full h-full"></div>
                      )}
                    </div>
                  ))}
                </div>
                
                {/* Reading stats */}
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-br from-primary to-purple-600"></div>
                      <span className="text-gray-600">Bugun</span>
                    </div>
                    <span className="font-semibold text-gray-900">30 daqiqa</span>
                  </div>
                  <div className="flex items-center justify-between text-sm mt-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-gray-600">Bu hafta</span>
                    </div>
                    <span className="font-semibold text-gray-900">3 soat 15 daqiqa</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Reader Friends */}
            <section className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-gray-900">Do'stlarim</h3>
                  <p className="text-xs text-gray-500 mt-1">
                    {friends?.length || 0} ta faol o'quvchi
                  </p>
                </div>
                <button className="text-primary hover:text-primary/80 text-sm font-medium">
                  Hammasi
                </button>
              </div>
              <div className="space-y-4">
                {friends?.map((friend) => (
                  <div key={friend.id} className="flex gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center text-2xl border-2 border-primary/20">
                        {friend.avatar}
                      </div>
                      {friend.streak >= 7 && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center text-xs">
                          🔥
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 text-sm truncate">
                            {friend.name}
                          </h4>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-gray-500">
                              {friend.booksRead} kitob
                            </span>
                            {friend.streak >= 7 && (
                              <>
                                <span className="text-gray-300">•</span>
                                <span className="text-xs text-orange-600 font-medium">
                                  {friend.streak} kun ketma-ket
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        {friend.lastActivity?.badge && (
                          <span className="text-lg flex-shrink-0">
                            {friend.lastActivity.badge}
                          </span>
                        )}
                      </div>
                      
                      {friend.lastActivity.type === 'comment' && (
                        <>
                          <p className="text-xs text-gray-700 line-clamp-2 mb-1.5 leading-relaxed">
                            "{friend.lastActivity.comment}"
                          </p>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-primary font-medium truncate flex-1">
                              {friend.lastActivity.chapter}
                            </span>
                            <span className="text-gray-400 flex-shrink-0 ml-2">
                              {friend.lastActivity.timestamp}
                            </span>
                          </div>
                        </>
                      )}
                      
                      {(friend.lastActivity.type === 'reading' || 
                        friend.lastActivity.type === 'review' ||
                        friend.lastActivity.type === 'achievement' ||
                        friend.lastActivity.type === 'milestone') && (
                        <>
                          <p className="text-xs text-gray-600 mb-1">
                            {friend.lastActivity.text}
                          </p>
                          <span className="text-xs text-gray-400">
                            {friend.lastActivity.timestamp}
                          </span>
                        </>
                      )}
                      
                      {friend.currentBook && (
                        <div className="mt-2 pt-2 border-t border-gray-100">
                          <p className="text-xs text-gray-500">
                            Hozir o'qiyapti:{' '}
                            <span className="text-gray-700 font-medium">
                              {friend.currentBook}
                            </span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )) || (
                  <div className="text-center py-8">
                    <div className="text-4xl mb-3">👥</div>
                    <p className="text-gray-500 text-sm">
                      Hali do'stlaringiz yo'q
                    </p>
                    <button className="mt-3 text-primary text-sm font-medium hover:underline">
                      Do'st qo'shish
                    </button>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
