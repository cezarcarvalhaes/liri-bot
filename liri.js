require("dotenv").config();

var request = require("request");

var keys = require('./keys');

//These hold our sensitive API keys and tokens
// var spotify = new Spotify(keys.spotify);
// var client = new Twitter(keys.twitter);

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
    console.log('tweet tweet')
}
else if (command === 'spotify-this-song') {
    console.log('spotify')
}
else if (command === 'movie-this') {
    console.log('movies')
    movies();
}
else if (command === 'do-what-it-says') {
    console.log('doo-doo')
}
else { console.log("I don't understand that command") }




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
    else{
        console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/")
        console.log("It's on Netflix!")
    }
}