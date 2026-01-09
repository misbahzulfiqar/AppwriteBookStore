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
    
//     console.log('BookService initialized with bucket:', this.bucketId);
//   }

//   // Get storage instance for direct use in components
//   getStorage() {
//     return this.storage;
//   }

//   // Get bucket ID for direct use in components
//   getBucketId() {
//     return this.bucketId;
//   }

//   // Upload any file (PDF or image) to storage
//   async uploadFile(file, type = 'pdf') {
//     try {
//       // Validate file based on type
//       if (type === 'pdf' && file.type !== 'application/pdf') {
//         throw new Error('File must be a PDF');
//       }
      
//       if (type === 'image' && !file.type.startsWith('image/')) {
//         throw new Error('File must be an image');
//       }
      
//       const fileId = ID.unique();
//       const result = await this.storage.createFile(
//         this.bucketId,
//         fileId,
//         file
//       );
      
//       console.log(`${type.toUpperCase()} uploaded:`, fileId);
//       return { ...result, fileId };
//     } catch (error) {
//       console.error(`Upload ${type} error:`, error);
//       throw error;
//     }
//   }

//   // Upload PDF file
//   async uploadPdf(file) {
//     return this.uploadFile(file, 'pdf');
//   }

//   // Upload cover image
//   async uploadCoverImage(file) {
//     return this.uploadFile(file, 'image');
//   }

//   // Create new book with PDF and optional cover image
//   async createBook(bookData, pdfFile, coverFile = null) {
//     try {
//       // Upload PDF (required)
//       const uploadedPdf = await this.uploadPdf(pdfFile);
//       const pdfFileId = uploadedPdf.fileId;

//       // Upload cover image if provided
//       let coverImageId = null;
//       if (coverFile) {
//         const uploadedCover = await this.uploadCoverImage(coverFile);
//         coverImageId = uploadedCover.fileId;
//       }

//       // Prepare final book data
//       const finalBookData = {
//         title: String(bookData.title || ''),
//         author: String(bookData.author || ''),
//         description: String(bookData.description || ''),
//         status: String(bookData.status || 'want-to-read'),
//         pagesRead: String(bookData.pagesRead || '0'),
//         totalPages: String(bookData.totalPages || '0'),
//         rating: parseInt(bookData.rating) || 0,
//         pdfFileId: String(pdfFileId),
//         coverImageId: coverImageId ? String(coverImageId) : null,
//         lastReadPage: 0,
//         lastReadAt: null,
//       };

//       console.log('Creating book with data:', finalBookData);

//       const newBook = await this.databases.createDocument(
//         this.databaseId,
//         this.collectionId,
//         ID.unique(),
//         finalBookData
//       );
      
//       console.log('Book created successfully:', newBook.$id);
      
//       // Add URLs before returning
//       return this.addUrlsToBook(newBook);
//     } catch (error) {
//       console.error('Create book error:', error);
//       throw error;
//     }
//   }

//   // Helper method to add URLs to book object
//   addUrlsToBook(book) {
//     if (!book) return book;
    
//     return {
//       ...book,
//       pdfUrl: this.getPdfUrl(book.pdfFileId),
//       coverImageUrl: this.getCoverImageUrl(book.coverImageId)
//     };
//   }

//   // Get PDF file URL for viewing
//   getPdfUrl(fileId) {
//     try {
//       if (!fileId) {
//         console.warn('No PDF file ID provided');
//         return null;
//       }
      
//       // Use getFileView for browser display
//       const result = this.storage.getFileView(
//         this.bucketId,
//         fileId
//       );
      
//       return result;
//     } catch (error) {
//       console.error('Get PDF View URL error:', error);
      
//       // Fallback: Try download if view fails
//       try {
//         return this.storage.getFileDownload(this.bucketId, fileId);
//       } catch (fallbackError) {
//         console.error('Fallback also failed:', fallbackError);
//         return null;
//       }
//     }
//   }

//   // Get cover image URL with preview options
//   getCoverImageUrl(fileId, width = 300, height = 450) {
//     try {
//       if (!fileId) {
//         console.log('No cover image ID provided, returning null');
//         return null;
//       }
      
