import { Client, Databases, Storage, ID } from 'appwrite';
import conf from '../../conf/conf';

class BookService {
  constructor() {
    this.client = new Client()
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    
    this.databases = new Databases(this.client);
    this.storage = new Storage(this.client);
    
    this.databaseId = conf.appwriteDatabaseId;
    this.collectionId = conf.appwriteCollectionId; // Your books collection ID
    this.bucketId = conf.appwriteBucketId; // Your book-covers bucket ID
  }

  // Upload book cover image
  async uploadCover(file) {
    try {
      return await this.storage.createFile(
        this.bucketId,
        ID.unique(),
        file
      );
    } catch (error) {
      console.error('Upload cover error:', error);
      throw error;
    }
  }

  // Create new book
  async createBook(bookData) {
    try {
      return await this.databases.createDocument(
        this.databaseId,
        this.collectionId,
        ID.unique(),
        bookData
      );
    } catch (error) {
      console.error('Create book error:', error);
      throw error;
    }
  }

  // Get all books for current user
  async getUserBooks(userId) {
    try {
      return await this.databases.listDocuments(
        this.databaseId,
        this.collectionId,
        [`userId=${userId}`] // Query to get only user's books
      );
    } catch (error) {
      console.error('Get books error:', error);
      throw error;
    }
  }

  // Update book
  async updateBook(bookId, updates) {
    try {
      return await this.databases.updateDocument(
        this.databaseId,
        this.collectionId,
        bookId,
        updates
      );
    } catch (error) {
      console.error('Update book error:', error);
      throw error;
    }
  }

  // Delete book
  async deleteBook(bookId) {
    try {
      return await this.databases.deleteDocument(
        this.databaseId,
        this.collectionId,
        bookId
      );
    } catch (error) {
      console.error('Delete book error:', error);
      throw error;
    }
  }
}

const bookService = new BookService();
export default bookService;