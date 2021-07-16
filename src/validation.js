/* validation.js sebagai middleware
Untuk memvalidasi data yang dikirim sesuai dengan ketentuan yang berlaku.
*/

// Import books.js
const books = require('./books');

/* Function errorMessage mengembalikan status dan message setelah data dikirim, 
dibuat function agar dapat digunakan ke beberapa fungsi (reuse)
*/
const errorMessage = (message) => {
    return {
        status: false,
        message
    }
}

/* Pada express, dapat menggunakan 3 parameter (request, result, next)
request: data yang masuk
response: hasil setelah data dikirim
next: untuk menuju ke function selanjutnya (pada route) apabila tidak ada error saat validasi
*/
const addBookValidation = (req, res, next) => {
    // Data yang dikirim oleh pengguna (sebagai body)
    const formData = req.body;

    try {
        // Object dataValidation, value berisi tipe data dari key
        const dataValidation = {
            name: "string",
            year: "number",
            author: "string",
            pageCount: "number",
            publisher: "string",
            price: "number"
        }

        // Mengembalikan array key dari object dataValidation
        const keyData = Object.keys(dataValidation); // ["name", "year", dst]

        // Mengecek dan membandingkan tipedata dari data user dengan dataValidation
        for (let i = 0; i < keyData.length; i++) {
            const key = keyData[i]; // key = keyData[0] -> "name"

            // Jika data yang dikirim tidak sesuai atau ada yang kurang
            if (formData[key] === undefined) { // formData["name"] = tidak ada nilai, dst
                throw errorMessage("Harap memasukan data yang diperlukan");
            }

            /* Jika tipe data pada data yang dikirim tidak sesuai ketentuan
            typeof = tipe data dari name, hasil "string"
            formData["name"]
            dataValidation["name"]
            */
            if (typeof formData[key] !== dataValidation[key]) {
                throw errorMessage("Harap memasukan data dengan benar");
            }
        }

        /* Jika nama buku sudah ada pada array (sudah dimasukkan sebelumnya)
        Some digunakan untuk memverifikasi array books setidaknya memiliki satu elemen,
        yaitu name pada formData (input) sama dengan name pada array books
        */
        const isHasBookName = books.some((book) => {
            return book.name === formData.name; // Jika ada yang sama, true. Jika tidak, false.
        });

        // isHasBookName = true
        if (isHasBookName) {
            // Melempar function errorMessage dengan parameter message, menjadi variabel error pada catch
            throw errorMessage("Nama buku sudah ada");
        }

        // Jika harga buku dibawah 0
        if (formData.price < 0) {
            throw errorMessage("Harga yang dimasukan tidak valid");
        }

        // Jika tahun buku dibawah 2001
        if (formData.year < 2001) {
            throw errorMessage("Tahun buku harus diatas atau sama dengan 2001");
        }

        /* Apabila tidak ada error/kesalahan di atas, akan return next 
        dan menuju function selanjutnya pada routes (addBookHandler)
        */
        return next();

    } catch (error) { // Jika throw melempar error, ditangkap pada catch (error)
        // Mengembalikan response status code 400 dan error message sesuai parameter
        return res.status(400).json(error);
    }
};

const getAllBookValidation = (req, res, next) => {
    // Menangkap data dari query yang dikirim (setelah ? pada url)
    const formData = req.query;

    try {
        /* Mengecek query sort yang dikirimkan
        Jika ada dan query sort bukan year atau price maka salah
        */
        if (formData.sort && !["year", "price"].includes(formData.sort)) { // includes -> terdapat pada sort
            throw errorMessage("Query sort yang dimasukan tidak sesuai");
        }

        return next();

    } catch (error) {
        return res.status(400).json(error);
    }
};

const updateBookValidation = (req, res, next) => {
    const formData = req.body;

    try {
        // Object dataValidation, value berisi tipe data dari key
        const dataValidation = {
            name: "string",
            price: "number"
        }

        const keyData = Object.keys(dataValidation);

        // Jika nama tidak dilampirkan (tidak dimasukkan / tanpa "name")
        if (formData.name === undefined) {
            throw errorMessage("Nama buku wajib diisi");
        }

        for (let i = 0; i < keyData.length; i++) {
            const key = keyData[i];

            if (formData[key] === undefined) {
                throw errorMessage("Harap memasukan data yang diperlukan");
            }

            if (typeof formData[key] !== dataValidation[key]) {
                throw errorMessage("Harap memasukan data dengan benar");
            }
        }

        if (formData.price < 0) {
            throw errorMessage("Harga yang dimasukan tidak valid");
        }

        return next();

    } catch (error) {
        return res.status(400).json(error);
    }
}

// Ekspor function pada validation.js agar dapat digunakan dalam file lain
module.exports = {
    addBookValidation,
    getAllBookValidation,
    updateBookValidation
};