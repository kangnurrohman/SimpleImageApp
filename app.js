const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const multer = require('multer');
const methodOverride = require('method-override');

mongoose.connect('mongodb://localhost:27017/images', {
 useNewUrlParser: true,
 useUnifiedTopology: true,
 useCreateIndex: true
});

let imagesScheme = new mongoose.Schema({
 imgUrl: String
});

let Picture = mongoose.model('Picture', imagesScheme);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(methodOverride('_method'));

app.get('/upload', (req, res) => {
 res.render('upload');
})

app.get('/', (req, res) => {
 res.render('index');
});

app.listen(3000, () => {
 console.log("Connected!!!");
});