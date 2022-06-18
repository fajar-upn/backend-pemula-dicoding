const { nanoid } = require('nanoid');

const books = require('./books');

/**
 * Add book
 */
const addBookHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;

  // create auto-generated id
  const bookId = nanoid(16);

  // generate finished read book
  const finished = (readPage === pageCount);

  // generate insert and update date
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  // checking validation
  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });

    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });

    response.code(400);
    return response;
  }

  // get data from input
  const newBook = {
    bookId,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  const isSuccess = books.filter((book) => book.bookId === bookId).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt,
      },
    });

    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });

  response.code(500);
  return response;
};

/**
 * get books
 */
const getAllBooksHandler = (request, h) => {
  /**
   * request parameter reading
   * request parameter finished
   * request parameter by name
   */
  const reading = parseInt(request.query.reading, 10); // parseInt(string,10). 10 is redix, to avoid problems. see documentation 'http://linterrors.com/js/missing-radix-parameter'
  const finished = parseInt(request.query.finished, 10);
  const reqName = request.query.name;
  const queryName = typeof (reqName) === 'string' ? String(reqName).toLowerCase() : undefined;

  // console.log(queryName);
  // console.log(typeof (queryName));

  /**
   * query reading book
   */
  if (reading === 0) {
    // filter reading book equal to 'false'
    const read = books.filter((book) => book.reading === false);

    const response = h.response({
      status: 'success',
      data: {
        books: read.map((book) => ({
          id: book.bookId,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });

    response.code(200);
    return response;
  }

  if (reading === 1) {
    // filter reading book equal to 'true'
    const read = books.filter((book) => book.reading === true);

    const response = h.response({
      status: 'success',
      data: {
        books: read.map((book) => ({
          id: book.bookId,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });

    response.code(200);
    return response;
  }

  /**
   * query finished book
   */
  if (finished === 0) {
    // filter reading book equal to 'false'
    const read = books.filter((book) => book.finished === false);

    const response = h.response({
      status: 'success',
      data: {
        books: read.map((book) => ({
          id: book.bookId,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });

    response.code(200);
    return response;
  }

  if (finished === 1) {
    // filter reading book equal to 'false'
    const read = books.filter((book) => book.finished === true);

    const response = h.response({
      status: 'success',
      data: {
        books: read.map((book) => ({
          id: book.bookId,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });

    response.code(200);
    return response;
  }

  /**
   * if query name === undefined
   */
  if (queryName === undefined) {
    const response = h.response({
      status: 'success',
      data: {
        books: books.map((book) => ({
          id: book.bookId,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });

    response.code(200);
    return response;
  }

  /**
   * query book by name
   */
  const filteredName = books.filter((book) => (book.name).toLowerCase().includes(queryName));

  // console.log(filteredName);
  if (filteredName) {
    const response = h.response({
      status: 'success',
      data: {
        books: filteredName.map((book) => ({
          id: book.bookId,
          name: book.name,
          publisher: book.publisher,
        })),
      },
    });

    response.code(200);
    return response;
  }

  // if (queryName === 'undefined') {
  const response = h.response({
    status: 'success',
    data: {
      books: books.map((book) => ({
        id: book.bookId,
        name: book.name,
        publisher: book.publisher,
      })),
    },
  });

  response.code(200);
  return response;
  // }
};

/**
 * get detail books by id
 */
const getBooksByIdHandler = (request, h) => {
  const { bookid } = request.params;

  const book = books.filter((b) => b.bookId === bookid)[0];
  if (book) {
    const response = h.response({
      status: 'success',
      data: {
        book: {
          id: book.bookId,
          name: book.name,
          year: book.year,
          author: book.author,
          summary: book.summary,
          publisher: book.publisher,
          pageCount: book.pageCount,
          readPage: book.readPage,
          finished: book.finished,
          reading: book.reading,
          insertedAt: book.insertedAt,
          updatedAt: book.updatedAt,
        },
      },
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });

  response.code(404);
  return response;
};

/**
 * update book
 */
const updateBookByIdHandler = (request, h) => {
  /**
         * get id from parameter
         * get request from request
         * update columns updatedAt
         * update read has been finished ?
         */
  const { bookid } = request.params;
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();
  const finished = (readPage === pageCount);

  if (name === undefined) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });

    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });

    response.code(400);
    return response;
  }

  /**
         * find book in books.js
         */
  const getIndexById = books.findIndex((book) => book.bookId === bookid);

  /**
         * check id avalable ?
         */
  if (getIndexById !== -1) {
    books[getIndexById] = {
      ...books[getIndexById],
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

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });

  response.code(404);

  return response;
};

const deleteBookByIdHandler = (request, h) => {
  const { bookid } = request.params;

  const index = books.findIndex((book) => book.bookId === bookid);

  if (index !== -1) {
    books.splice(index, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });

  response.code(404);
  return response;
};

module.exports = {
  addBookHandler,
  getAllBooksHandler,
  getBooksByIdHandler,
  updateBookByIdHandler,
  deleteBookByIdHandler,
};