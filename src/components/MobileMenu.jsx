import { Home, BookOpen, Library, Bookmark, Settings, X, Shield, User, BookMarked } from 'lucide-react';

export default function MobileMenu({ isOpen, onClose, currentPage, onPageChange, userType }) {
  if (!isOpen) return null;

  const menuItems = [
    { icon: Home, page: 'home', label: 'Bosh sahifa' },
    { icon: BookOpen, page: 'collections', label: 'Kolleksiyalar' },
    { icon: Library, page: 'reading', label: 'O\'qish tarixi' },
    { icon: Bookmark, page: 'bookmarks', label: 'Belgilar' },
    { icon: User, page: 'profile', label: 'Profil' },
    { icon: Settings, page: 'settings', label: 'Sozlamalar' },
  ];

  // Admin uchun maxsus menu
  if (userType === 'admin') {
    menuItems.push({ icon: Shield, page: 'admin', label: 'Admin Panel' });
  }

  const handlePageChange = (page) => {
    onPageChange(page);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
        onClick={onClose}
      />
      
      {/* Menu */}
      <div className="fixed top-0 left-0 bottom-0 w-64 bg-white z-50 md:hidden shadow-xl">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="text-3xl">✍️</div>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-all"
            >
              <X size={24} />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 px-4 py-6">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.page;
              return (
                <button
                  key={item.page}
                  onClick={() => handlePageChange(item.page)}
                  className={`w-full flex items-center gap-4 px-4 py-4 rounded-xl mb-2 transition-all ${
                    isActive
                      ? 'bg-accent text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={24} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </>
  );
}
