// import { Client, Databases, Storage, ID, Account } from 'appwrite';
// import conf from '../../conf/conf';

// class BookService {
//   constructor() {
//     this.client = new Client()
//       .setEndpoint(conf.appwriteUrl)
//       .setProject(conf.appwriteProjectId);

//     this.databases = new Databases(this.client);
//     this.storage = new Storage(this.client);
//     this.account = new Account(this.client);

//     this.databaseId = conf.appwriteDatabaseId;
//     this.collectionId = conf.appwriteCollectionId;
//     this.bucketId = conf.appwriteBucketId;
//   }

//   /* =========================
//      HELPERS
//   ========================= */

//   getCoverImageUrl(fileId) {
//     if (!fileId) return null;

//     return this.storage.getFileView(
//       this.bucketId,
//       fileId
//     );
//   }

//   getPdfUrl(fileId) {
//     if (!fileId) return null;

//     return this.storage.getFileView(
//       this.bucketId,
//       fileId
//     );
//   }

//   addUrlsToBook(book) {
//     if (!book) return book;

//     return {
//       ...book,
//       coverImageUrl: this.getCoverImageUrl(book.coverImageId),
//       pdfUrl: this.getPdfUrl(book.pdfFileId),
//     };
//   }

//   /* =========================
//      UPLOADS
//   ========================= */

//   async uploadFile(file) {
//     const fileId = ID.unique();

//     await this.storage.createFile(
//       this.bucketId,
//       fileId,
//       file
//     );

//     return fileId;
//   }

//   /* =========================
//      CRUD
//   ========================= */

//   async createBook(bookData, pdfFile, coverFile = null) {
//     const pdfFileId = await this.uploadFile(pdfFile);
//     let coverImageId = null;

//     if(bookData.coverImageId) {
//       coverImageId = bookData.coverImageId;
//     }else if (coverFile) {
//       coverImageId = await this.uploadFile(coverFile);
//     }

//     const newBook = await this.databases.createDocument(
//       this.databaseId,
//       this.collectionId,
//       ID.unique(),
//       {
//         title: bookData.title || '',
//         author: bookData.author || '',
//         description: bookData.description || '',
//         status: bookData.status || 'want-to-read',
//         pagesRead: String(bookData.pagesRead || '0'),
//         totalPages: String(bookData.totalPages || '0'),
//         rating: Number(bookData.rating || 0),
//         pdfFileId,
//         coverImageId,
//         lastReadPage: 0,
//       }
//     );

//     return this.addUrlsToBook(newBook);
//   }

//   async getUserBooks() {
//     const response = await this.databases.listDocuments(
//       this.databaseId,
//       this.collectionId
//     );

//     return {
//       ...response,
//       documents: response.documents.map(book =>
//         this.addUrlsToBook(book)
//       ),
//     };
//   }

//   async updateBook(bookId, updates) {
//     const updated = await this.databases.updateDocument(
//       this.databaseId,
//       this.collectionId,
//       bookId,
//       updates
//     );

//     return this.addUrlsToBook(updated);
//   }

//   async updateCoverImage(bookId, coverFile) {
//     const coverImageId = await this.uploadFile(coverFile);

//     const updated = await this.databases.updateDocument(
//       this.databaseId,
//       this.collectionId,
//       bookId,
//       { coverImageId }
//     );

//     return this.addUrlsToBook(updated);
//   }

//   async deleteBook(bookId) {
//     const book = await this.databases.getDocument(
//       this.databaseId,
//       this.collectionId,
//       bookId
//     );

//     if (book.pdfFileId) {
//       await this.storage.deleteFile(this.bucketId, book.pdfFileId);
//     }

//     if (book.coverImageId) {
//       await this.storage.deleteFile(this.bucketId, book.coverImageId);
//     }

//     return this.databases.deleteDocument(
//       this.databaseId,
//       this.collectionId,
//       bookId
//     );
//   }
// }

// export default new BookService();

import { Client, Databases, Storage, ID, Query, Account } from 'appwrite';
import conf from '../../conf/conf';

