require("dotenv").config();

var axios = require("axios");

var fs = require("fs");

var Spotify = require('node-spotify-api');
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);

var movieName = "";
var artistName = "";
var bitURL = "";
var omdbURL = "";
var dataArray = [];
var formattedString = "";

function concertThis(txt) {
    if (txt) {
        artistName = txt;
    } else if (process.argv[3]) {
        for (let i = 3; i < process.argv.length; i++) {
            if (i == 3) {
                artistName = process.argv[i];
            } else if (i > 3) {
                artistName += "+" + process.argv[i];
            }
        }
    } else {
        console.log("You didn't enter band/artist name.");
        return;
    }
    bitURL = "https://rest.bandsintown.com/artists/" + artistName + "/events?app_id=codingbootcamp";
    axios.get(bitURL).then(
        function (response) {
            console.log("\n");
            if (response.data.length > 0) {
                console.log("Showing info for: " + artistName + " concerts.\n----------------------------------");
                response.data.forEach(function (obj) {
                    console.log(obj.venue.name);
                    console.log(obj.venue.city + ", " + obj.venue.region);
                    console.log(obj.datetime + "\n");
                });
            } else {
                console.log("No shows found for the band/artist: " + artistName);
            }
        }
    )
}

function spotifyThis(txt) {

    spotify.search({ type: 'track', query: txt }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
    });
}

function movieThis(txt) {
    if (txt) {
        movieName = txt;
    } else if (process.argv[3]) {
        for (let i = 3; i < process.argv.length; i++) {
            if (i == 3) {
                movieName = process.argv[i];
            } else if (i > 3) {
                movieName += "+" + process.argv[i];
            }
        }
    } else {
        movieName = "Mr. Nobody";
        console.log("You didn't enter a movie name, so we're showing you info about: " + movieName);
    }
    omdbURL = "http://www.omdbapi.com/?t=" + movieName + "&apikey=trilogy";
    axios.get(omdbURL).then(
        function (response) {
            console.log("\n");
            if (response.data.Response == "True") {
                console.log("Title: " + response.data.Title);
            console.log("Year of release is: " + response.data.Year);
            console.log("IMDB rating: " + response.data.Ratings[0].Value);
            console.log("Rotten Tomatoes rating: " + response.data.Ratings[1].Value);
            console.log("Country of production: " + response.data.Country);
            console.log("Language: " + response.data.Language);
            console.log("Movie plot: " + response.data.Plot);
            console.log("Actors: " + response.data.Actors);
            } else {
                console.log("No movie was found matching your search criteria (" + movieName + ")");
            }
            
        }
    )
}

if (process.argv[2] === "concert-this") {
    concertThis();
} else if (process.argv[2] === "spotify-this-song") {
    spotifyThis();
} else if (process.argv[2] === "movie-this") {
    movieThis();
} else if (process.argv[2] === "do-what-it-says") {
    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        }
        dataArray = data.split(",");
        formattedString = dataArray[1].slice(1, dataArray[1].length-1).replace(" ", "+");
        if (dataArray[0] === "concert-this") {
            concertThis(formattedString);
        } else if (dataArray[0] === "spotify-this-song") {
            spotifyThis(formattedString);
        } else if (dataArray[0] === "movie-this") {
            movieThis(formattedString);
        }
    });
} else {
    console.log("Your search type is not supported. Please use only 'concert-this', 'spotify-this-song', 'movie-this' or 'do-what-it-says' as the first parameter");
}

// spotify-this-song,"I Want it That Way"
// movie-this,"Blues Brothers"
// concert-this,"Drake"