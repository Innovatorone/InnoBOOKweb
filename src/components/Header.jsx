import { Search, Bell, Menu } from 'lucide-react';

export default function Header({ user, onMenuClick, searchQuery, onSearchChange, onProfileClick }) {
  return (
    <header className="bg-white border-b border-gray-200 px-4 md:px-8 py-4 flex items-center justify-between fixed top-0 right-0 left-0 md:left-20 z-10">
      {/* Mobile Menu Button */}
      <button 
        onClick={onMenuClick}
        className="md:hidden w-10 h-10 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-all"
      >
        <Menu size={20} className="text-gray-600" />
      </button>

      {/* Search Bar */}
      <div className="flex-1 max-w-xl hidden sm:block">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Kitob nomi, muallif yoki kategoriya bo'yicha qidirish..."
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm transition-all"
          />
        </div>
      </div>

      {/* User Info */}
      <div className="flex items-center gap-2 md:gap-4">
        <button className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-all">
          <Bell size={20} className="text-gray-600" />
        </button>
        <button 
          onClick={onProfileClick}
          className="flex items-center gap-3 hover:opacity-80 transition-all"
        >
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xl">
            {user.avatar}
          </div>
          <span className="hidden md:block font-medium text-gray-900">{user.name}</span>
        </button>
      </div>
    </header>
  );
}
