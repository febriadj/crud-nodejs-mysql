const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv');
const mysql = require('mysql');
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/public')));
dotenv.config({ path: './.env' });

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE
});

app.get('/', (req, res, next) => {
  res.render('index');
});

app.get('/table', (req, res, next) => {
  let sql = `SELECT * FROM mahasiswa`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.render('table', {
      datas: result
    });
  });
});

app.get('/table/edit/:id', (req, res, next) => {
  let id = req.params.id;
  let sql = `SELECT * from mahasiswa WHERE id = ${id}`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.render('editdata', {
      data: result[0],
    });
  });
});

app.post('/table/edit/:id', (req, res, next) => {
  let id = req.params.id;
  let {nim, nama, jurusan} = req.body;
  let sql = `UPDATE mahasiswa SET nim = '${nim}', nama = '${nama}', jurusan = '${jurusan}' WHERE id = ${id};`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.redirect('/table');
  });
});

app.get('/table/post', (req, res, next) => {
  res.render('postdata');
});

app.post('/table/post', (req, res, next) => {
  let {nim, nama, jurusan} = req.body;
  let sql = `INSERT INTO mahasiswa VALUES(0, '${nim}', '${nama}', '${jurusan}')`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.redirect('/table');
  });
});

app.use((req, res, next) => {
  res.status(404).render('404');
});

db.connect(err => {
  if (err) throw err;
  console.log('mysql terkoneksi');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`app running on port ${port}`);
});