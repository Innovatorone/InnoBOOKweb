import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FavoritesProvider } from './context/FavoritesContext';
import { BooksProvider, useBooks } from './context/BooksContext';
import Sidebar from './components/Sidebar';
import MobileMenu from './components/MobileMenu';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import CollectionsPage from './pages/CollectionsPage';
import BookDetail from './pages/BookDetail';
import BookReaderPage from './pages/BookReaderPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import AdminPanel from './pages/AdminPanel';
import AdminBooksPage from './pages/AdminBooksPage';
import AdminPlansPage from './pages/AdminPlansPage';
import AdminCategoriesPage from './pages/AdminCategoriesPage';
import ReadingHistoryPage from './pages/ReadingHistoryPage';
import BookmarksPage from './pages/BookmarksPage';

function AppContent() {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const { books, loading: booksLoading } = useBooks();
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedBook, setSelectedBook] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showReader, setShowReader] = useState(false);

  // Show loading while checking authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-pulse">📚</div>
          <p className="text-gray-600">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  const handleBookClick = (book) => {
    setSelectedBook(book);
  };

  const handleBackToHome = () => {
    setSelectedBook(null);
  };

  const handlePageChange = (page) => {
    setSelectedBook(null); // Clear selected book when changing pages
    setCurrentPage(page);
  };

  const handleStartReading = (book) => {
    setSelectedBook(book);
    setShowReader(true);
  };

  const handleCloseReader = () => {
    setShowReader(false);
  };

  const handleProgressUpdate = (bookId, currentPage) => {
    // Bu yerda progress backend'ga saqlanadi
    console.log(`Book ${bookId} - Current page: ${currentPage}`);
  };

  // Show login page if not authenticated
  if (!isAuthenticated) {
    if (showSignUp) {
      return (
        <SignUpPage 
          onBackToLogin={() => setShowSignUp(false)}
        />
      );
    }
    return (
      <LoginPage 
        onSignUpClick={() => setShowSignUp(true)}
      />
    );
  }

  // Admin uchun maxsus sahifalar
  if (user?.type === 'admin' && currentPage === 'admin') {
    return <AdminPanel onBack={() => setCurrentPage('home')} onNavigate={setCurrentPage} />;
  }

  if (user?.type === 'admin' && currentPage === 'admin-books') {
    return <AdminBooksPage onBack={() => setCurrentPage('home')} />;
  }

  if (user?.type === 'admin' && currentPage === 'admin-plans') {
    return <AdminPlansPage onBack={() => setCurrentPage('admin')} />;
  }

  if (user?.type === 'admin' && currentPage === 'admin-categories') {
    return <AdminCategoriesPage onBack={() => setCurrentPage('admin')} />;
  }

  // Kitob o'qish sahifasi
  if (showReader && selectedBook) {
    return (
      <BookReaderPage 
        book={selectedBook}
        onClose={handleCloseReader}
        onProgressUpdate={handleProgressUpdate}
      />
    );
  }

  return (
    <div className="min-h-screen bg-secondary">
      <Sidebar 
        currentPage={currentPage} 
        onPageChange={handlePageChange}
        userType={user?.type}
      />
      <MobileMenu 
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        userType={user?.type}
      />
      
      <div className="md:ml-20">
        <Header 
          user={user}
          onMenuClick={() => setMobileMenuOpen(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onProfileClick={() => setCurrentPage('profile')}
        />
        
        <main className="pt-20">
          {selectedBook ? (
            <BookDetail 
              book={selectedBook} 
              onBack={handleBackToHome}
              onStartReading={handleStartReading}
            />
          ) : currentPage === 'settings' ? (
            <SettingsPage 
              user={user}
            />
          ) : currentPage === 'profile' ? (
            <ProfilePage onBack={() => setCurrentPage('home')} />
          ) : currentPage === 'reading' ? (
            <ReadingHistoryPage 
              books={books}
              onBookClick={handleBookClick}
            />
          ) : currentPage === 'bookmarks' ? (
            <BookmarksPage 
              books={books}
              onBookClick={handleBookClick}
            />
          ) : currentPage === 'home' ? (
            <HomePage 
              books={books}
              currentUser={user}
              friends={[]}
              schedule={[]}
              onBookClick={handleBookClick}
              searchQuery={searchQuery}
            />
          ) : currentPage === 'collections' ? (
            <CollectionsPage 
              books={books}
              authors={[]}
              onBookClick={handleBookClick}
              searchQuery={searchQuery}
            />
          ) : (
            <div className="flex items-center justify-center h-screen">
              <div className="text-center">
                <h2 className="text-4xl font-serif font-bold text-gray-900 mb-4">
                  Coming Soon
                </h2>
                <p className="text-gray-600">
                  This page is under construction
                </p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
function App() {
  return (
    <AuthProvider>
      <BooksProvider>
        <FavoritesProvider>
          <AppContent />
        </FavoritesProvider>
      </BooksProvider>
    </AuthProvider>
  );
}

export default App;
