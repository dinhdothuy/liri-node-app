require("dotenv").config();

// fs is a core Node package for reading and writing files
var fs = require("fs");

const axios = require("axios");

// Search Bands in Town for concerts ************************************

function searchArtist(artistName) {

    // var artistArr = artistName.split(" ");
    // var artist = artistArr.join("+");

    var moment = require('moment'); // call moment npm to format Date of the event later

    var queryUrl = "https://rest.bandsintown.com/artists/" + artistName + "/events?app_id=codingbootcamp";
    // Then run a request with axios to the Bands in Town API with the artist/band name specified
    // console.log(queryUrl);

    axios.get(queryUrl).then(function(response) {
        // If the request with axios is successful
        // console.log(response.data);
        for (var i = 0; i < response.data.length; i++) {
            
            console.log(
            `
            * Artist/Band: ${response.data[i].lineup}
            * Name of the venue: ${response.data[i].venue.name}
            * Venue location: ${response.data[i].venue.city}, ${response.data[i].venue.region}, ${response.data[i].venue.country}
            * Date of the Event: ${moment(response.data[i].datetime).format("MM/DD/YYYY")}
                
            `    
            );
        }   
    })
}

// Search OMDB for movies ********************************************

function searchMovie(movieName) {

    // var movieArr = movieName.split(" ");
    // var movie = movieArr.join("+");

    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
    // Then run a request with axios to the OMDB API with the movie specified
    // console.log(queryUrl);

    axios.get(queryUrl).then(function(response) {
        // If the request with axios is successful
        // console.log(response.data);
        console.log(
        `
        * Title of the movie: ${response.data.Title}
        * Year the movie came out: ${response.data.Year}
        * IMDB Rating of the movie: ${response.data.imdbRating}
        * Rotten Tomatoes Rating of the movie: ${response.data.Ratings[1].Value}
        * Country where the movie was produced: ${response.data.Country}
        * Language of the movie: ${response.data.Language}
        * Plot of the movie: ${response.data.Plot}
        * Actors in the movie: ${response.data.Actors}
        
        `
        );
    });
}

// Search Spotify for songs ****************************************************

function searchSpotify(songName) {

    var Spotify = require('node-spotify-api');
    var spotify = new Spotify({
        id: process.env.SPOTIFY_ID,
        secret: process.env.SPOTIFY_SECRET
    });
    spotify.search({ type: 'track', query: songName }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        // console.log(data.tracks.items[0].artists[0].name); 
        for (var i = 0; i < data.tracks.items.length; i++) {
            console.log(
            `
            * Artist(s): ${data.tracks.items[i].artists[0].name}
            * The song's name: ${data.tracks.items[i].name}
            * A preview link of the song from Spotify: ${data.tracks.items[i].external_urls.spotify}
            * The album that the song is from: ${data.tracks.items[i].album.name}
                
            `    
            );
        }
    });
}

// Spotify Default for songs *********************************************************
// If no song is provided then the program will default to "The Sign" by Ace of Base.

function searchSpotifyDefault() {

    var Spotify = require('node-spotify-api');
    var spotify = new Spotify({
        id: process.env.SPOTIFY_ID,
        secret: process.env.SPOTIFY_SECRET
        });
    spotify.search({ type: 'track', query: 'The Sign' }, function(err, data) { 
        if (err) {
            return console.log('Error occurred: ' + err); 
        }
        // console.log(data.tracks.items[0].artists[0].name); 
        for (var i = 0; i < data.tracks.items.length; i++) {
            if (data.tracks.items[i].artists[0].name === "Ace of Base") {
                console.log(
                `
                * Artist(s): ${data.tracks.items[i].artists[0].name}
                * The song's name: ${data.tracks.items[i].name}
                * A preview link of the song from Spotify: ${data.tracks.items[i].external_urls.spotify}
                * The album that the song is from: ${data.tracks.items[i].album.name}
                    
                `    
                );
            }
        }
    });
}

// Read random.txt file and do what it says ********************************

function doWhatItSay() {
    // It's important to include the "utf8" parameter or the code will provide stream data (garbage)
    // The code will store the contents of the reading inside the variable "data"
    fs.readFile("random.txt", "utf8", function(err, data) {
        // If the code experiences any errors it will log the error to the console.
        if (err) {
            return console.log(err);
        }

        // Check the contents of data
        //console.log(data);

        // Then split it by commas (to make it more readable)
        var dataArr = data.split(",");

        // Re-display the content as an array for later use.
        // console.log(dataArr);
        
        var askToDo = dataArr[0];  // take first part of data shows search question
        var searchName = dataArr[1]; // take first part of data shows name of movie, song, or artist/band to search
        if (askToDo === "concert-this") {  // concert-this,Cher
            searchArtist(searchName);
        } else if (askToDo === "movie-this") {  // movie-this,"Forget About It"
            searchMovie(searchName);
        } else if (askToDo === "spotify-this-song") {  // spotify-this-song,"I Want it That Way"
            searchSpotify(searchName);
        }
    });

}

// Save each command user runs to the log.txt file ********************************

function appendCommand() {

    var value = process.argv.slice(2).join(" ");  // Create variable for value of command line
    fs.appendFile("log.txt", "\n" + value, function(err) {     // then append value to log.txt
        // If the code experiences any errors it will log the error to the console.
        if (err) {
          return console.log(err);
        }
        console.log("log.txt was updated: " + value);
    });
    
    // fs.writeFile("log.txt", value, function(err) {
    //     if (err) {
    //       return console.log(err);
    //     } 
    //     console.log("log.txt was updated!");
    // });

}

// What Each Command Should Do ***********************************************************

var askToDo = process.argv[2];
// var searchName = process.argv[3]; *** This returns first word of search name only, not whole value
var searchName = process.argv.slice(3).join("+");

function toDo(askToDo, searchName) {

    if (askToDo === "concert-this") {
        if (process.argv.length === 3) { // If the user doesn't type an artist/band name, no value of process.argv[3]
            console.log("Please update name of artist/band.");
        } else {
            searchArtist(searchName);
        }
    } else if (askToDo === "movie-this") { 
        if (process.argv.length === 3) {  // If the user doesn't type a movie name in, no value of process.argv[3]
            searchName = "Mr. + Nobody";  // the program will output data for the movie 'Mr. Nobody.'
            searchMovie(searchName);
        } else {
            searchMovie(searchName);
        }
    } else if (askToDo === "spotify-this-song") {
        if (process.argv.length === 3) {  // If the user doesn't type a song name in, no value of process.argv[3]
            searchSpotifyDefault();       // the program will output data for the song "The Sign" by Ace of Base.
        } else {
            searchSpotify(searchName);
        }
    } else if (askToDo === "do-what-it-says") {
        doWhatItSay();
    } 

}

// RUN LIRI NODE APP:

toDo(askToDo, searchName);
appendCommand();
