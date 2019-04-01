"use strict";

require("dotenv").config();
var axios = require("axios");
var fs = require("fs");
var moment = require("moment");
var Spotify = require('node-spotify-api');
var keys = require("./keys.js");
var spotify = new Spotify(keys.spotify);
var movieName = "";
var artistName = "";
var songName = "";
var songId = "";
var bitURL = "";
var omdbURL = "";
var dataArray = [];
var formattedString = "";
var lim = 0;
var formattedDate = "";
var secLoc = "";

function concertThis(txt) {
    if (txt || process.argv[3]) {
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
        }
        bitURL = "https://rest.bandsintown.com/artists/" + artistName + "/events?app_id=codingbootcamp";
        axios.get(bitURL).then(
            function (response) {
                console.log("\n");
                if (response.data[0].venue) {
                    console.log("Showing BandsInTown info for: '" + artistName.replace("+", " ") + "' concerts.\n");
                    response.data.forEach(obj => {
                        console.log("----------------------------------\n");
                        console.log(obj.venue.name);
                        if (obj.venue.region == "") {
                            secLoc = obj.venue.country;
                        } else {
                            secLoc = obj.venue.region;
                        }
                        console.log(obj.venue.city + ", " + secLoc);
                        formattedDate = moment(obj.datetime, "YYYY-MM-DDThh:mm:ss").format("MM/DD/YYYY");
                        console.log(formattedDate + "\n");
                    });
                } else {
                    console.log("No BandsInTown shows found for the band/artist: '" + artistName.replace("+", " ") + "'\n");
                }
            }
        )
    } else {
        console.log("\n\nYou didn't enter band/artist name.");
        return;
    }
}

function spotifyThis(txt) {
    if (txt || process.argv[3]) {
        lim = 5;
        if (txt) {
            artistName = txt;
        } else if (process.argv[3]) {
            for (let i = 3; i < process.argv.length; i++) {
                if (i == 3) {
                    songName = process.argv[i];
                } else if (i > 3) {
                    songName += "+" + process.argv[i];
                }
            }
        }
        spotify
            .search({ type: 'track', query: songName, limit: lim })
            .then(function (response) {
                console.log("\n");
                if (response.tracks.total > 0) {
                    console.log("\nShowing Spotify info for (up to 5) matches for: '" + songName.replace("+", " ") + "'.\n");
                    response.tracks.items.forEach(obj => {
                        console.log("----------------------------------\n");
                        console.log("Artist: " + obj.artists[0].name);
                        console.log("Song Name: " + obj.name);
                        console.log("Spotify preview link: " + obj.preview_url);
                        console.log("Album Name: " + obj.album.name + "\n");
                    });
                } else {
                    console.log("No Spotify results found for the song: '" + songName.replace("+", " ") + "'\n");
                }
            })
            .catch(function (err) {
                console.log(err);
            });
    } else {
        lim = 1;
        defSongName = "'The Sign' by 'Ace of Bass'";
        songId = "0hrBpAOgrt8RXigk83LLNE";
        console.log("\nYou didn't enter a song name, so we're showing you info about: " + defSongName + "\n");

        spotify
            .request("https://api.spotify.com/v1/tracks/" + songId + "?offset=1&limit=" + lim)
            .then(function (data) {
                console.log("Artist: " + data.artists[0].name);
                console.log("Song Name: " + data.name);
                console.log("Spotify preview link: " + data.preview_url);
                console.log("Album Name: " + data.album.name + "\n");
            })
            .catch(function (err) {
                console.error('Error occurred: ' + err);
            });
    }
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
        movieName = "Mr.+Nobody";
        console.log("\nYou didn't enter a movie name, so we're showing you info about: '" + movieName.replace("+", " ") + "'");
    }
    omdbURL = "http://www.omdbapi.com/?t=" + movieName + "&apikey=trilogy";
    axios.get(omdbURL).then(
        function (response) {
            console.log("\n");
            if (response.data.Response == "True") {
                console.log("Showing the first OMDB match for: '" + movieName.replace("+", " ") + "'.\n\n----------------------------------\n");
                console.log("Title: " + response.data.Title + "\n");
                console.log("Year of release is: " + response.data.Year + "\n");
                console.log("IMDB rating: " + response.data.Ratings[0].Value + "\n");
                console.log("Rotten Tomatoes rating: " + response.data.Ratings[1].Value + "\n");
                console.log("Country of production: " + response.data.Country + "\n");
                console.log("Language: " + response.data.Language + "\n");
                console.log("Movie plot: " + response.data.Plot + "\n");
                console.log("Actors: " + response.data.Actors + "\n");
            } else {
                console.log("No movie was found at OMDB matching your search criteria: '" + movieName.replace("+", " ") + "'\n");
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
        formattedString = dataArray[1].slice(1, dataArray[1].length - 1).replace(" ", "+");
        if (dataArray[0] === "concert-this") {
            concertThis(formattedString);
        } else if (dataArray[0] === "spotify-this-song") {
            spotifyThis(formattedString);
        } else if (dataArray[0] === "movie-this") {
            movieThis(formattedString);
        }
    });
} else {
    console.log("\nYour search type is not supported.\n\nPlease use only 'concert-this', 'spotify-this-song', 'movie-this' or 'do-what-it-says' as the first parameter");
}

// spotify-this-song,"I Want it That Way"
// movie-this,"Blues Brothers"
// concert-this,"Fleetwood Mac"