'use strict';

const response = require('./res');
const connection = require('./koneksi');

const multer = require('multer');
const path = require('path');

// Konfigurasi penyimpanan file
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // folder untuk menyimpan gambar
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // nama file unik
    }
});

// Filter jenis file yang diperbolehkan
const fileFilter = function (req, file, cb) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Format file tidak didukung'), false);
    }
};

// Export middleware upload
exports.upload = multer({ storage: storage, fileFilter: fileFilter });

exports.index = function(req, res) {
    response.ok("Aplikasi REST API ku berjalan!", res);
};

exports.tampilsemuakomik = function(req, res) {
    connection.query('SELECT * FROM Komiku', function(error, rows, fields) {
        if (error) {
            console.log(error);
        } else {
            response.ok(rows, res);
        }
    });
};

exports.tampilberdasarkanid = function(req, res) {
    let id = req.params.id;
    connection.query(
        'SELECT * FROM Komiku WHERE id_komik = ?',
        [id],
        function(error, rows, fields) {
            if (error) {
                console.log(error);
            } else {
                response.ok(rows, res);
            }
        }
    );
};

exports.tambahKomik = function(req, res) {
    var nama = req.body.nama;
    var genre = req.body.genre;
    var rilis = req.body.rilis;
    var imagePath = req.file ? req.file.path : null;

    connection.query(
        'INSERT INTO Komiku (nama, genre, rilis, image) VALUES (?, ?, ?, ?)',
        [nama, genre, rilis, imagePath],
        function(error, rows, fields) {
            if (error) {
                console.log(error);
                res.status(500).send({ error: "Gagal menyimpan data" });
            } else {
                response.ok("Berhasil Menambahkan Data dengan Gambar!", res);
            }
        }
    );
};

exports.ubahKomik = function(req, res) {
    var id = req.body.id_komik;
    var nama = req.body.nama;
    var genre = req.body.genre;
    var rilis = req.body.rilis;

    connection.query(
        'UPDATE Komiku SET nama=?, genre=?, rilis=? WHERE id_komik=?',
        [nama, genre, rilis, id],
        function(error, rows, fields) {
            if (error) {
                console.log(error);
            } else {
                response.ok("Berhasil Ubah Data", res);
            }
        }
    );
};

exports.hapusKomik = function(req, res) {
    const id = req.body.id_komik;
    connection.query(
        'DELETE FROM Komiku WHERE id_komik = ?',
        [id],
        function(error, rows, fields) {
            if (error) {
                console.log(error);
                res.status(500).send({ error: "Gagal menghapus data" });
            } else {
                response.ok("Berhasil Hapus Data", res);
            }
        }
    );
};
