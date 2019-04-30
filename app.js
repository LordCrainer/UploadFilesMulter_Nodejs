// call all the required packages
const express = require('express')
const bodyParser = require('body-parser')
const multer = require('multer');
const path = require('path');
const port = 1010;
const fs = require('fs')

//Variable
var time;

//CREATE EXPRESS APP
const app = express();

app.use(bodyParser.urlencoded({
  extended: true
}))
//ROUTES WILL GO HERE
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');

});


// SET STORAGE
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads')
  },
  filename: function(req, file, cb) {
    console.log("Storage: ", file);
    time = new Date();
    cb(null, `${time.getFullYear()}-${time.getMonth()}-${time.getDate()}${path.extname(file.originalname)}`) //file.originalname
  }
})

var upload = multer({
  storage: storage
})

app.post('/uploadfile', upload.single('myFile'), (req, res, next) => {
  var finalTime = new Date();
  var duration = new Date(finalTime - time)
  var seconds = duration.getSeconds() < 10 ? "0"+duration.getSeconds(): duration.getSeconds();
  var minutes = duration.getMinutes()
  console.log("Duration: ", minutes,":",seconds);
  //console.log("POST: ", req.file);
  const file = req.file
  if (!file) {
    const error = new Error('Please upload a file')
    error.httpStatusCode = 400
    return next(error)
  }
  res.send(file)

})

app.listen(port, () => console.log('Server started on port: ', port));
