import { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, Bookmark, Share2, Download, Star, ThumbsUp } from 'lucide-react';
import AudioPlayer from '../components/AudioPlayer';
import { reviewsService } from '../services/api';

export default function BookDetail({ book, onBack, onStartReading }) {
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [userReview, setUserReview] = useState('');
  const [reviews, setReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load reviews from Supabase
  useEffect(() => {
    loadReviews();
  }, [book.id]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await reviewsService.getByBook(book.id);
      setReviews(data || []);
    } catch (error) {
      console.error('Sharhlarni yuklashda xatolik:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!userReview.trim() || userRating === 0) {
      alert('Iltimos, baho va sharh kiriting!');
      return;
    }

    try {
      // Get current user from localStorage
      const userStr = localStorage.getItem('bookbites_user');
      if (!userStr) {
        alert('Sharh yozish uchun tizimga kiring!');
        return;
      }
      
      const currentUser = JSON.parse(userStr);

      const newReviewData = {
        book_id: book.id,
        user_id: currentUser.id,
        rating: userRating,
        comment: userReview,
        likes: 0
      };

      const savedReview = await reviewsService.create(newReviewData);
      
      // Reload reviews
      await loadReviews();
      
      setUserReview('');
      setUserRating(0);
      setShowReviewForm(false);
      alert('Sharh muvaffaqiyatli qo\'shildi!');
    } catch (error) {
      console.error('Sharh qo\'shishda xatolik:', error);
      alert('Sharh qo\'shishda xatolik yuz berdi: ' + error.message);
    }
  };

  const handleLikeReview = async (reviewId) => {
    try {
      const userStr = localStorage.getItem('bookbites_user');
      if (!userStr) {
        alert('Like bosish uchun tizimga kiring!');
        return;
      }
      
      const currentUser = JSON.parse(userStr);
      
      // Update likes count locally (optimistic update)
      setReviews(reviews.map(review => 
        review.id === reviewId 
          ? { ...review, likes: (review.likes || 0) + 1 }
          : review
      ));
      
      // Like in database
      await reviewsService.like(reviewId, currentUser.id);
    } catch (error) {
      console.error('Like qo\'shishda xatolik:', error);
      // Reload reviews to get correct state
      loadReviews();
    }
  };
  return (
    <div className="min-h-screen bg-secondary">
      {/* Navigation Arrows - Hidden on mobile */}
      <div className="hidden lg:flex fixed left-32 top-1/2 transform -translate-y-1/2 flex-col gap-4">
        <button className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all">
          <ArrowUp size={20} />
        </button>
        <button className="w-12 h-12 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-gray-50 transition-all">
          <ArrowDown size={20} />
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Left Column - Book Cover */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <div 
                className="w-64 sm:w-72 lg:w-80 h-96 sm:h-[420px] lg:h-[480px] rounded-2xl shadow-2xl overflow-hidden"
                style={{ backgroundColor: book.coverColor }}
              >
                {book.cover ? (
                  <img 
                    src={book.cover} 
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-6xl">
                    📚
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Book Info */}
          <div className="flex flex-col">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-gray-900 mb-4 leading-tight">
              {book.title}
            </h1>
            <p className="text-lg sm:text-xl text-gray-700 mb-6 lg:mb-8 font-medium">{book.author}</p>

            <p className="text-gray-600 leading-relaxed mb-8 italic">
              {book.description}
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 mb-12">
              <button 
                onClick={() => onStartReading && onStartReading(book)}
                className="bg-primary text-white px-8 py-4 rounded-full font-medium hover:bg-gray-800 transition-all flex items-center gap-2"
              >
                Start reading
                <span className="ml-2">↗</span>
              </button>
              
              {book.hasAudiobook ? (
                <button className="bg-primary text-white px-8 py-4 rounded-full font-medium hover:bg-gray-800 transition-all flex items-center gap-2">
                  Play Audio
                  <span className="ml-2">🎧</span>
                </button>
              ) : (
                <button className="bg-gray-300 text-gray-500 px-8 py-4 rounded-full font-medium cursor-not-allowed flex items-center gap-2" disabled>
                  Play Audio
                  <span className="ml-2">🎧</span>
                </button>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex gap-4 mb-12">
              <button className="w-12 h-12 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-all">
                <Bookmark size={20} />
              </button>
              <button className="w-12 h-12 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-all">
                <Share2 size={20} />
              </button>
              <button className="w-12 h-12 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-all">
                <Download size={20} />
              </button>
            </div>

            {/* Description Section */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Description</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                {book.fullDescription || book.description}
              </p>
              {book.fullDescription && (
                <p className="text-gray-700 leading-relaxed">
                  {book.fullDescription}
                </p>
              )}
            </div>

            {/* Audio Player - Show if audiobook is available */}
            {book.hasAudiobook && book.audioUrl && (
              <div className="mb-8">
                <AudioPlayer 
                  audioUrl={book.audioUrl}
                  bookTitle={book.title}
                />
              </div>
            )}

            {/* Reviews Section */}
            <div className="border-t border-gray-200 pt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  Sharhlar va Baholash ({reviews.length})
                </h2>
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-gray-800 transition-all"
                >
                  {showReviewForm ? 'Bekor qilish' : 'Sharh yozish'}
                </button>
              </div>

              {/* Overall Rating */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-gray-900 mb-2">
                      {book.rating || 4.5}
                    </div>
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={20}
                          className={i < Math.floor(book.rating || 4.5) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-600">{reviews.length} ta sharh</p>
                  </div>
                  
                  <div className="flex-1">
                    {[5, 4, 3, 2, 1].map((stars) => {
                      const count = reviews.filter(r => r.rating === stars).length;
                      const totalReviews = reviews.length || 1;
                      const percentage = (count / totalReviews) * 100;
                      return (
                        <div key={stars} className="flex items-center gap-3 mb-2">
                          <span className="text-sm text-gray-600 w-8">{stars} ⭐</span>
                          <div className="flex-1 bg-gray-200 rounded-full h-1.5 max-w-xs">
                            <div 
                              className="bg-yellow-400 h-1.5 rounded-full transition-all"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600 w-8 text-right">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Review Form */}
              {showReviewForm && (
                <form onSubmit={handleSubmitReview} className="bg-blue-50 rounded-xl p-6 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Sizning bahoyingiz</h3>
                  
                  {/* Star Rating */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-sm text-gray-600 mr-2">Baho:</span>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setUserRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          size={32}
                          className={
                            star <= (hoverRating || userRating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }
                        />
                      </button>
                    ))}
                    {userRating > 0 && (
                      <span className="ml-2 text-sm font-medium text-gray-700">
                        {userRating} / 5
                      </span>
                    )}
                  </div>

                  {/* Review Text */}
                  <textarea
                    value={userReview}
                    onChange={(e) => setUserReview(e.target.value)}
                    placeholder="Kitob haqida fikringizni yozing..."
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none resize-none"
                    required
                  />

                  <div className="flex gap-3 mt-4">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-gray-800 transition-all"
                    >
                      Sharhni yuborish
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(false)}
                      className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all"
                    >
                      Bekor qilish
                    </button>
                  </div>
                </form>
              )}

              {/* Reviews List */}
              {loading ? (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">⏳</div>
                  <p className="text-gray-600">Sharhlar yuklanmoqda...</p>
                </div>
              ) : reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review.id} className="bg-white rounded-xl p-6 shadow-sm">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-2xl flex-shrink-0">
                          {review.users?.avatar || '👤'}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <div className="font-semibold text-gray-900 mb-1">
                                {review.users?.name || 'Anonim'}
                              </div>
                              <div className="flex items-center gap-2 mb-2">
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      size={16}
                                      className={i < (review.rating || 5) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                                    />
                                  ))}
                                </div>
                                <span className="text-sm text-gray-500">
                                  {new Date(review.created_at).toLocaleDateString('uz-UZ')}
                                </span>
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-700 leading-relaxed mb-3">
                            {review.comment}
                          </p>
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => handleLikeReview(review.id)}
                              className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-all"
                            >
                              <ThumbsUp size={16} />
                              <span>Foydali ({review.likes || 0})</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-xl">
                  <div className="text-6xl mb-4">💭</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Hali sharhlar yo'q
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Birinchi bo'lib sharh yozing!
                  </p>
                  <button
                    onClick={() => setShowReviewForm(true)}
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-gray-800 transition-all"
                  >
                    Sharh yozish
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Info - Editors and Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mt-8 lg:mt-16">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Editors</h3>
            <p className="text-sm text-gray-600">{book.editors}</p>
          </div>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Language</h3>
              <p className="text-sm text-gray-600">{book.language}</p>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">Paperback</h3>
              <p className="text-sm text-gray-600">
                paper textured, full colour, {book.pageCount} pages
              </p>
              {book.isbn && (
                <p className="text-sm text-gray-600">ISBN: {book.isbn}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
