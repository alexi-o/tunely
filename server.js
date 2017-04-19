// SERVER-SIDE JAVASCRIPT

//require express in our app
var express = require('express');
// generate a new express app and call it 'app'
var app = express();

//Require body body-parser
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// serve static files from public folder
app.use(express.static(__dirname + '/public'));

/************
 * DATABASE *
 ************/

 var db = require('./models');

/**********
 * ROUTES *
 **********/

/*
 * HTML Endpoints
 */

app.get('/', function homepage (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});

/*
 * JSON API Endpoints
 */
app.get('/api', function api_index (req, res){
  res.json({
    message: "Welcome to tunely!",
    documentation_url: "https://github.com/tgaff/tunely/api.md",
    base_url: "http://tunely.herokuapp.com",
    endpoints: [
      {method: "GET", path: "/api", description: "Describes available endpoints"}
    ]
  });
});

app.get('/api/albums', function album_index(req, res){
  db.Album.find({}, function(err, albums) {
  res.json(albums);
  });
});
//GET /api/albums/:album_id/:id
app.get('/api/albums/:id', function (req, res){
  var id = req.params.id;
  db.Album.findOne({_id: id}, function (err, album) {
    res.json(album);
  });
});

app.get('/api/albums/:album_id/songs', function(req, res){
  var body = req.body;
  var albumId = req.params.album_id;
  db.Album.findOne({_id: albumId}, function(err, album) {
    res.json(album.songs);
  });
});

app.post('/api/albums', function album_create(req, res){
  var body = req.body;
  console.log(body);
  body.genres = body.genres.split(', ');
  db.Album.create(body, function(error, album) {
  console.log(album);
  });
});

app.post('/api/albums/:id/songs', function (req,res){
  db.Album.findById(req.params.id, function(err, album){
    db.Album.findById(req.params.id)
    .exec(function(err, album){
        if(err) {
          console.log(err);
        } else {
          album.songs.push(req.body);
          album.save(console.log("Added new song"));
        } 
      res.json(album);
      console.log(album + "New Song");
    });
  });
});

/**********
 * SERVER *
 **********/

// listen on port 3000
app.listen(process.env.PORT || 3000, function () {
  console.log('Express server is running on http://localhost:3000/');
});