//       // Use getFilePreview for optimized images
//       const result = this.storage.getFilePreview(
//         this.bucketId,
//         fileId,
//         width,
//         height,
//         undefined, // quality
//         'center'   // gravity for cropping
//       );
      
//       return result;
//     } catch (error) {
//       console.error('Get cover image URL error:', error);
      
//       // Fallback to basic view
//       try {
//         return this.storage.getFileView(this.bucketId, fileId);
//       } catch (fallbackError) {
//         console.error('Fallback also failed:', fallbackError);
//         return null;
//       }
//     }
//   }

//   // Get all books WITH URLs
//   async getUserBooks() {
//     try {
//       const response = await this.databases.listDocuments(
//         this.databaseId,
//         this.collectionId,
//         [] // Empty query to get all books
//       );
      
//       console.log(`Retrieved ${response.documents?.length || 0} books`);
      
//       // Add URLs to all books
//       const booksWithUrls = response.documents.map(book => 
//         this.addUrlsToBook(book)
//       );
      
//       return {
//         ...response,
//         documents: booksWithUrls
//       };
//     } catch (error) {
//       console.error('Get books error:', error);
//       throw error;
//     }
//   }

//   // Get a specific book by ID
//   async getBookById(bookId) {
//     try {
//       const book = await this.databases.getDocument(
//         this.databaseId,
//         this.collectionId,
//         bookId
//       );
      
//       return this.addUrlsToBook(book);
//     } catch (error) {
//       console.error('Get book by ID error:', error);
//       throw error;
//     }
//   }

//   // Update book (for reading progress, status changes, etc.)
//   async updateBook(bookId, updates, coverFile = null) {
//     try {
//       let finalUpdates = { ...updates };
      
//       // Upload new cover image if provided
//       if (coverFile) {
//         // Get current book to delete old cover
//         const currentBook = await this.getBookById(bookId);
//         if (currentBook.coverImageId) {
//           try {
//             await this.storage.deleteFile(this.bucketId, currentBook.coverImageId);
//             console.log('Deleted old cover image:', currentBook.coverImageId);
//           } catch (deleteError) {
//             console.warn('Could not delete old cover image:', deleteError);
//           }
//         }
        
//         // Upload new cover
//         const uploadedCover = await this.uploadCoverImage(coverFile);
//         finalUpdates.coverImageId = uploadedCover.fileId;
//         console.log('Uploaded new cover image:', uploadedCover.fileId);
//       }
      
//       // Convert any numbers to appropriate types
//       if (finalUpdates.pagesRead !== undefined) {
//         finalUpdates.pagesRead = String(finalUpdates.pagesRead);
//       }
      
//       if (finalUpdates.totalPages !== undefined) {
//         finalUpdates.totalPages = String(finalUpdates.totalPages);
//       }
      
//       if (finalUpdates.rating !== undefined) {
//         finalUpdates.rating = parseInt(finalUpdates.rating) || 0;
//       }
      
//       if (finalUpdates.lastReadPage !== undefined) {
//         finalUpdates.lastReadPage = parseInt(finalUpdates.lastReadPage) || 0;
//       }

//       // Add updated timestamp
//       finalUpdates.updatedAt = new Date().toISOString();

//       console.log('Updating book:', bookId, finalUpdates);

//       const updatedBook = await this.databases.updateDocument(
//         this.databaseId,
//         this.collectionId,
//         bookId,
//         finalUpdates
//       );
      
//       return this.addUrlsToBook(updatedBook);
//     } catch (error) {
//       console.error('Update book error:', error);
//       throw error;
//     }
//   }

//   // Update only cover image (separate from other updates)
//   async uploadCoverImageOnly(bookId, coverFile) {
//     return this.updateBook(bookId, {}, coverFile);
//   }

//   // Delete book and its associated files
//   async deleteBook(bookId) {
//     try {
//       // First get the book to delete associated files
//       const book = await this.getBookById(bookId);
      
