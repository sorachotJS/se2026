// data/dataStore.js - In-memory database

class DataStore {
  constructor() {
    this.authors = [
      { id: 1, name: 'J.K. Rowling', country: 'UK', birthYear: 1965 },
      { id: 2, name: 'George Orwell', country: 'UK', birthYear: 1903 },
      { id: 3, name: 'Haruki Murakami', country: 'Japan', birthYear: 1949 }
    ];

    this.books = [
      { id: 1, title: "Harry Potter and the Philosopher's Stone", authorId: 1, year: 1997, genre: 'Fantasy', isbn: '9780747532699' },
      { id: 2, title: '1984', authorId: 2, year: 1949, genre: 'Dystopian', isbn: '9780451524935' },
      { id: 3, title: 'Norwegian Wood', authorId: 3, year: 1987, genre: 'Fiction', isbn: '9780375704024' }
    ];

    this.nextAuthorId = 4;
    this.nextBookId = 4;
  }

  // Authors methods
  getAllAuthors() {
    return [...this.authors];
  }

  getAuthorById(id) {
    return this.authors.find(a => a.id === id);
  }

  addAuthor(author) {
    const newAuthor = { id: this.nextAuthorId++, ...author };
    this.authors.push(newAuthor);
    return newAuthor;
  }

  updateAuthor(id, data) {
    const index = this.authors.findIndex(a => a.id === id);
    if (index === -1) return null;
    
    this.authors[index] = { ...this.authors[index], ...data };
    return this.authors[index];
  }

  deleteAuthor(id) {
    const index = this.authors.findIndex(a => a.id === id);
    if (index === -1) return null;
    
    return this.authors.splice(index, 1)[0];
  }

  // Books methods
  getAllBooks() {
    return [...this.books];
  }

  getBookById(id) {
    return this.books.find(b => b.id === id);
  }

  getBooksByAuthor(authorId) {
    return this.books.filter(b => b.authorId === authorId);
  }

  addBook(book) {
    const newBook = { id: this.nextBookId++, ...book };
    this.books.push(newBook);
    return newBook;
  }

  updateBook(id, data) {
    const index = this.books.findIndex(b => b.id === id);
    if (index === -1) return null;
    
    this.books[index] = { ...this.books[index], ...data };
    return this.books[index];
  }

  deleteBook(id) {
    const index = this.books.findIndex(b => b.id === id);
    if (index === -1) return null;
    
    return this.books.splice(index, 1)[0];
  }
}

module.exports = new DataStore();