class BookService {
  constructor() {
    this.client = new Client()
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);

    this.databases = new Databases(this.client);
    this.storage = new Storage(this.client);
    this.account = new Account(this.client);

    this.databaseId = conf.appwriteDatabaseId;
    this.collectionId = conf.appwriteCollectionId;
    this.bucketId = conf.appwriteBucketId;
  }

  /* =========================
     HELPERS
  ========================= */

  getCoverImageUrl(fileId) {
    if (!fileId) return null;

    return this.storage.getFileView(
      this.bucketId,
      fileId
    );
  }

  getPdfUrl(fileId) {
    if (!fileId) return null;

    return this.storage.getFileView(
      this.bucketId,
      fileId
    );
  }

  addUrlsToBook(book) {
    if (!book) return book;

    return {
      ...book,
      coverImageUrl: this.getCoverImageUrl(book.coverImageId),
      pdfUrl: this.getPdfUrl(book.pdfFileId),
    };
  }

  /* =========================
     UPLOADS
  ========================= */

  async uploadFile(file, type = 'pdf') {
    // Validate file type
    if (type === 'pdf' && file.type !== 'application/pdf') {
      throw new Error('File must be a PDF');
    }
    
    if (type === 'image' && !file.type.startsWith('image/')) {
      throw new Error('File must be an image');
    }

    const fileId = ID.unique();

    await this.storage.createFile(
      this.bucketId,
      fileId,
      file
    );

    return fileId;
  }

  async uploadPdf(file) {
    return this.uploadFile(file, 'pdf');
  }

  async uploadCoverImage(file) {
    return this.uploadFile(file, 'image');
  }

  /* =========================
     PUBLIC BOOK METHODS
  ========================= */

  // Get all public books (for homepage)
  async getPublicBooks() {
    const response = await this.databases.listDocuments(
      this.databaseId,
      this.collectionId,
      [
        Query.equal('isPublic', true) // Filter for public books
      ]
    );

    return {
      ...response,
      documents: response.documents.map(book =>
        this.addUrlsToBook(book)
      ),
    };
  }

  // Get public and user's books combined
  async getAllBooks() {
    const response = await this.databases.listDocuments(
      this.databaseId,
      this.collectionId
    );

    return {
      ...response,
      documents: response.documents.map(book =>
        this.addUrlsToBook(book)
      ),
    };
  }

  /* =========================
     CRUD OPERATIONS
  ========================= */

  async createBook(bookData, pdfFile, coverFile = null) {
    const pdfFileId = await this.uploadPdf(pdfFile);
    let coverImageId = null;

    if (bookData.coverImageId) {
      coverImageId = bookData.coverImageId;
    } else if (coverFile) {
      coverImageId = await this.uploadCoverImage(coverFile);
    }

    // Prepare book data with all fields including isPublic
    const bookDocumentData = {
      title: bookData.title || '',
      author: bookData.author || '',
      description: bookData.description || '',
      status: bookData.status || 'want-to-read',
      pagesRead: String(bookData.pagesRead || '0'),
      totalPages: String(bookData.totalPages || '0'),
      rating: Number(bookData.rating || 0),
      pdfFileId,
      coverImageId,
      lastReadPage: 0,
      isPublic: bookData.isPublic !== undefined ? Boolean(bookData.isPublic) : true, // Default to public
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const newBook = await this.databases.createDocument(
      this.databaseId,
      this.collectionId,
      ID.unique(),
      bookDocumentData
    );

    return this.addUrlsToBook(newBook);
  }

  async getUserBooks() {
    const response = await this.databases.listDocuments(
      this.databaseId,
      this.collectionId
    );

    return {
      ...response,
      documents: response.documents.map(book =>
        this.addUrlsToBook(book)
      ),
    };
  }

  async updateBook(bookId, updates) {
    // Ensure isPublic is boolean if provided
    if (updates.isPublic !== undefined) {
      updates.isPublic = Boolean(updates.isPublic);
    }

    // Add update timestamp
    updates.updatedAt = new Date().toISOString();

    const updated = await this.databases.updateDocument(
      this.databaseId,
      this.collectionId,
      bookId,
      updates
    );

    return this.addUrlsToBook(updated);
  }

  async updateCoverImage(bookId, coverFile) {
    const coverImageId = await this.uploadCoverImage(coverFile);

    const updated = await this.databases.updateDocument(
      this.databaseId,
      this.collectionId,
      bookId,
      { 
        coverImageId,
        updatedAt: new Date().toISOString()
      }
    );

    return this.addUrlsToBook(updated);
  }

  async deleteBook(bookId) {
    const book = await this.databases.getDocument(
      this.databaseId,
      this.collectionId,
      bookId
    );

    if (book.pdfFileId) {
      await this.storage.deleteFile(this.bucketId, book.pdfFileId);
    }

    if (book.coverImageId) {
      await this.storage.deleteFile(this.bucketId, book.coverImageId);
    }

    return this.databases.deleteDocument(
      this.databaseId,
      this.collectionId,
      bookId
    );
  }

  /* =========================
     ADDITIONAL METHODS
  ========================= */

  async getBookById(bookId) {
    const book = await this.databases.getDocument(
      this.databaseId,
      this.collectionId,
      bookId
    );

    return this.addUrlsToBook(book);
  }

  // Toggle book visibility (public/private)
  async toggleBookVisibility(bookId, makePublic) {
    return this.updateBook(bookId, {
      isPublic: Boolean(makePublic),
      updatedAt: new Date().toISOString()
    });
  }

  // Search books (can filter by public only)
  async searchBooks(query, publicOnly = false) {
    const queries = [
      Query.search('title', query),
      Query.search('author', query)
    ];

    if (publicOnly) {
      queries.push(Query.equal('isPublic', true));
    }

    const response = await this.databases.listDocuments(
      this.databaseId,
      this.collectionId,
      queries
    );

    return {
      ...response,
      documents: response.documents.map(book =>
        this.addUrlsToBook(book)
      ),
    };
  }

  // Get books by status (with optional public filter)
  async getBooksByStatus(status, publicOnly = false) {
    const queries = [Query.equal('status', status)];

    if (publicOnly) {
      queries.push(Query.equal('isPublic', true));
    }

    const response = await this.databases.listDocuments(
      this.databaseId,
      this.collectionId,
      queries
    );

    return {
      ...response,
      documents: response.documents.map(book =>
        this.addUrlsToBook(book)
      ),
    };
  }

  // Get recent books (with optional public filter)
  async getRecentBooks(limit = 10, publicOnly = false) {
    const queries = [];

    if (publicOnly) {
      queries.push(Query.equal('isPublic', true));
    }

    const response = await this.databases.listDocuments(
      this.databaseId,
      this.collectionId,
      queries,
      limit,
      0,
      'createdAt',
      'DESC'
    );

    return {
      ...response,
      documents: response.documents.map(book =>
        this.addUrlsToBook(book)
      ),
    };
  }

  // Update reading progress
  async updateReadingProgress(bookId, lastReadPage) {
    return this.updateBook(bookId, {
      lastReadPage: Number(lastReadPage) || 0,
      lastReadAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  // Update existing books to have isPublic field (one-time migration)
  async migrateBooksToPublic() {
    try {
      const response = await this.databases.listDocuments(
        this.databaseId,
        this.collectionId,
        []
      );

      const updatePromises = response.documents
        .filter(book => book.isPublic === undefined)
        .map(async (book) => {
          try {
            return await this.updateBook(book.$id, {
              isPublic: true
            });
          } catch (error) {
            console.error(`Failed to update book ${book.$id}:`, error);
            return null;
          }
        });

      const results = await Promise.all(updatePromises);
      const successful = results.filter(r => r !== null).length;

      return {
        total: updatePromises.length,
        successful,
        failed: updatePromises.length - successful
      };
    } catch (error) {
      console.error('Migration error:', error);
      throw error;
    }
  }
}

export default new BookService();