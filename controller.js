'use strict';

var response = require('./res');
var connection = require('./koneksi');

exports.index = function(req, res) {
    response.ok("Aplikasi REST API ku berjalan!",res);
};
exports.tampilsemuakomik = function(req,res){
    connection.query('SELECT * FROM Komiku', function(error, rows, fileds){
        if(error){
            connection.log(error);
        }else {
            response.ok(rows, res)
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

exports.tambahKomik = function (req, res) {
    var nama = req.body.nama;
    var genre = req.body.genre;
    var rilis = req.body.rilis;

    connection.query(
        'INSERT INTO Komiku (nama, genre, rilis) VALUES (?, ?, ?)',
        [nama, genre, rilis],
        function (error, rows, fields) {
            if (error) {
                console.log(error);
            } else {
                response.ok("Berhasil Menambahkan Data!", res);
            }
        }
    );
};

exports.ubahKomik = function(req, res){
    var id = req.body.id_komik;
    var nama = req.body.nama;
    var genre = req.body.genre;
    var rilis = req.body.rilis;

    connection.query(
        'UPDATE Komiku SET nama=?, genre=?, rilis=? WHERE id_komik=?',
        [nama, genre, rilis, id],
        function(error, rows, fields){
            if(error){
                console.log(error);
            } else {
                response.ok("Berhasil Ubah Data", res);
            }
        }
    );
};

exports.hapusKomik = function (req, res) {
    const id = req.body.id_komik;
    connection.query(
        'DELETE FROM Komiku WHERE id_komik = ?',
        [id],
        function (error, rows, fields) {
            if (error) {
                console.log(error);
                res.status(500).send({ error: "Gagal menghapus data" });
            } else {
                response.ok("Berhasil Hapus Data", res);
            }
        }
    );
};

