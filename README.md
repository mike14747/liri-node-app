# liri-node-app

* The user will input 'node liri' into the terminal... plus one of these 4 possible parameters:
  * concert-this
    * this parameter requires an additional secondary artist/band name parameter
    * sample of this completed input would be: 'node liri concert-this grand funk'
  * movie-this
    * this parameter accepts an additional secondary movie name parameter
    * without this additional secondary parameter, results for the movie 'Mr. Nobody' will be displayed
    * sample of this completed input would be: 'node liri movie-this blues brothers'
  * spotify-this-song
    * this parameter accepts an additional secondary song name parameter
    * without this additional secondary parameter, results for the song 'The Sign' by 'Ace of Bass' will be displayed
    * sample of this completed input would be: 'node liri spotify-this-song carouselambra'
  * do-what-it-says
    * this parameter causes liri to ignore any additional parameters
    * this full input should be: 'node liri do-what-it-says'
    * this will read the file 'random.txt'... whose contents include one of the first 3 parameters, plus one of the additional secondary ones

* Upon entering the above input into the terminal, the following sequence of events will occur:
  * User validation will check that one of the 4 approved parameters has been entered
    * if one of the approved parameters hasn't been entered, an error message will be displayed listing the acceptable parameters
  * In the case of the first 3 acceptable parameters, a check for the secondary parameters will be made
    * in the cases of 'movie-this' and 'spotify-this-song', an secondary parameter isn't required and it will default to the ones listed above if ommitted.
    * in the case of 'concert-this', if no secondary parameter is provided, an error will be displayed
    * in the case of 'do-what-it-says', no check for a secondary parameter will be made
  * Secondary parmeters can be multiple words
    * if they are multiple words, they will be concatenated into a single string... with '+' signs replacing the spaces

* Assuming there are no errors in the user input, the following will be displayed:
  * a message stating no results found for the user's input
  * 'concert-this' will show all available concerts from BandsInTown for the artist/band name with this information:
    * venue
    * city, state/country
    * date (formatted using moment.js)
  * 'movie-this' will show the first movie match from the OMDB database with this information:
    * Title
    * Year of release
    * IMDB rating
    * Rotten Tomatoes rating
    * Country of production
    * Language
    * Movie plot
    * Actors
  * 'spotify-this-song' will show the first 5 song name matches from Spotify with the following information:
    * Artist
    * Song Name
    * Spotify preview link
    * Album Name
  * 'do-what-t-says' will do one of the previous 3 tasks... depending upon what the contents of 'random.txt' are

* A log file (log.txt) is included and it logs everything that gets console logged to the terminal

* 'concert-this' and 'movie-this' use 'axios' to make their API calls, while 'spotify-this-song' uses 'node-spotify-api'