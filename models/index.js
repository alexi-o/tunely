var mongoose = require("mongoose");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost/tunely");


module.exports.Album = require('./album.js');
module.exports.Song = require('./songs.js');
