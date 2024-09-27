import { nanoid } from 'nanoid';
import books from './books.js';
import { buildResponse } from './utils.js';

// Menambahkan Buku
export const addBookHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    if (!name) {
        return buildResponse(h, 400, 'Gagal menambahkan buku. Mohon isi nama buku');
    }

    if (readPage > pageCount) {
        return buildResponse(h, 400, 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount');
    }

    const id = nanoid();
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = pageCount === readPage;

    const newBook = {
        id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt,
    };

    books.push(newBook);
    return h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: {
            bookId: id,
        },
    }).code(201);
};

// Mendapatkan Semua Buku
export const getAllBooksHandler = (request, h) => {
    const response = books.map(({ id, name, publisher }) => ({ id, name, publisher }));
    return buildResponse(h, 200, 'success', { books: response });
};

// Mendapatkan Detail Buku
export const getBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const book = books.find(b => b.id === bookId);

    if (!book) {
        return buildResponse(h, 404, 'Buku tidak ditemukan');
    }

    return buildResponse(h, 200, 'success', { book });
};

// Memperbarui Buku
export const updateBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const index = books.findIndex(book => book.id === bookId);

    if (index === -1) {
        return buildResponse(h, 404, 'Gagal memperbarui buku. Id tidak ditemukan');
    }

    if (!name) {
        return buildResponse(h, 400, 'Gagal memperbarui buku. Mohon isi nama buku');
    }

    if (readPage > pageCount) {
        return buildResponse(h, 400, 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount');
    }

    const updatedAt = new Date().toISOString();
    books[index] = {
        ...books[index],
        name, year, author, summary, publisher, pageCount, readPage, reading, updatedAt,
    };

    return buildResponse(h, 200, 'Buku berhasil diperbarui');
};

// Menghapus Buku
export const deleteBookByIdHandler = (request, h) => {
    const { bookId } = request.params;
    const index = books.findIndex(book => book.id === bookId);

    if (index === -1) {
        return buildResponse(h, 404, 'Buku gagal dihapus. Id tidak ditemukan');
    }

    books.splice(index, 1);
    return buildResponse(h, 200, 'Buku berhasil dihapus');
};
