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
var defSongName = "";
var logStringPre = "\r\n-------------------------------------------------------\r\nSearch Criteria and Results:\r\n-------------------------------------------------------";
var logString = "";

function logData(logThis) {
    console.log(logThis);
    logStringPre += logThis;
    fs.appendFile("log.txt", logStringPre, function (err) { });
}

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
        axios.get(bitURL)
            .then(
                function (response) {
                    logString += "\r\n\r\n";
                    if (response.status === 200 && response.data[0] && response.data[0].venue) {
                        logString += "Showing BandsInTown info for: '" + artistName.replace(/\+/g, " ") + "' concerts.\r\n\r\n";
                        response.data.forEach(obj => {
                            logString += "----------------------------------\r\n\r\n";
                            logString += obj.venue.name + "\r\n";
                            if (obj.venue.region == "") {
                                secLoc = obj.venue.country;
                            } else {
                                secLoc = obj.venue.region;
                            }
                            logString += obj.venue.city + ", " + secLoc + "\r\n";
                            formattedDate = moment(obj.datetime, "YYYY-MM-DDThh:mm:ss").format("MM/DD/YYYY");
                            logString += formattedDate + "\r\n\r\n";
                        });
                        logData(logString);
                    } else {
                        logString += "No BandsInTown shows found for the band/artist: '" + artistName.replace(/\+/g, " ") + "'\r\n\r\n";
                        logData(logString);
                    }
                }
            )
            .catch(function (error) {
                logString += "\r\n\r\nAn error occurred... please try your search again.";
                logData(logString);
            });
    } else {
        logString += "\r\n\r\nYou didn't enter band/artist name.\r\n\r\n";
        logData(logString);
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
                logString += "\r\n\r\n";
                if (response.tracks.total > 0) {
                    logString += "Showing Spotify info for (up to 5) matches for: '" + songName.replace(/\+/g, " ") + "'.\r\n\r\n";
                    response.tracks.items.forEach(obj => {
                        logString += "----------------------------------\r\n\r\n";
                        logString += "Artist: " + obj.artists[0].name + "\r\n";
                        logString += "Song Name: " + obj.name + "\r\n";
                        logString += "Spotify preview link: " + obj.preview_url + "\r\n";
                        logString += "Album Name: " + obj.album.name + "\r\n\r\n";
                    });
                    logData(logString);
                } else {
                    logString += "No Spotify results found for the song: '" + songName.replace(/\+/g, " ") + "'\r\n\r\n";
                    logData(logString);
                }
            })
            .catch(function (err) {
                logString += err;
                logData(logString);
            });
    } else {
        lim = 1;
        defSongName = "'The Sign' by 'Ace of Bass'";
        songId = "0hrBpAOgrt8RXigk83LLNE";
        logString += "\r\n\r\nYou didn't enter a song name, so we're showing you info about: " + defSongName + "\r\n\r\n";

        spotify
            .request("https://api.spotify.com/v1/tracks/" + songId + "?offset=1&limit=" + lim)
            .then(function (data) {
                logString += "Artist: " + data.artists[0].name + "\r\n";
                logString += "Song Name: " + data.name + "\r\n";
                logString += "Spotify preview link: " + data.preview_url + "\r\n";
                logString += "Album Name: " + data.album.name + "\r\n\r\n";
                logData(logString);
            })
            .catch(function (err) {
                console.error('Error occurred: ' + err);
                logData(logString);
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
        logString += "\r\n\r\nYou didn't enter a movie name, so we're showing you info about: '" + movieName.replace(/\+/g, " ") + "'\r\n";
    }
    omdbURL = "http://www.omdbapi.com/?t=" + movieName + "&apikey=trilogy";
    axios.get(omdbURL).then(
        function (response) {
            logString += "\r\n\r\n";
            if (response.data.Response == "True") {
                logString += "Showing the first OMDB match for: '" + movieName.replace(/\+/g, " ") + "'.\r\n\r\n----------------------------------\r\n\r\n";
                logString += "Title: " + response.data.Title + "\r\n\r\n";
                logString += "Year of release is: " + response.data.Year + "\r\n\r\n";
                logString += "IMDB rating: " + response.data.Ratings[0].Value + "\r\n\r\n";
                logString += "Rotten Tomatoes rating: " + response.data.Ratings[1].Value + "\r\n\r\n";
                logString += "Country of production: " + response.data.Country + "\r\n\r\n";
                logString += "Language: " + response.data.Language + "\r\n\r\n";
                logString += "Movie plot: " + response.data.Plot + "\r\n\r\n";
                logString += "Actors: " + response.data.Actors + "\r\n\r\n";
                logData(logString);
            } else {
                logString += "No movie was found at OMDB matching your search criteria: '" + movieName.replace(/\+/g, " ") + "'\r\n\r\n";
                logData(logString);
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
            return logData(error);
        }
        dataArray = data.split(",");
        formattedString = dataArray[1].slice(1, dataArray[1].length - 1).replace(/ /g, "+");
        if (dataArray[0] === "concert-this") {
            concertThis(formattedString);
        } else if (dataArray[0] === "spotify-this-song") {
            spotifyThis(formattedString);
        } else if (dataArray[0] === "movie-this") {
            movieThis(formattedString);
        }
    });
} else {
    logString += "\r\n\r\nYour search type is not supported.\r\n\r\nPlease use only 'concert-this', 'spotify-this-song', 'movie-this' or 'do-what-it-says' as the first parameter\r\n\r\n";
    logData(logString);
}