import { Home, BookOpen, Library, Bookmark, Settings, Menu, Shield, User, BookMarked } from 'lucide-react';

export default function Sidebar({ currentPage, onPageChange, userType }) {
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

  return (
    <aside className="hidden md:flex w-20 bg-white border-r border-gray-200 flex-col items-center py-8 fixed h-full z-20">
      {/* Logo */}
      <div className="mb-12 text-3xl cursor-pointer" title="Maktabatu Ahlis-Sunnah">
        📚
      </div>

      {/* Menu Items */}
      <nav className="flex-1 flex flex-col gap-8">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.page;
          return (
            <button
              key={item.page}
              onClick={() => onPageChange(item.page)}
              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                isActive
                  ? 'bg-accent text-white'
                  : 'text-gray-400 hover:text-gray-700 hover:bg-gray-100'
              }`}
              title={item.label}
            >
              <Icon size={24} />
            </button>
          );
        })}
      </nav>

      {/* Menu Toggle */}
      <button className="w-12 h-12 rounded-xl flex items-center justify-center text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all">
        <Menu size={24} />
      </button>
    </aside>
  );
}