//       // Delete PDF file if exists
//       if (book.pdfFileId) {
//         try {
//           await this.storage.deleteFile(this.bucketId, book.pdfFileId);
//           console.log('Deleted PDF file:', book.pdfFileId);
//         } catch (pdfError) {
//           console.warn('Could not delete PDF file:', pdfError);
//         }
//       }
      
//       // Delete cover image if exists
//       if (book.coverImageId) {
//         try {
//           await this.storage.deleteFile(this.bucketId, book.coverImageId);
//           console.log('Deleted cover image:', book.coverImageId);
//         } catch (coverError) {
//           console.warn('Could not delete cover image:', coverError);
//         }
//       }
      
//       // Delete the book document
//       console.log('Deleting book document:', bookId);
//       return await this.databases.deleteDocument(
//         this.databaseId,
//         this.collectionId,
//         bookId
//       );
//     } catch (error) {
//       console.error('Delete book error:', error);
//       throw error;
//     }
//   }

//   // Check if a book exists
//   async bookExists(bookId) {
//     try {
//       await this.databases.getDocument(
//         this.databaseId,
//         this.collectionId,
//         bookId
//       );
//       return true;
//     } catch (error) {
//       return false;
//     }
//   }

//   // Search books by title or author
//   async searchBooks(query) {
//     try {
//       const response = await this.databases.listDocuments(
//         this.databaseId,
//         this.collectionId,
//         [
//           `title=${query}`,
//           `author=${query}`
//         ]
//       );
      
//       // Add URLs to search results
//       const booksWithUrls = response.documents.map(book => 
//         this.addUrlsToBook(book)
//       );
      
//       return {
//         ...response,
//         documents: booksWithUrls
//       };
//     } catch (error) {
//       console.error('Search books error:', error);
//       throw error;
//     }
//   }

//   // Get books by status
//   async getBooksByStatus(status) {
//     try {
//       const response = await this.databases.listDocuments(
//         this.databaseId,
//         this.collectionId,
//         [
//           `status=${status}`
//         ]
//       );
      
//       // Add URLs to filtered books
//       const booksWithUrls = response.documents.map(book => 
//         this.addUrlsToBook(book)
//       );
      
//       return {
//         ...response,
//         documents: booksWithUrls
//       };
//     } catch (error) {
//       console.error('Get books by status error:', error);
//       throw error;
//     }
//   }

//   // Get recently added books
//   async getRecentBooks(limit = 10) {
//     try {
//       const response = await this.databases.listDocuments(
//         this.databaseId,
//         this.collectionId,
//         [],
//         limit,
//         0,
//         'createdAt',
//         'DESC'
//       );
      
//       // Add URLs to recent books
//       const booksWithUrls = response.documents.map(book => 
//         this.addUrlsToBook(book)
//       );
      
//       return {
//         ...response,
//         documents: booksWithUrls
//       };
//     } catch (error) {
//       console.error('Get recent books error:', error);
//       throw error;
//     }
//   }
// }

// const bookService = new BookService();
// export default bookService;

import { Client, Databases, Storage, ID, Account } from 'appwrite';
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

  async uploadFile(file) {
    const fileId = ID.unique();

    await this.storage.createFile(
      this.bucketId,
      fileId,
      file
    );

    return fileId;
  }

  /* =========================
     CRUD
  ========================= */

  async createBook(bookData, pdfFile, coverFile = null) {
    const pdfFileId = await this.uploadFile(pdfFile);
    let coverImageId = null;

    if(bookData.coverImageId) {
      coverImageId = bookData.coverImageId;
    }else if (coverFile) {
      coverImageId = await this.uploadFile(coverFile);
    }

    const newBook = await this.databases.createDocument(
      this.databaseId,
      this.collectionId,
      ID.unique(),
      {
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
      }
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
    const updated = await this.databases.updateDocument(
      this.databaseId,
      this.collectionId,
      bookId,
      updates
    );

    return this.addUrlsToBook(updated);
  }

  async updateCoverImage(bookId, coverFile) {
    const coverImageId = await this.uploadFile(coverFile);

    const updated = await this.databases.updateDocument(
      this.databaseId,
      this.collectionId,
      bookId,
      { coverImageId }
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
}

export default new BookService();
