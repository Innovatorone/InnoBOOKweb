# Storage Usage Examples

Bu faylda Supabase Storage'dan qanday foydalanish ko'rsatilgan.

## 📂 Bucket tuzilishi

```
avatar/
  └── {user-id}/
      └── avatar-{timestamp}.jpg

bookImage/
  └── covers/
      └── {book-id}/
          └── cover-{timestamp}.jpg

audios/
  └── audiobooks/
      └── {book-id}/
          ├── audio-{timestamp}.mp3
          └── audio-chapter-{number}-{timestamp}.mp3
```

## 🔧 Import

```javascript
import {
  // URL olish
  getAvatarUrl,
  getBookImageUrl,
  getAudioUrl,
  
  // Yuklash
  uploadAvatar,
  uploadBookImage,
  uploadAudio,
  
  // O'chirish
  deleteAvatar,
  deleteBookImage,
  deleteAudio,
  
  // Ro'yxat
  listFiles
} from './src/lib/storage';
```

## 💡 Avatar yuklash

```javascript
// File input'dan
const handleAvatarUpload = async (event) => {
  const file = event.target.files[0];
  const userId = user.id;
  
  try {
    const { path, url } = await uploadAvatar(file, userId);
    
    // Update user profile
    await supabase
      .from('users')
      .update({ avatar: path })
      .eq('id', userId);
    
    console.log('Avatar uploaded:', url);
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

## 📚 Kitob muqovasi yuklash (Admin only)

```javascript
const handleBookCoverUpload = async (file, bookId) => {
  try {
    const { path, url } = await uploadBookImage(file, bookId);
    
    // Update book record
    await supabase
      .from('books')
      .update({ cover_url: path })
      .eq('id', bookId);
    
    console.log('Book cover uploaded:', url);
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

## 🎵 Audio yuklash (Admin only)

```javascript
const handleAudioUpload = async (file, bookId, chapterNumber) => {
  try {
    const { path, url } = await uploadAudio(file, bookId, chapterNumber);
    
    // Save audio reference
    await supabase
      .from('book_audio')
      .insert({
        book_id: bookId,
        chapter: chapterNumber,
        audio_url: path
      });
    
    console.log('Audio uploaded:', url);
  } catch (error) {
    console.error('Upload failed:', error);
  }
};
```

## 🔗 URL olish

```javascript
// User profile'dan
const user = await supabase
  .from('users')
  .select('avatar')
  .eq('id', userId)
  .single();

const avatarUrl = getAvatarUrl(user.data.avatar);
// → https://erojblujhdcahrhnfdgf.supabase.co/storage/v1/object/public/avatar/user-id/avatar.jpg

// Kitob muqovasi
const book = await supabase
  .from('books')
  .select('cover_url')
  .eq('id', bookId)
  .single();

const coverUrl = getBookImageUrl(book.data.cover_url);
// → https://erojblujhdcahrhnfdgf.supabase.co/storage/v1/object/public/bookImage/covers/book-id/cover.jpg
```

## 🗑️ Fayl o'chirish

```javascript
// Avatar o'chirish
await deleteAvatar('user-id/avatar-123456.jpg');

// Kitob muqovasi o'chirish
await deleteBookImage('covers/book-id/cover-123456.jpg');

// Audio o'chirish
await deleteAudio('audiobooks/book-id/audio-123456.mp3');
```

## 📋 Fayllar ro'yxati

```javascript
// User'ning barcha avatarlari
const avatars = await listFiles('avatar', 'user-id');

// Kitob muqovalari
const covers = await listFiles('bookImage', 'covers/book-id');

// Audiobook fayllari
const audios = await listFiles('audios', 'audiobooks/book-id');

console.log(avatars);
// [
//   { name: 'avatar-123456.jpg', created_at: '2026-01-18...' },
//   { name: 'avatar-789012.jpg', created_at: '2026-01-17...' }
// ]
```

## ⚙️ React Component Example

```jsx
import { useState } from 'react';
import { uploadAvatar, getAvatarUrl } from '../lib/storage';

function AvatarUploader({ userId, currentAvatar }) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(getAvatarUrl(currentAvatar));

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const { url } = await uploadAvatar(file, userId);
      setPreview(url);
      
      // Update backend
      // ...
      
    } catch (error) {
      alert('Upload xatosi: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <img src={preview} alt="Avatar" className="w-24 h-24 rounded-full" />
      <input
        type="file"
        accept="image/*"
        onChange={handleUpload}
        disabled={uploading}
      />
      {uploading && <p>Yuklanmoqda...</p>}
    </div>
  );
}
```

## 🔒 Security Notes

1. **Public Access**: Barcha bucketlar public read-ga ochiq
2. **Upload Permissions**:
   - `avatar`: Authenticated users (faqat o'z faylini)
   - `bookImage`: Admin only
   - `audios`: Admin only
3. **File Size**: Supabase default limit - 50MB per file
4. **Storage Limit**: Free plan - 1GB, Pro plan - 100GB

## 🎨 Best Practices

1. **Fayl nomi**: Har doim unique (timestamp yoki UUID)
2. **Path storage**: Database'da path saqla, URL emas
3. **Lazy loading**: URL'ni kerak bo'lganda generate qil
4. **Cache**: `cacheControl: '3600'` (1 soat)
5. **Upsert**: Avatar uchun `upsert: true`, audio uchun `false`
