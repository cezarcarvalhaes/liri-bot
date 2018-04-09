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

//Twitter function

function tweetTweet() {
    var params = { screen_name: 'eclecticbromest' };
    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (!error) {
            logCommand();
            var tweetData;
            console.log(tweets.length)
            for (i = 0; i < tweets.length; i++) {
                tweetData = `
                ${[i + 1]}) ${tweets[i].text}
                Timestamp: ${tweets[i].created_at}`
                console.log(tweetData)
                logData(tweetData);
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

        var text = `
        Artist: ${data.tracks.items[0].album.artists[0].name};
        Title: ${data.tracks.items[0].name};
        Preview: ${data.tracks.items[0].external_urls.spotify};
        Album Name: ${data.tracks.items[0].album.name}`;

        console.log(text);
        logCommand();
        logData(text);
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

                var text = `
                Title: ${JSON.parse(body).Title}
                Year: ${JSON.parse(body).Year}
                IMDB Rating: ${JSON.parse(body).Ratings[0].Value}
                Rotten Tomatoes Rating: ${JSON.parse(body).Ratings[1].Value}
                Country: ${JSON.parse(body).Country}
                Language: ${JSON.parse(body).Language}
                Plot: ${JSON.parse(body).Plot}
                Actors: ${JSON.parse(body).Actors}`;

                console.log(text);
                logCommand();
                logData(text);
            }
        });

    }
    else {
        var text = `
        If you haven't watched "Mr. Nobody," then you should: http://www.imdb.com/title/tt0485947/
        It's on Netflix!`;
        logCommand();
        logData(text);
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

function logCommand() {
    if (input) {
        var text = `

        ${command}: ${input}-
        `
        fs.appendFile("log.txt", text, function (err) {
            if (err) {
                return console.log(err);
            }
        });
    }
    else {
        var text2 = `
        ${command}: 
        
        `
        fs.appendFile("log.txt", command + ": ", function (err) {
            if (err) {
                return console.log(err);
            }
        });
    }
}

function logData(info) {
    fs.appendFile("log.txt", info, function (err) {
        if (err) {
            return console.log(err);
        }
    });

}
