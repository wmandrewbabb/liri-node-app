require("dotenv").config();

var twitter = require("twitter");
var Spotify = require("node-spotify-api");
const keys = require("./keys.js");
var request = require("request");
var fs = require("fs");

//Twitter Keys
var client = new twitter(keys.twitter);
//Spotify Keys
var spotify = new Spotify(keys.spotify);


//------------------------

var search = process.argv[2];
var term = process.argv.slice(3).join(" ");
// var div = "\n====SEARCH==========\n"; on second thought I'm not going to go for the appendFile stuff this week



var params = {
    screen_name: 'githubdemo'
}

//Here we get out tweets

function getTweets() {
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            tweets.reverse().forEach(element => {
                console.log(`================\n${element.text}\n${element.created_at}\n`);
            });

        }
    })
};

//Spotify API magic
function getSpotify() {

    if (term === "") {
        term = "The Sign";
    }
    
    spotify.search({
        type: 'track',
        query: term,
        limit: 1
    }, function (err, data) {
        if (!err) {

            var songObj = data.tracks.items[0];
            var artistName = songObj.album.artists[0].name;
            console.log(`Artist: ${artistName}\nSong title: ${data.tracks.items[0].name}\nAlbum Name: ${songObj.album.name}\nPreview URL: ${songObj.preview_url}`);
            
        } else {

            console.log(`Error: ${err}`);

        }
    });
};

//OMDB API call
function getOMDB() {

    if (term === "") {
        term = "Mr. Nobody";
    }

    request(`http://www.omdbapi.com/?t=${term}&apikey=trilogy`, function (err, response, body) {
        if (!err && response.statusCode === 200) {

            var movieObj = JSON.parse(body);

            if(movieObj.Title == null){movieObj.Title = "---";}
            if(movieObj.Year == null){movieObj.Year = "---";}
            if(movieObj.Ratings[0] == null){movieObj.Ratings[0] = "---";}
            if(movieObj.Ratings[0].Value == null){movieObj.Ratings[0].Value = "---";}
            if(movieObj.Ratings[1] == null){movieObj.Ratings[1] = "---";}
            if(movieObj.Ratings[1].Value == null){movieObj.Ratings[1].Value = "---";}
            if(movieObj.Country == null){movieObj.Country = "---";}
            if(movieObj.Language == null){movieObj.Language = "---";}
            if(movieObj.Plot == null){movieObj.Plot = "---";}
            if(movieObj.Actors == null){movieObj.Actors = "---";}

            console.log(`\nTitle: ${movieObj.Title} Released: ${movieObj.Year}\nIMDB Rating: ${movieObj.Ratings[0].Value} Rotten Tomtoes Rating: ${movieObj.Ratings[1].Value}\nProduced in: ${movieObj.Country} Language(s): ${movieObj.Language}\nPlot: ${movieObj.Plot}\n\nActors: ${movieObj.Actors}`);

        }
    });
};

//Opens the text file and reads what's inside, triggering a command

function getTXTandstop() {

        var text = fs.readFileSync("./random.txt").toString('utf-8');
        var textByComma = text.split(",")
        search = textByComma[0];
        term = textByComma[1];
        
        liri();

};



function liri() {
    switch (search) {
        case "my-tweets":
            getTweets();
            break;
        case "spotify-this-song":
            getSpotify();
            break;
        case "movie-this":
            getOMDB();
            break;
        case "do-what-it-says":
            getTXTandstop();
            break;
    }
}

liri();
