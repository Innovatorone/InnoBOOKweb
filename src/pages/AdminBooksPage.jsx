import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { booksService } from '../services/api';
import { getBookImageUrl, uploadBookImage, uploadAudio, uploadBookFile } from '../lib/storage';
import { Edit2, Trash2, Plus, X, Save, Search, ArrowLeft, Upload, FileText, Music } from 'lucide-react';

export default function AdminBooksPage({ onBack }) {
  const { user } = useAuth();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingBook, setEditingBook] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [audioPreview, setAudioPreview] = useState('');
  const [bookPreview, setBookPreview] = useState('');

  useEffect(() => {
    loadBooks();
  }, []);

  const loadBooks = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await booksService.getAll();
      
      // Convert cover URLs
      const booksWithUrls = data.map(book => ({
        ...book,
        cover_url: getBookImageUrl(book.cover_url) || book.cover_url
      }));
      
      setBooks(booksWithUrls);
    } catch (err) {
      console.error('Error loading books:', err);
      setError('Kitoblarni yuklashda xatolik');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (book) => {
    setEditingBook({
      id: book.id,
      title: book.title,
      author: book.author,
      category: book.category,
      description: book.description,
      pages: book.pages,
      duration: book.duration,
      rating: book.rating,
      is_premium: book.is_premium,
      has_audiobook: book.has_audiobook,
      required_plan: book.required_plan || 'PRO',
      publisher: book.publisher || '',
      publish_year: book.publish_year || new Date().getFullYear(),
      language: book.language || 'uz',
      isbn: book.isbn || '',
      narrator: book.narrator || '',
      format: book.format || 'PDF',
      cover_url: book.cover_url,
      audio_url: book.audio_url,
      book_url: book.book_url
    });
    setCoverPreview(book.cover_url || '');
    setAudioPreview('');
    setBookPreview('');
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      setError('');
      setLoading(true);

      const updatedData = { ...editingBook };

      // Upload cover image if changed
      if (editingBook.cover_file) {
        const { path } = await uploadBookImage(editingBook.cover_file, editingBook.id);
        updatedData.cover_url = path;
        delete updatedData.cover_file;
      }

      // Upload audio file if changed
      if (editingBook.audio_file) {
        const { path } = await uploadAudio(editingBook.audio_file, editingBook.id);
        updatedData.audio_url = path;
        delete updatedData.audio_file;
      }

      // Upload book file if changed
      if (editingBook.book_file) {
        const { path } = await uploadBookFile(editingBook.book_file, editingBook.id);
        updatedData.book_file_url = path;
        delete updatedData.book_file;
      }

      await booksService.update(editingBook.id, updatedData);
      await loadBooks();
      setShowEditModal(false);
      setEditingBook(null);
      setCoverPreview('');
      setAudioPreview('');
      setBookPreview('');
    } catch (err) {
      console.error('Error updating book:', err);
      setError('Kitobni yangilashda xatolik: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookId) => {
    try {
      setError('');
      await booksService.delete(bookId);
      await loadBooks();
      setDeleteConfirm(null);
    } catch (err) {
      console.error('Error deleting book:', err);
      setError('Kitobni o\'chirishda xatolik');
    }
  };

  const handleEditChange = (field, value) => {
    setEditingBook(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (!file) return;

    if (fileType === 'cover') {
      // Rasm preview yaratish
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverPreview(reader.result);
        setEditingBook(prev => ({ ...prev, cover_file: file }));
      };
      reader.readAsDataURL(file);
    } else if (fileType === 'audio') {
      // Audio file saqlash
      const reader = new FileReader();
      reader.onloadend = () => {
        setAudioPreview(file.name);
        setEditingBook(prev => ({ ...prev, audio_file: file }));
      };
      reader.readAsDataURL(file);
    } else if (fileType === 'book') {
      // PDF/EPUB file saqlash
      setBookPreview(file.name);
      setEditingBook(prev => ({ ...prev, book_file: file }));
    }
  };

  const filteredBooks = books.filter(book => {
    const query = searchQuery.toLowerCase();
    return (
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      book.category.toLowerCase().includes(query)
    );
  });

  if (!user || user.type !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Ruxsat yo'q</h2>
          <p className="text-gray-600">Bu sahifa faqat adminlar uchun</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={onBack}
                className="p-2 hover:bg-gray-100 rounded-lg transition-all"
              >
                <ArrowLeft size={24} />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Kitoblar boshqaruvi</h1>
                <p className="text-gray-600 mt-1">Jami: {books.length} ta kitob</p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="mt-6">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder="Kitob, muallif yoki kategoriya qidiring..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        </div>
      )}

      {/* Books Table */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-600">Yuklanmoqda...</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kitob
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Muallif
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kategoriya
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sahifa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reyting
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Turi
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amallar
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBooks.map((book) => (
                  <tr key={book.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={book.cover_url}
                          alt={book.title}
                          className="h-12 w-8 object-cover rounded"
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{book.title}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{book.author}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-primary/10 text-primary">
                        {book.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {book.pages}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-sm font-medium text-gray-900">{book.rating}</span>
                        <span className="ml-1 text-yellow-400">★</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex gap-1">
                        {book.is_premium && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                            Premium
                          </span>
                        )}
                        {book.has_audiobook && (
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            Audio
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEdit(book)}
                        className="text-primary hover:text-primary-dark mr-4 inline-flex items-center gap-1"
                      >
                        <Edit2 size={16} />
                        Tahrirlash
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(book.id)}
                        className="text-red-600 hover:text-red-900 inline-flex items-center gap-1"
                      >
                        <Trash2 size={16} />
                        O'chirish
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredBooks.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">Kitob topilmadi</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && editingBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Kitobni tahrirlash</h2>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                {/* Muqova rasmi */}
                <div className="border-b pb-4 mb-4">
                  <h3 className="font-semibold text-lg mb-4">Muqova rasmi</h3>
                  
                  <div className="flex gap-4 items-start">
                    {/* Current cover preview */}
                    {coverPreview && (
                      <div>
                        <img 
                          src={coverPreview} 
                          alt="Cover" 
                          className="w-24 h-36 object-cover rounded-lg shadow-md"
                        />
                      </div>
                    )}
                    
                    {/* Upload new cover */}
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Yangi rasm yuklash
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, 'cover')}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-primary file:text-white file:cursor-pointer hover:file:bg-primary-dark"
                      />
                      <p className="text-xs text-gray-500 mt-1">JPG, PNG yoki WebP (max 2MB)</p>
                    </div>
                  </div>
                </div>

                {/* Asosiy ma'lumotlar */}
                <div className="border-b pb-4 mb-4">
                  <h3 className="font-semibold text-lg mb-4">Asosiy ma'lumotlar</h3>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kitob nomi *
                      </label>
                      <input
                        type="text"
                        value={editingBook.title}
                        onChange={(e) => handleEditChange('title', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>

                    {/* Author */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Muallif *
                      </label>
                      <input
                        type="text"
                        value={editingBook.author}
                        onChange={(e) => handleEditChange('author', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kategoriya
                      </label>
                      <select
                        value={editingBook.category}
                        onChange={(e) => handleEditChange('category', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="Fiction">Fiction</option>
                        <option value="Non-fiction">Non-fiction</option>
                        <option value="Biography">Biography</option>
                        <option value="History">History</option>
                        <option value="Science">Science</option>
                        <option value="Children">Children</option>
                        <option value="Poetry">Poetry</option>
                      </select>
                    </div>

                    {/* Language */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Til
                      </label>
                      <select
                        value={editingBook.language}
                        onChange={(e) => handleEditChange('language', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="uz">O'zbek</option>
                        <option value="en">English</option>
                        <option value="ru">Русский</option>
                      </select>
                    </div>

                    {/* Rating */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reyting (0-5)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        value={editingBook.rating}
                        onChange={(e) => handleEditChange('rating', parseFloat(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tavsif *
                    </label>
                    <textarea
                      value={editingBook.description}
                      onChange={(e) => handleEditChange('description', e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </div>

                {/* Nashriyot ma'lumotlari */}
                <div className="border-b pb-4 mb-4">
                  <h3 className="font-semibold text-lg mb-4">Nashriyot ma'lumotlari</h3>
                  
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {/* Publisher */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nashriyot
                      </label>
                      <input
                        type="text"
                        value={editingBook.publisher}
                        onChange={(e) => handleEditChange('publisher', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        placeholder="O'zbekiston"
                      />
                    </div>

                    {/* Publish Year */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nashr yili
                      </label>
                      <input
                        type="number"
                        min="1900"
                        max={new Date().getFullYear()}
                        value={editingBook.publish_year}
                        onChange={(e) => handleEditChange('publish_year', parseInt(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>

                    {/* Pages */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sahifalar soni
                      </label>
                      <input
                        type="number"
                        value={editingBook.page_count}
                        onChange={(e) => handleEditChange('page_count', parseInt(e.target.value))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* ISBN */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ISBN
                    </label>
                    <input
                      type="text"
                      value={editingBook.isbn}
                      onChange={(e) => handleEditChange('isbn', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      placeholder="978-9943-123-456-7"
                    />
                  </div>
                </div>

                {/* Premium va Audiobook */}
                <div className="border-b pb-4 mb-4">
                  <h3 className="font-semibold text-lg mb-4">Premium parametrlari</h3>
                  
                  {/* Checkboxes */}
                  <div className="space-y-3 mb-4">
                    <label className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <input
                        type="checkbox"
                        checked={editingBook.is_premium}
                        onChange={(e) => handleEditChange('is_premium', e.target.checked)}
                        className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="text-sm font-medium text-gray-700">Premium kitob (Faqat obunachilarga)</span>
                    </label>

                    <label className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <input
                        type="checkbox"
                        checked={editingBook.has_audiobook}
                        onChange={(e) => handleEditChange('has_audiobook', e.target.checked)}
                        className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="text-sm font-medium text-gray-700">Audio kitob mavjud</span>
                    </label>
                  </div>

                  {/* Required Plan (if premium) */}
                  {editingBook.is_premium && (
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Kerakli tarif
                      </label>
                      <select
                        value={editingBook.required_plan}
                        onChange={(e) => handleEditChange('required_plan', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      >
                        <option value="PRO">PRO</option>
                        <option value="VIP">VIP</option>
                      </select>
                    </div>
                  )}

                  {/* Audio details */}
                  {editingBook.has_audiobook && (
                    <div className="space-y-4 pl-4 border-l-4 border-blue-300">
                      {/* Audio file upload */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Music className="inline mr-2" size={16} />
                          Audio fayl yuklash
                        </label>
                        <input
                          type="file"
                          accept="audio/*"
                          onChange={(e) => handleFileChange(e, 'audio')}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-500 file:text-white file:cursor-pointer hover:file:bg-blue-600"
                        />
                        {audioPreview && (
                          <p className="text-sm text-blue-600 mt-2">✓ Tanlangan: {audioPreview}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">MP3, M4A yoki OGG (max 100MB)</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Audio davomiyligi
                          </label>
                          <input
                            type="text"
                            value={editingBook.audio_duration || ''}
                            onChange={(e) => handleEditChange('audio_duration', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="4:52:30"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Narrator (O'quvchi)
                          </label>
                          <input
                            type="text"
                            value={editingBook.narrator}
                            onChange={(e) => handleEditChange('narrator', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Jasur Umirov"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Kitob fayli va formati */}
                <div>
                  <h3 className="font-semibold text-lg mb-4">Kitob fayli va formati</h3>
                  
                  {/* Book file upload */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <FileText className="inline mr-2" size={16} />
                      Kitob fayli yuklash
                    </label>
                    <input
                      type="file"
                      accept=".pdf,.epub,.mobi"
                      onChange={(e) => handleFileChange(e, 'book')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-green-500 file:text-white file:cursor-pointer hover:file:bg-green-600"
                    />
                    {bookPreview && (
                      <p className="text-sm text-green-600 mt-2">✓ Tanlangan: {bookPreview}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-1">PDF, EPUB yoki MOBI (max 50MB)</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Format
                    </label>
                    <select
                      value={editingBook.format}
                      onChange={(e) => handleEditChange('format', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="PDF">PDF</option>
                      <option value="EPUB">EPUB</option>
                      <option value="MOBI">MOBI</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={handleSaveEdit}
                  className="flex-1 bg-primary text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-dark transition-all flex items-center justify-center gap-2"
                >
                  <Save size={20} />
                  Saqlash
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-all"
                >
                  Bekor qilish
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Kitobni o'chirish</h2>
            <p className="text-gray-600 mb-6">
              Haqiqatan ham bu kitobni o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-all"
              >
                O'chirish
              </button>
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-300 transition-all"
              >
                Bekor qilish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
