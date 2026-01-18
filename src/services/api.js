import { supabase } from '../lib/supabase';

// =====================================================
// BOOKS SERVICE
// =====================================================

export const booksService = {
  // Barcha kitoblarni olish
  async getAll() {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .order('rating', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // ID bo'yicha kitobni olish
  async getById(id) {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  // Kategoriya bo'yicha kitoblar
  async getByCategory(category) {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('category', category)
      .order('rating', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Qidiruv
  async search(query) {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .or(`title.ilike.%${query}%,author.ilike.%${query}%,category.ilike.%${query}%`)
      .order('rating', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Premium kitoblar
  async getPremium(plan = 'PRO') {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('is_premium', true)
      .eq('required_plan', plan)
      .order('rating', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Audiobook'lar
  async getAudiobooks() {
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .eq('has_audiobook', true)
      .order('rating', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Yangi kitob qo'shish (Admin only)
  async create(bookData) {
    const { data, error } = await supabase
      .from('books')
      .insert([bookData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Kitobni yangilash (Admin only)
  async update(id, bookData) {
    const { data, error } = await supabase
      .from('books')
      .update(bookData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Kitobni o'chirish (Admin only)
  async delete(id) {
    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// =====================================================
// REVIEWS SERVICE
// =====================================================

export const reviewsService = {
  // Kitob sharhlarini olish
  async getByBook(bookId) {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        *,
        users (name, avatar)
      `)
      .eq('book_id', bookId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Sharh qo'shish
  async create(reviewData) {
    const { data, error } = await supabase
      .from('reviews')
      .insert([reviewData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Sharhni yangilash
  async update(id, reviewData) {
    const { data, error } = await supabase
      .from('reviews')
      .update(reviewData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Sharhni o'chirish
  async delete(id) {
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  },

  // Sharhga like bosish
  async like(reviewId, userId) {
    const { error } = await supabase
      .from('review_likes')
      .insert([{ review_id: reviewId, user_id: userId }]);
    
    if (error) throw error;
  },

  // Like'ni olib tashlash
  async unlike(reviewId, userId) {
    const { error } = await supabase
      .from('review_likes')
      .delete()
      .eq('review_id', reviewId)
      .eq('user_id', userId);
    
    if (error) throw error;
  }
};

// =====================================================
// USER READING PROGRESS SERVICE
// =====================================================

export const readingProgressService = {
  // Foydalanuvchining o'qish progressini olish
  async getByUser(userId) {
    const { data, error } = await supabase
      .from('user_reading_progress')
      .select(`
        *,
        books (*)
      `)
      .eq('user_id', userId)
      .order('last_read_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Bitta kitob uchun progress
  async getByUserAndBook(userId, bookId) {
    const { data, error } = await supabase
      .from('user_reading_progress')
      .select('*')
      .eq('user_id', userId)
      .eq('book_id', bookId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 = not found
    return data;
  },

  // Progress yangilash
  async upsert(progressData) {
    const { data, error } = await supabase
      .from('user_reading_progress')
      .upsert([progressData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // O'qishni boshlash
  async startReading(userId, bookId) {
    return this.upsert({
      user_id: userId,
      book_id: bookId,
      current_page: 0,
      progress_percentage: 0,
      status: 'reading',
      started_at: new Date().toISOString()
    });
  },

  // Kitobni tugatish
  async completeBook(userId, bookId, readingTimeMinutes) {
    return this.upsert({
      user_id: userId,
      book_id: bookId,
      status: 'completed',
      progress_percentage: 100,
      completed_at: new Date().toISOString(),
      reading_time_minutes: readingTimeMinutes
    });
  }
};

// =====================================================
// BOOKMARKS SERVICE
// =====================================================

export const bookmarksService = {
  // Foydalanuvchi bookmark'larini olish
  async getByUser(userId) {
    const { data, error } = await supabase
      .from('bookmarks')
      .select(`
        *,
        books (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Bookmark qo'shish
  async add(userId, bookId) {
    const { data, error } = await supabase
      .from('bookmarks')
      .insert([{ user_id: userId, book_id: bookId }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Bookmark olib tashlash
  async remove(userId, bookId) {
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('user_id', userId)
      .eq('book_id', bookId);
    
    if (error) throw error;
  },

  // Bookmark borligini tekshirish
  async check(userId, bookId) {
    const { data, error } = await supabase
      .from('bookmarks')
      .select('id')
      .eq('user_id', userId)
      .eq('book_id', bookId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return !!data;
  },

  // Toggle bookmark
  async toggle(userId, bookId) {
    const exists = await this.check(userId, bookId);
    if (exists) {
      await this.remove(userId, bookId);
      return false;
    } else {
      await this.add(userId, bookId);
      return true;
    }
  }
};

// =====================================================
// READER BOOKMARKS SERVICE
// Kitob ichidagi sahifa bookmark'lari
// =====================================================

export const readerBookmarksService = {
  // Kitob ichidagi bookmark'larni olish
  async getByBook(userId, bookId) {
    const { data, error } = await supabase
      .from('reader_bookmarks')
      .select('*')
      .eq('user_id', userId)
      .eq('book_id', bookId)
      .order('page_number', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  // Sahifa bookmark qo'shish
  async add(userId, bookId, pageNumber, note = null) {
    const { data, error } = await supabase
      .from('reader_bookmarks')
      .insert([{ user_id: userId, book_id: bookId, page_number: pageNumber, note }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Bookmark olib tashlash
  async remove(userId, bookId, pageNumber) {
    const { error } = await supabase
      .from('reader_bookmarks')
      .delete()
      .eq('user_id', userId)
      .eq('book_id', bookId)
      .eq('page_number', pageNumber);
    
    if (error) throw error;
  },

  // Toggle bookmark
  async toggle(userId, bookId, pageNumber, note = null) {
    const { data: existing } = await supabase
      .from('reader_bookmarks')
      .select('id')
      .eq('user_id', userId)
      .eq('book_id', bookId)
      .eq('page_number', pageNumber)
      .single();
    
    if (existing) {
      await this.remove(userId, bookId, pageNumber);
      return false;
    } else {
      await this.add(userId, bookId, pageNumber, note);
      return true;
    }
  }
};

// =====================================================
// USER STATISTICS SERVICE
// =====================================================

export const statisticsService = {
  // Foydalanuvchi statistikasini olish
  async getByUser(userId) {
    const { data, error } = await supabase
      .from('user_statistics')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  // Statistika yaratish (agar yo'q bo'lsa)
  async initialize(userId) {
    const { data, error } = await supabase
      .from('user_statistics')
      .insert([{ user_id: userId }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// =====================================================
// BADGES SERVICE
// =====================================================

export const badgesService = {
  // Barcha badge'larni olish
  async getAll() {
    const { data, error } = await supabase
      .from('badges')
      .select('*')
      .order('requirement_value', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  // Foydalanuvchi badge'larini olish
  async getByUser(userId) {
    const { data, error } = await supabase
      .from('user_badges')
      .select(`
        *,
        badges (*)
      `)
      .eq('user_id', userId)
      .order('earned_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Badge berish
  async award(userId, badgeId) {
    const { data, error } = await supabase
      .from('user_badges')
      .insert([{ user_id: userId, badge_id: badgeId }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Badge progress hisoblash
  async getProgress(userId) {
    const stats = await statisticsService.getByUser(userId);
    const badges = await this.getAll();
    const userBadges = await this.getByUser(userId);
    
    const earnedBadgeIds = userBadges.map(ub => ub.badge_id);
    
    return badges.map(badge => {
      let currentValue = 0;
      
      switch (badge.requirement_type) {
        case 'books_read':
          currentValue = stats?.books_read || 0;
          break;
        case 'reviews_written':
          currentValue = stats?.reviews_written || 0;
          break;
        case 'reading_streak':
          currentValue = stats?.reading_streak_days || 0;
          break;
        default:
          currentValue = 0;
      }
      
      const progress = Math.min((currentValue / badge.requirement_value) * 100, 100);
      const unlocked = earnedBadgeIds.includes(badge.id);
      
      return {
        ...badge,
        currentValue,
        progress: Math.round(progress),
        unlocked
      };
    });
  }
};

// =====================================================
// AUTHORS SERVICE
// =====================================================

export const authorsService = {
  // Barcha mualliflar
  async getAll() {
    const { data, error } = await supabase
      .from('authors')
      .select('*')
      .order('name', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  // ID bo'yicha muallif
  async getById(id) {
    const { data, error } = await supabase
      .from('authors')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  }
};

// =====================================================
// FRIENDS SERVICE
// =====================================================

export const friendsService = {
  // Do'stlar ro'yxati
  async getByUser(userId) {
    const { data, error } = await supabase
      .from('friends')
      .select(`
        *,
        friend:users!friends_friend_id_fkey (id, name, avatar, plan)
      `)
      .eq('user_id', userId)
      .eq('status', 'accepted')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Do'stlik so'rovi yuborish
  async sendRequest(userId, friendId) {
    const { data, error } = await supabase
      .from('friends')
      .insert([{ user_id: userId, friend_id: friendId, status: 'pending' }])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Do'stlik so'rovini qabul qilish
  async acceptRequest(friendshipId) {
    const { data, error } = await supabase
      .from('friends')
      .update({ status: 'accepted' })
      .eq('id', friendshipId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Do'stlikni bekor qilish
  async remove(userId, friendId) {
    const { error } = await supabase
      .from('friends')
      .delete()
      .or(`and(user_id.eq.${userId},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${userId})`);
    
    if (error) throw error;
  }
};

// =====================================================
// ACTIVITIES SERVICE
// =====================================================

export const activitiesService = {
  // Foydalanuvchi va do'stlar faoliyati
  async getTimeline(userId) {
    const { data, error } = await supabase
      .from('user_activities')
      .select(`
        *,
        users (name, avatar),
        books (title, author)
      `)
      .or(`user_id.eq.${userId}`)
      .order('created_at', { ascending: false })
      .limit(50);
    
    if (error) throw error;
    return data;
  },

  // Faoliyat qo'shish
  async create(activityData) {
    const { data, error } = await supabase
      .from('user_activities')
      .insert([activityData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }
};

// =====================================================
// COLLECTIONS SERVICE
// =====================================================

export const collectionsService = {
  // Barcha kolleksiyalar
  async getAll() {
    const { data, error } = await supabase
      .from('collections')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Kolleksiya kitoblarini olish
  async getBooks(collectionId) {
    const { data, error } = await supabase
      .from('collection_books')
      .select(`
        *,
        books (*)
      `)
      .eq('collection_id', collectionId)
      .order('order_index', { ascending: true });
    
    if (error) throw error;
    return data;
  }
};

// =====================================================
// USERS SERVICE (Admin)
// =====================================================

export const usersService = {
  // Barcha foydalanuvchilarni olish
  async getAll() {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  // Foydalanuvchi statistikasini olish
  async getStats(userId) {
    // O'qilgan kitoblar soni
    const { count: booksRead } = await supabase
      .from('user_reading_progress')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('status', 'completed');

    // Jami sahifalar
    const { data: progressData } = await supabase
      .from('user_reading_progress')
      .select('current_page')
      .eq('user_id', userId);

    const totalPages = progressData?.reduce((sum, p) => sum + (p.current_page || 0), 0) || 0;

    // Sharhlar soni
    const { count: reviewsCount } = await supabase
      .from('reviews')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    // O'rtacha reyting
    const { data: ratingsData } = await supabase
      .from('reviews')
      .select('rating')
      .eq('user_id', userId);

    const averageRating = ratingsData?.length 
      ? ratingsData.reduce((sum, r) => sum + r.rating, 0) / ratingsData.length 
      : 0;

    return {
      booksRead: booksRead || 0,
      totalPages,
      reviewsCount: reviewsCount || 0,
      averageRating: averageRating.toFixed(1)
    };
  },

  // Foydalanuvchi tarifini o'zgartirish
  async updatePlan(userId, plan) {
    const { data, error } = await supabase
      .from('users')
      .update({ plan })
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Foydalanuvchini o'chirish
  async delete(userId) {
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);
    
    if (error) throw error;
  }
};

// =====================================================
// ADMIN STATISTICS SERVICE
// =====================================================

export const adminStatsService = {
  // Umumiy statistika
  async getOverview() {
    // Foydalanuvchilar soni
    const { count: totalUsers } = await supabase
      .from('users')
      .select('*', { count: 'exact', head: true });

    // Tariflar bo'yicha
    const { data: usersData } = await supabase
      .from('users')
      .select('plan');

    const freeUsers = usersData?.filter(u => u.plan === 'FREE').length || 0;
    const proUsers = usersData?.filter(u => u.plan === 'PRO').length || 0;
    const vipUsers = usersData?.filter(u => u.plan === 'VIP').length || 0;

    // Kitoblar soni
    const { count: totalBooks } = await supabase
      .from('books')
      .select('*', { count: 'exact', head: true });

    const { count: premiumBooks } = await supabase
      .from('books')
      .select('*', { count: 'exact', head: true })
      .eq('is_premium', true);

    const freeBooks = (totalBooks || 0) - (premiumBooks || 0);

    return {
      totalUsers: totalUsers || 0,
      freeUsers,
      proUsers,
      vipUsers,
      totalBooks: totalBooks || 0,
      premiumBooks: premiumBooks || 0,
      freeBooks
    };
  }
};

// =====================================================
// SUBSCRIPTION PLANS SERVICE
// =====================================================

export const plansService = {
  // Barcha tariflarni olish
  async getAll() {
    const { data, error } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  // Yangi tarif qo'shish
  async create(planData) {
    const { data, error } = await supabase
      .from('subscription_plans')
      .insert([planData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Tarifni yangilash
  async update(id, planData) {
    const { data, error } = await supabase
      .from('subscription_plans')
      .update(planData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Tarifni o'chirish
  async delete(id) {
    const { error } = await supabase
      .from('subscription_plans')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// =====================================================
// CATEGORIES SERVICE
// =====================================================

export const categoriesService = {
  // Barcha kategoriyalarni olish
  async getAll() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  // Yangi kategoriya qo'shish
  async create(categoryData) {
    const { data, error } = await supabase
      .from('categories')
      .insert([categoryData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Kategoriyani yangilash
  async update(id, categoryData) {
    const { data, error } = await supabase
      .from('categories')
      .update(categoryData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Kategoriyani o'chirish
  async delete(id) {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};


