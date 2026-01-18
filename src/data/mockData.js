export const mockData = {
  currentUser: {
    name: "Alexander Mark",
    avatar: "👤",
    currentReading: {
      bookId: 1,
      progress: 154,
      totalPages: 300,
      chapter: "Chapter Five: Diagon Alley"
    }
  },

  books: [
    {
      id: 1,
      title: "Harry Potter: Half Blood Prince",
      author: "JK Rowling",
      cover: "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400",
      coverColor: "#1a4d2e",
      description: "The story takes place during Harry's sixth year at Hogwarts School of Witchcraft and Wizardry, where he discovers more about Lord Voldemort's past and the prophecy that foretells his defeat.",
      fullDescription: "With action-packed sequences, shocking twists, and moments of heart-wrenching tragedy, 'Half-Blood Prince' is a must-read for any fan of the Harry Potter series.",
      language: "Standard English (USA & UK)",
      format: "Paperback",
      pageCount: 300,
      isbn: "987 3 32564 435 B",
      editors: "J.K. Rowling (author), Christopher Reath, Alena Gestahon, Steve Korg",
      currentPage: 154,
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      audioDuration: "4:52:30",
      hasAudiobook: true,
      reviews: [
        {
          id: 1,
          user: "Roberto Jordan",
          avatar: "👨",
          rating: 5,
          comment: "What a delightful and magical book it is! It indeed transports readers to the wizarding world.",
          date: "2 days ago",
          likes: 12
        }
      ]
    },
    {
      id: 2,
      title: "The Cambers of Secrets",
      author: "JK Rowling",
      cover: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400",
      coverColor: "#2d5016",
      description: "Harry as he returns to Hogwarts school of witchcraft and wizardry for his 2nd year, only to discover that...",
      pageCount: 300,
      currentPage: 154,
      language: "Standard English (USA & UK)",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      audioDuration: "3:45:20",
      hasAudiobook: true
    },
    {
      id: 3,
      title: "Beauty and the Beast: Disney",
      author: "Disney",
      cover: "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400",
      coverColor: "#1e3a5f",
      description: "A tale as old as time about beauty, love, and looking beyond appearances.",
      pageCount: 256,
      language: "Standard English",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      audioDuration: "2:15:45",
      hasAudiobook: true
    },
    {
      id: 4,
      title: "Fire and Blood - A Game of Thrones series",
      author: "George RR Martin",
      cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400",
      coverColor: "#8b0000",
      description: "Fire and Blood tells the story of the Targaryen dynasty in Westeros, chronicling the conquest of the Seven Kingdoms by House Targaryen.",
      pageCount: 736,
      language: "Standard English",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
      audioDuration: "6:20:15",
      hasAudiobook: true,
      isPremium: true,
      requiredPlan: "PRO"
    },
    {
      id: 5,
      title: "The Chronicles of Narnia",
      author: "C.S. Lewis",
      cover: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=400",
      coverColor: "#1a3a52",
      description: "A magical journey through a wardrobe into a land of eternal winter.",
      pageCount: 768,
      language: "Standard English",
      isPremium: true,
      requiredPlan: "VIP"
    },
    {
      id: 6,
      title: "Deadpool Samurai edition: Marvel",
      author: "Marvel",
      cover: "https://images.unsplash.com/photo-1612036782180-6f0b6cd846fe?w=400",
      coverColor: "#dc143c",
      description: "The merc with a mouth goes to Japan in this action-packed adventure.",
      pageCount: 192,
      language: "Standard English"
    },
    {
      id: 7,
      title: "The World of Ice and Fire",
      author: "George R.R. Martin",
      cover: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=400",
      coverColor: "#8b4513",
      description: "The comprehensive history of the Seven Kingdoms.",
      pageCount: 336,
      language: "Standard English"
    },
    {
      id: 8,
      title: "Fantastic Beasts Volume II",
      author: "J.K. Rowling",
      cover: "https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400",
      coverColor: "#2f4f4f",
      description: "An exploration of magical creatures in the wizarding world.",
      pageCount: 288,
      language: "Standard English"
    },
    {
      id: 9,
      title: "Game of Thrones Volume III",
      author: "George R.R. Martin",
      cover: "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400",
      coverColor: "#4169e1",
      description: "A Storm of Swords continues the epic saga of Westeros.",
      pageCount: 992,
      language: "Standard English"
    },
    {
      id: 10,
      title: "The Wise Man's Fear",
      author: "Patrick Rothfuss",
      cover: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400",
      coverColor: "#228b22",
      description: "The second book in the Kingkiller Chronicle series.",
      pageCount: 994,
      language: "Standard English"
    }
  ],

  collections: [
    {
      id: 1,
      title: "A Legend of Ice and Fire: The Ice Horse",
      volumes: 2,
      chaptersPerVolume: 8,
      cover: "https://images.unsplash.com/photo-1621351183012-e2f9972dd9bf?w=400"
    }
  ],

  friends: [
    {
      id: 1,
      name: "Aziza Karimova",
      avatar: "👩",
      booksRead: 24,
      currentBook: "Atomic Habits",
      streak: 7,
      lastActivity: {
        type: "comment",
        chapter: "Chapter 5: The Best Way to Start",
        timestamp: "2 daqiqa oldin",
        comment: "Juda foydali maslahatlar! Har kuni bitta kichik odat qo'shish kerak ekan."
      }
    },
    {
      id: 2,
      name: "Sardor Alimov",
      avatar: "👨",
      booksRead: 18,
      currentBook: "Sapiens",
      streak: 12,
      lastActivity: {
        type: "reading",
        text: "The Psychology of Money kitobini tugatdi",
        timestamp: "15 daqiqa oldin",
        badge: "🏆"
      }
    },
    {
      id: 3,
      name: "Malika Rashidova",
      avatar: "👩‍💼",
      booksRead: 32,
      currentBook: "Deep Work",
      streak: 21,
      lastActivity: {
        type: "achievement",
        text: "21 kunlik o'qish seriyasini boshladi!",
        timestamp: "1 soat oldin",
        badge: "🔥"
      }
    },
    {
      id: 4,
      name: "Bobur Tursunov",
      avatar: "👨‍💻",
      booksRead: 15,
      currentBook: "The Lean Startup",
      streak: 5,
      lastActivity: {
        type: "review",
        text: "Zero to One kitobiga 5 yulduz berdi",
        timestamp: "3 soat oldin",
        badge: "⭐"
      }
    },
    {
      id: 5,
      name: "Nilufar Safarova",
      avatar: "👩‍🎓",
      booksRead: 41,
      currentBook: "Thinking Fast and Slow",
      streak: 30,
      lastActivity: {
        type: "milestone",
        text: "40-kitobni o'qib tugatdi!",
        timestamp: "5 soat oldin",
        badge: "🎯"
      }
    },
    {
      id: 6,
      name: "Jasur Rahmonov",
      avatar: "👨‍🏫",
      booksRead: 28,
      currentBook: "The Alchemist",
      streak: 14,
      lastActivity: {
        type: "reading",
        text: "Man's Search for Meaning-ni o'qiyapti",
        timestamp: "Bugun 08:30",
        badge: "📖"
      }
    }
  ],

  schedule: [
    { day: "Sun", date: 11 },
    { day: "Mon", date: 12 },
    { day: "Tue", date: 13 },
    { day: "Wed", date: 14 },
    { day: "Thu", date: 15 },
    { day: "Fri", date: 16 },
    { day: "Sat", date: 17 }
  ],

  authors: [
    {
      id: 1,
      name: "George RR Martin",
      avatar: "👨‍🦳",
      title: "author",
      quote: "Fire and Blood tells the story of the Targaryen dynasty in Westeros, chronicling the conquest of the Seven Kingdoms by House Targaryen. It also covers the Targaryen civil war known as the Dance of the Dragons."
    }
  ]
};
