/**
 * Supabase Storage Helper Functions
 * Avatar, Book Images, Audio Files uchun
 */

import { supabase } from './supabase';

// =====================================================
// Storage URLs
// =====================================================

/**
 * Get public URL for an avatar
 * @param {string} path - Avatar file path (e.g., "user-id/avatar.jpg")
 * @returns {string} Public URL
 */
export const getAvatarUrl = (path) => {
  if (!path) return null;
  
  // If already a full URL, return as is
  if (path.startsWith('http')) return path;
  
  // If emoji or short string, return as is
  if (path.length < 10) return path;
  
  const { data } = supabase.storage
    .from('avatar')
    .getPublicUrl(path);
  
  return data.publicUrl;
};

/**
 * Get public URL for a book cover image
 * @param {string} path - Book image path (e.g., "covers/book-id.jpg")
 * @returns {string} Public URL
 */
export const getBookImageUrl = (path) => {
  if (!path) return null;
  
  // If already a full URL, return as is
  if (path.startsWith('http')) return path;
  
  const { data } = supabase.storage
    .from('bookImage')
    .getPublicUrl(path);
  
  return data.publicUrl;
};

/**
 * Get public URL for an audio file
 * @param {string} path - Audio file path (e.g., "audiobooks/book-id.mp3")
 * @returns {string} Public URL
 */
export const getAudioUrl = (path) => {
  if (!path) return null;

  // If already a full URL, return as is
  if (path.startsWith('http')) return path;

  const { data } = supabase.storage
    .from('audios')
    .getPublicUrl(path);

  return data.publicUrl;
};

/**
 * Get public URL for a book file (PDF, EPUB, MOBI)
 * @param {string} path - Book file path (e.g., "books/book-id.pdf")
 * @returns {string} Public URL
 */
export const getBookFileUrl = (path) => {
  if (!path) return null;

  // If already a full URL, return as is
  if (path.startsWith('http')) return path;

  const { data } = supabase.storage
    .from('books')
    .getPublicUrl(path);

  return data.publicUrl;
};

// =====================================================
// Upload Functions
// =====================================================

/**
 * Upload avatar image
 * @param {File} file - Image file
 * @param {string} userId - User ID
 * @returns {Promise<{path: string, url: string}>}
 */
export const uploadAvatar = async (file, userId) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/avatar-${Date.now()}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from('avatar')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true
    });
  
  if (error) throw error;
  
  return {
    path: data.path,
    url: getAvatarUrl(data.path)
  };
};

/**
 * Upload book cover image
 * @param {File} file - Image file
 * @param {string} bookId - Book ID
 * @returns {Promise<{path: string, url: string}>}
 */
export const uploadBookImage = async (file, bookId) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `covers/${bookId}/cover-${Date.now()}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from('bookImage')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true
    });
  
  if (error) throw error;
  
  return {
    path: data.path,
    url: getBookImageUrl(data.path)
  };
};

/**
 * Upload audio file
 * @param {File} file - Audio file
 * @param {string} bookId - Book ID
 * @param {number} chapterNumber - Chapter number (optional)
 * @returns {Promise<{path: string, url: string}>}
 */
export const uploadAudio = async (file, bookId, chapterNumber = null) => {
  const fileExt = file.name.split('.').pop();
  const chapter = chapterNumber ? `-chapter-${chapterNumber}` : '';
  const fileName = `audiobooks/${bookId}/audio${chapter}-${Date.now()}.${fileExt}`;
  
  const { data, error } = await supabase.storage
    .from('audios')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });
  
  if (error) throw error;
  
  return {
    path: data.path,
    url: getAudioUrl(data.path)
  };
};

/**
 * Upload book file (PDF, EPUB, MOBI)
 * @param {File} file - Book file
 * @param {string} bookId - Book ID
 * @returns {Promise<{path: string, url: string}>}
 */
export const uploadBookFile = async (file, bookId) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${bookId}/book-${Date.now()}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('books') // Using 'books' bucket for book files
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true
    });

  if (error) throw error;

  return {
    path: data.path,
    url: getBookFileUrl(data.path) // Will return public URL from books bucket
  };
};

// =====================================================
// Delete Functions
// =====================================================

/**
 * Delete avatar image
 * @param {string} path - File path
 */
export const deleteAvatar = async (path) => {
  const { error } = await supabase.storage
    .from('avatar')
    .remove([path]);
  
  if (error) throw error;
};

/**
 * Delete book image
 * @param {string} path - File path
 */
export const deleteBookImage = async (path) => {
  const { error } = await supabase.storage
    .from('bookImage')
    .remove([path]);
  
  if (error) throw error;
};

/**
 * Delete audio file
 * @param {string} path - File path
 */
export const deleteAudio = async (path) => {
  const { error } = await supabase.storage
    .from('audios')
    .remove([path]);
  
  if (error) throw error;
};

// =====================================================
// List Functions
// =====================================================

/**
 * List all files in a bucket folder
 * @param {string} bucket - Bucket name ('avatar', 'bookImage', 'audios')
 * @param {string} folder - Folder path
 */
export const listFiles = async (bucket, folder = '') => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .list(folder, {
      limit: 100,
      offset: 0,
      sortBy: { column: 'created_at', order: 'desc' }
    });
  
  if (error) throw error;
  return data;
};

/**
 * Delete book file
 * @param {string} path - File path
 */
export const deleteBookFile = async (path) => {
  const { error } = await supabase.storage
    .from('books')
    .remove([path]);

  if (error) throw error;
};

export default {
  getAvatarUrl,
  getBookImageUrl,
  getAudioUrl,
  getBookFileUrl,
  uploadAvatar,
  uploadBookImage,
  uploadAudio,
  uploadBookFile,
  deleteAvatar,
  deleteBookImage,
  deleteAudio,
  deleteBookFile,
  listFiles
};
