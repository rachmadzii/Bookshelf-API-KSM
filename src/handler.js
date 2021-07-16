// Import nanoid untuk random bookId
const {
    nanoid
} = require('nanoid');

// Import books
const books = require('./books');

// Function addBookHandler berisi logic untuk menambahkan data buku (POST)
const addBookHandler = (req, res) => {
    // Inisialisasi variabel berupa nilai yang dikirimkan dari body
    const {
        name,
        year,
        author,
        pageCount,
        publisher,
        price
    } = req.body;

    const id = nanoid(12); // ID nanoid panjang 12
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    // Object newBook, key: value -> jadi satu variabel, karena namanya sama
    const newBook = {
        id,
        name,
        year,
        author,
        pageCount,
        publisher,
        price,
        insertedAt,
        updatedAt,
    };

    books.push(newBook); // Menambahkan data object newBook ke array books

    // Mengembalikan response berhasil dengan status code 201, berisi message dan data
    return res.status(201).json({
        success: true,
        message: "Buku berhasil ditambahkan",
        data: {
            bookId: newBook.id
        }
    });
};

// Function getAllBookHandler berisi logic untuk menampilkan data buku per page (GET)
const getAllBookHandler = (req, res) => {
    // Ketentuan maksimal data buku yang ditampilkan per page
    const maxPerPage = 3; 

    // Maksimal page dari jumlah data buku, ceil (bulat keatas), total books / 3
    const maxPage = Math.ceil(books.length / maxPerPage);
    
    // Data yang dikirim dari query
    const formData = req.query;
    
    // Page berupa string, dikonversi ke int. || 1 sebagai default jika tidak ada nilai page
    const page = parseInt(formData.page) || 1;
    
    // Array dataBooks, pakai let agar variabel bersifat mutable
    let dataBooks = []; 

    // Memasukkan data array books ke array dataBooks
    for (let i = 0; i < books.length; i++) {
        const book = books[i];

        dataBooks.push({
            booksId: book.id,
            name: book.name,
            publisher: book.publisher,
            year: book.year,
            price: book.price
        });
    }

    // Jika query sort terisi nilai
    if (formData.sort) {
        // Jika terisi "price"
        if (formData.sort === "price") {
            // Sort data ASC berdasarkan price
            dataBooks.sort((a, b) => a.price - b.price); // a nilai kiri, b nilai kanan
        } else {
            // Sort data ASC berdasarkan year
            dataBooks.sort((a, b) => a.year - b.year);
        }
    }

    // indexPage -> index awal per page
    const indexPage = maxPerPage * (page - 1); // misal: 3 * (1 - 1) = 0 (index awal)

    /* Slice -> memotong data array (dimulai dari index berapa, sampai data < index itu)
    misal: (0, 0 + 3) -> (0, 3) -> data index 0, 1, 2 -> dimasukkan ke array dataBooks 
    */
    dataBooks = dataBooks.slice(indexPage, indexPage + maxPerPage);

    return res.status(200).json({
        success: true,
        page,
        nextpage: page + 1, // Page selanjutnya
        maxPage,
        data: {
            books: dataBooks
        }
    });
};

// Function getDetailBookHandler berisi logic untuk menampilkan detail data buku (GET)
const getDetailBookHandler = (req, res) => {
    // Inisialisasi bookId berupa nilai yang dikirimkan dari params (setelah / pada url)
    const {
        bookId
    } = req.params;

    // Mencari bookId yang sama dengan id array books
    const bookFound = books.find((book) => book.id === bookId); // (true / false)
    // Jika true, bookFound berisi data books yang sesuai dengan bookId

    // Jika ditemukan (true)
    if (bookFound) {
        return res.status(200).json({
            success: true,
            data: {
                book: bookFound
            }
        });
    }

    // Jika tidak ditemukan
    return res.status(404).json({
        success: false,
        message: `Buku dengan id ${bookId} tidak ditemukan`
    });
}

// Function updateBookHandler berisi logic untuk memperbarui data buku (PUT)
const updateBookHandler = (req, res) => {
    // Inisialisasi variabel berupa nilai yang dikirimkan dari body
    const {
        name,
        price
    } = req.body;

    // Inisialisasi bookId berupa nilai yang dikirimkan dari params (setelah / pada url)
    const {
        bookId
    } = req.params;

    // Mencari index bookId yang sama dengan id array books
    const indexBook = books.findIndex((book) => book.id === bookId);
    // Jika true, indexBook bernilai index data books yang sesuai dengan bookId
    // Jika false, indexBook bernilai -1 (tidak ada data yang sesuai)

    // Jika data tidak ditemukan (index -1)
    if (indexBook === -1) {
        return res.status(404).json({
            success: false,
            message: `Buku dengan id ${bookId} tidak ditemukan`
        });
    }

    /* Jika data ditemukan (bukan -1), 
    mengganti (replace) data books index ke-indexBook
    ...books[indexBook] -> berisi value data books lama diganti dengan name dan price yang baru
    */
    books[indexBook] = {
        ...books[indexBook],
        name,
        price
    };

    // Response berhasil setelah memperbarui data
    return res.status(200).json({
        success: true,
        message: `Buku dengan id ${bookId} berhasil diperbarui`
    });
}

// Function deleteBookHandler berisi logic untuk menghapus data buku (DELETE)
const deleteBookHandler = (req, res) => {
    // Inisialisasi bookId berupa nilai yang dikirimkan dari params (setelah / pada url)
    const {
        bookId
    } = req.params;

    // Mencari index bookId yang sama dengan id array books
    const indexBook = books.findIndex((book) => book.id === bookId);

    // Index tidak ditemukan
    if (indexBook === -1) {
        return res.status(404).json({
            success: false,
            message: `Buku dengan id ${bookId} tidak ditemukan`
        });
    }

    // Index ditemukan, menghapus 1 data pada index ke-indexBook (menghapus data index itu sendiri)
    books.splice(indexBook, 1);

    // Response berhasil setelah menghapus data
    return res.status(200).json({
        success: true,
        message: `Buku dengan id ${bookId} berhasil dihapus`
    });
}

// Ekspor semua function agar dapat digunakan dalam file lainnya
module.exports = {
    addBookHandler,
    getAllBookHandler,
    getDetailBookHandler,
    updateBookHandler,
    deleteBookHandler
};