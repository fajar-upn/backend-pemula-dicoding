const {
  addBookHandler, getAllBooksHandler,
  getBooksByIdHandler, updateBookByIdHandler, deleteBookByIdHandler,
} = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addBookHandler,
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllBooksHandler,
  },
  {
    method: 'GET',
    path: '/books/{bookid}',
    handler: getBooksByIdHandler,
  },
  {
    method: 'PUT',
    path: '/books/{bookid}',
    handler: updateBookByIdHandler,
  },
  {
    method: 'DELETE',
    path: '/books/{bookid}',
    handler: deleteBookByIdHandler,
  },
];

module.exports = routes;