require("dotenv").config();

//all these require variables...
var request = require("request");
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var keys = require("./keys.js");
var fs = require("fs")

//These hold our sensitive API keys and tokens
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
var twitterId = 3422591799;
var twitPath = 'https://api.twitter.com/1.1/statuses/show.json?id='
//These hold user arguments
var command = process.argv[2];
var queryArr = [];

//For loops pushes song/movie names into queryArr
for (var i = 3; i < process.argv.length; i++) {
    queryArr.push(process.argv[i])
}

//iput joins queryArr with a '+' sign in between
var input = queryArr.join('+')

console.log(input);

//Executes depending on command
if (command === 'my-tweets') {
    tweetTweet();
}
else if (command === 'spotify-this-song') {
    thisSong();
}
else if (command === 'movie-this') {
    movies();
}
else if (command === 'do-what-it-says') {
    doSay();
}
else { console.log("I don't understand that command") }

//logs commands to log.txt
logData();


//Twitter function

function tweetTweet() {
    var params = { screen_name: 'eclecticbromest' };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            for (i = 0; i < tweets.length; i++) {
                console.log([i + 1] + ': Tweet: ' + tweets[i].text);
                console.log('Timestamp: ' + tweets[i].created_at)
            };
        }
    });
}

//spotify-this-song function
function thisSong() {
    spotify.search({ type: 'track', query: input, limit: 1, market: 'US' }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        console.log('Artist: ' + data.tracks.items[0].album.artists[0].name);
        console.log('Title: ' + data.tracks.items[0].name);
        console.log('Preview: ' + data.tracks.items[0].external_urls.spotify);
        console.log('Album Name: ' + data.tracks.items[0].album.name);
    });
}


//movie-this function
function movies() {
    var omdbUrl = "http://www.omdbapi.com/?t=" + input + "&y=&plot=short&apikey=trilogy";

    console.log(omdbUrl);
    if (input) {
        request(omdbUrl, function (error, response, body) {

            // If the request is successful
            if (!error && response.statusCode === 200) {

                console.log("Title: " + JSON.parse(body).Title);
                console.log("Year: " + JSON.parse(body).Year);
                console.log("IMDB Rating: " + JSON.parse(body).Ratings[0].Value);
                console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
                console.log("Country: " + JSON.parse(body).Country);
                console.log("Language: " + JSON.parse(body).Language);
                console.log("Plot: " + JSON.parse(body).Plot);
                console.log("Actors: " + JSON.parse(body).Actors);
            }
        });

    }
    else {
        console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/")
        console.log("It's on Netflix!")
    }
}

function doSay() {
    fs.readFile('random.txt', 'utf-8', function (error, data) {
        // If the code experiences any errors it will log the error to the console.
        if (error) {
            return console.log(error);
        }
        var dataArr = data.split(",");
        console.log(dataArr);

        command = dataArr[0];
        input = dataArr[1];
        thisSong();
    })
}

function logData() {
    if (input){
        fs.appendFile("log.txt", command + ": " + input + ", ", function(err) {
            if (err) {
              return console.log(err);
            }
          });
    }
    else {
    fs.appendFile("log.txt", command + ", ", function(err) {
        if (err) {
          return console.log(err);
        }
      });
    }
}