import { nanoid } from 'nanoid';
import books from './books.js';
import buildResponse from './utils.js';

const addBookHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  // Validasi: Properti 'name' harus ada
  if (!name) {
    return buildResponse(h, 'fail', 'Gagal menambahkan buku. Mohon isi nama buku', 400);
  }

  // Validasi: 'readPage' tidak boleh lebih besar dari 'pageCount'
  if (readPage > pageCount) {
    return buildResponse(h, 'fail', 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount', 400);
  }

  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = readPage === pageCount;

  const newBook = {
    id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    return buildResponse(h, 'success', 'Buku berhasil ditambahkan', 201, { bookId: id });
  }

  return buildResponse(h, 'fail', 'Buku gagal ditambahkan', 500);
};

const getAllBooksHandler = (request, h) => {
  const { name, reading, finished } = request.query;

  let filteredBooks = books;

  if (name) {
    filteredBooks = filteredBooks.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
  }

  if (reading !== undefined) {
    filteredBooks = filteredBooks.filter((book) => book.reading === !!Number(reading));
  }

  if (finished !== undefined) {
    filteredBooks = filteredBooks.filter((book) => book.finished === !!Number(finished));
  }

  const responseBooks = filteredBooks.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));

  return buildResponse(h, 'success', null, 200, { books: responseBooks });
};

const getBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const book = books.filter((b) => b.id === bookId)[0];

  if (book) {
    return buildResponse(h, 'success', null, 200, { book });
  }

  return buildResponse(h, 'fail', 'Buku tidak ditemukan', 404);
};

const updateBookByIdHandler = (request, h) => {
  const { bookId } = request.params;
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  // Validasi: Properti 'name' harus ada
  if (!name) {
    return buildResponse(h, 'fail', 'Gagal memperbarui buku. Mohon isi nama buku', 400);
  }

  // Validasi: 'readPage' tidak boleh lebih besar dari 'pageCount'
  if (readPage > pageCount) {
    return buildResponse(h, 'fail', 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount', 400);
  }

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    const updatedAt = new Date().toISOString();
    const finished = readPage === pageCount;

    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      finished,
      reading,
      updatedAt,
    };

    return buildResponse(h, 'success', 'Buku berhasil diperbarui', 200);
  }

  return buildResponse(h, 'fail', 'Gagal memperbarui buku. Id tidak ditemukan', 404);
};

const deleteBookByIdHandler = (request, h) => {
  const { bookId } = request.params;

  const index = books.findIndex((book) => book.id === bookId);

  if (index !== -1) {
    books.splice(index, 1);
    return buildResponse(h, 'success', 'Buku berhasil dihapus', 200);
  }

  return buildResponse(h, 'fail', 'Buku gagal dihapus. Id tidak ditemukan', 404);
};

export {
  addBookHandler,
  getAllBooksHandler,
  getBookByIdHandler,
  updateBookByIdHandler,
  deleteBookByIdHandler,
};