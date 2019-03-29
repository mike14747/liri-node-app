require("dotenv").config();
var axios = require("axios");
var fs = require("fs");
var spotify = require('node-spotify-api');
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);

var movieName = "";
var artistName = "";
var bitURL = "";
var omdbURL = "";

function concertThis(txt) {
    console.log(txt);
    bitURL = "https://rest.bandsintown.com/artists/" + txt + "/events?app_id=codingbootcamp";
}

function spotifyThis(txt) {
    console.log(txt);
    spotify.search({ type: 'track', query: txt }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        console.log(data);
    });
}

function movieThis(txt) {
    omdbURL = "http://www.omdbapi.com/?t=" + txt + "&y=&plot=short&apikey=trilogy";
    axios.get(omdbURL).then(
        function (response) {
            console.log("Year of release is: " + response.data.Year);
        }
    );
    /*
    * Title of the movie.
    * Year the movie came out.
    * IMDB Rating of the movie.
    * Rotten Tomatoes Rating of the movie.
    * Country where the movie was produced.
    * Language of the movie.
    * Plot of the movie.
    * Actors in the movie.
    */
}

if (process.argv[2] === "concert-this") {
    for (var i = 2; i < process.argv.length; i++) {
        if (i == 2) {
            artistName = process.argv[i];
        } else if (i > 2) {
            artistName += "+" + process.argv[i];
        }
    }
    concertThis(artistName);
} else if (process.argv[2] === "spotify-this-song") {
    console.log(process.argv[2]);

} else if (process.argv[2] === "movie-this") {
    for (var i = 2; i < process.argv.length; i++) {
        if (i == 2) {
            movieName = process.argv[i];
        } else if (i > 2) {
            movieName += "+" + process.argv[i];
        }
    }
    movieThis(movieName);
} else if (process.argv[2] === "do-what-it-says") {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        var dataArray = data.split(",");
        if (dataArray[0] === "concert-this") {
            concertThis(dataArray[1]);
        } else if (dataArray[0] === "spotify-this-song") {
            spotifyThis(dataArray[1]);
        } else if (dataArray[0] === "movie-this") {
            movieThis(dataArray[1]);
        }
    });
} else {
    console.log("Your search type is not supported. Please use only 'concert-this', 'spotify-this-song', 'movie-this' or 'do-what-it-says' as the first parameter");
}