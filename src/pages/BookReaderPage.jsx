import { useState } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut, Settings, Bookmark, MoreVertical } from 'lucide-react';

export default function BookReaderPage({ book, onClose, onProgressUpdate }) {
  const [currentPage, setCurrentPage] = useState(book?.currentPage || 1);
  const [fontSize, setFontSize] = useState(16);
  const [fontFamily, setFontFamily] = useState('serif');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#000000');
  const [showSettings, setShowSettings] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);
  
  const totalPages = book?.pages || 300;
  const progress = Math.round((currentPage / totalPages) * 100);

  // Demo matn (Real loyihada backend'dan keladi)
  const demoText = `
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
    
    Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    
    Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
    
    Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit.
  `;

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      if (onProgressUpdate) {
        onProgressUpdate(book.id, newPage);
      }
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      if (onProgressUpdate) {
        onProgressUpdate(book.id, newPage);
      }
    }
  };

  const handleAddBookmark = () => {
    if (!bookmarks.includes(currentPage)) {
      setBookmarks([...bookmarks, currentPage]);
    }
  };

  const increaseFontSize = () => {
    if (fontSize < 24) setFontSize(fontSize + 2);
  };

  const decreaseFontSize = () => {
    if (fontSize > 12) setFontSize(fontSize - 2);
  };

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-all"
        >
          <X size={24} />
          <span className="hidden sm:inline">Yopish</span>
        </button>

        <div className="flex-1 text-center">
          <h1 className="font-semibold text-gray-900 truncate px-4">
            {book?.title || 'Kitob nomi'}
          </h1>
          <p className="text-sm text-gray-500">
            {currentPage} / {totalPages} sahifa ({progress}%)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAddBookmark}
            className="p-2 rounded-lg hover:bg-gray-100 transition-all"
            title="Bookmark qo'shish"
          >
            <Bookmark 
              size={20} 
              className={bookmarks.includes(currentPage) ? 'fill-primary text-primary' : 'text-gray-600'}
            />
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-all"
          >
            <Settings size={20} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-gray-50 border-b border-gray-200 px-4 py-4">
          <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Font Size */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shrift o'lchami
              </label>
              <div className="flex items-center gap-2">
                <button
                  onClick={decreaseFontSize}
                  className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <ZoomOut size={16} />
                </button>
                <span className="flex-1 text-center font-medium">{fontSize}px</span>
                <button
                  onClick={increaseFontSize}
                  className="p-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <ZoomIn size={16} />
                </button>
              </div>
            </div>

            {/* Font Family */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shrift turi
              </label>
              <select
                value={fontFamily}
                onChange={(e) => setFontFamily(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
              >
                <option value="serif">Serif</option>
                <option value="sans-serif">Sans-serif</option>
                <option value="monospace">Monospace</option>
              </select>
            </div>

            {/* Background Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fon rangi
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => { setBackgroundColor('#ffffff'); setTextColor('#000000'); }}
                  className="flex-1 h-10 bg-white border-2 border-gray-300 rounded-lg hover:border-primary"
                  title="Oq"
                />
                <button
                  onClick={() => { setBackgroundColor('#f5f5dc'); setTextColor('#000000'); }}
                  className="flex-1 h-10 bg-[#f5f5dc] border-2 border-gray-300 rounded-lg hover:border-primary"
                  title="Sepia"
                />
                <button
                  onClick={() => { setBackgroundColor('#1a1a1a'); setTextColor('#e5e5e5'); }}
                  className="flex-1 h-10 bg-[#1a1a1a] border-2 border-gray-300 rounded-lg hover:border-primary"
                  title="Qora"
                />
              </div>
            </div>

            {/* Bookmarks */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Belgilar ({bookmarks.length})
              </label>
              <div className="flex gap-1 flex-wrap">
                {bookmarks.slice(0, 3).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className="px-3 py-1 bg-primary text-white text-sm rounded-lg hover:bg-gray-800"
                  >
                    {page}
                  </button>
                ))}
                {bookmarks.length > 3 && (
                  <button className="px-2 py-1 bg-gray-200 text-gray-600 text-sm rounded-lg">
                    +{bookmarks.length - 3}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reading Content */}
      <div 
        className="flex-1 overflow-y-auto px-4 py-8"
        style={{ backgroundColor }}
      >
        <div 
          className="max-w-3xl mx-auto leading-relaxed"
          style={{ 
            fontSize: `${fontSize}px`,
            fontFamily,
            color: textColor,
            lineHeight: '1.8'
          }}
        >
          <h2 className="text-2xl font-bold mb-6">
            Chapter {Math.ceil(currentPage / 10)} - Sahifa {currentPage}
          </h2>
          
          {/* Demo matn - Real loyihada bu yerda PDF content yoki text bo'ladi */}
          <div className="space-y-4">
            {demoText.split('\n').filter(p => p.trim()).map((paragraph, idx) => (
              <p key={idx} className="mb-4">
                {paragraph.trim()}
              </p>
            ))}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border-t border-gray-200 px-4 py-2">
        <div className="max-w-4xl mx-auto">
          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="bg-white border-t border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-6 py-3 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft size={20} />
            <span className="hidden sm:inline">Oldingi</span>
          </button>

          <div className="flex items-center gap-4">
            <input
              type="number"
              min="1"
              max={totalPages}
              value={currentPage}
              onChange={(e) => {
                const page = parseInt(e.target.value);
                if (page >= 1 && page <= totalPages) {
                  setCurrentPage(page);
                }
              }}
              className="w-20 px-3 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-primary outline-none"
            />
            <span className="text-gray-600">/ {totalPages}</span>
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <span className="hidden sm:inline">Keyingi</span>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
