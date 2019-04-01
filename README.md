# liri-node-app

* The user will input 'node liri' plus one of these 4 possible second parameters:
  * concert-this
    * this parameter requires an additional artist/band parameter
    * sample of this completed input would be: 'node liri concert-this grand funk'
  * movie-this
    * this parameter requires an additional movie name parameter
    * without this additional parameter, results for the movie 'Mr. Nobody' will be displayed
    * sample of this completed input would be: 'node liri movie-this blues brothers'
  * spotify-this-song
    * this parameter requires an additional song name parameter
    * without this additional parameter, results for the song 'The Sign' by 'Ace of Bass' will be displayed
    * sample of this completed input would be: 'node liri spotify-this-song carouselambra'
  * do-what-it-says
    * this parameter cause liri to ignore any additional parameters
    * it will read the file 'randon.txt'... whose contents include one of the first 3 parameters, plus an additional one

* 