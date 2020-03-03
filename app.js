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
 Picture.find({})
  .then(images => {
   res.render('index', {
    images
   });
  });
});

// Set Image Storage
let storage = multer.diskStorage({
 destination: './public/uploads/images/',
 filename: (req, file, cb) => {
  cb(null, file.originalname)
 }
});

let upload = multer({
 storage,
 fileFilter: (req, file, cb) => {
  checkFileType(file, cb);
 }
});

function checkFileType(file, cb) {
 const fileType = /jpeg|jpg|png|gif/;
 const extname = fileType.test(path.extname(file.originalname).toLowerCase());
 if (extname) {
  return cb(null, true);
 } else {
  cb('Error : Please image only');
 }
}

app.post('/uploadsingle', upload.single('singleImage'), (req, res, next) => {
 const file = req.file;
 if (!file) {
  return console.log('Please select an image');
 }

 let url = file.path.replace('public', '');

 Picture.findOne({
   imgUrl: url
  })
  .then(img => {
   if (img) {
    console.log('Duplicate Image. Try again!');
    return res.redirect('/upload');
   }
   Picture.create({
     imgUrl: url
    })
    .then(img => {
     console.log('Image Saved to DB');
     res.redirect('/');
    })
  })
  .catch(err => {
   return console.log('ERROR' + err);
  });
});

app.listen(3000, () => {
 console.log("Connected!!!");
});