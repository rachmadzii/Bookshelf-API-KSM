// Import express
const express = require('express');

// Init router express
const routes = express.Router();

// Import function pada validation.js
const {
    addBookValidation,
    getAllBookValidation,
    updateBookValidation
} = require('./validation');

// Import function pada handler.js
const {
    addBookHandler,
    getAllBookHandler,
    getDetailBookHandler,
    updateBookHandler,
    deleteBookHandler
} = require('./handler');

routes.get('/', (req, res) => {
    res.send('Bookshelf API - KSM Android - Backend Basic');
});

// Method POST, GET, PUT, DELETE
// Parameter (url, middleware yang akan dieksekusi terlebih dahulu, routes selanjutnya (next))
routes.post('/books', addBookValidation, addBookHandler);

routes.get('/books', getAllBookValidation, getAllBookHandler);

routes.get('/books/:bookId', getDetailBookHandler);

routes.put('/books/:bookId', updateBookValidation, updateBookHandler);

routes.delete('/books/:bookId', deleteBookHandler);

module.exports = routes;