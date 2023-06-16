const express = require("express"),
  morgan = require("morgan"),
  fs = require('fs'),
  uuid = require('uuid'),
  path = require('path');

const app = express();

let topMovies = [
  {
    title: "The Shawshank Redemption",
    director: "Frank Darabont",
    description: "Over the course of several years, two convicts form a friendship, seeking consolation and, eventually, redemption through basic compassion.",
    genre: "Drama",
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/8/81/ShawshankRedemptionMoviePoster.jpg"
  },
  {
    title: "The Godfather",
    director: "Francis Ford Coppola",
    description: "Don Vito Corleone, head of a mafia family, decides to hand over his empire to his youngest son Michael. However, his decision unintentionally puts the lives of his loved ones in grave danger.",
    genre: ["Crime", "Drama"],
    imageUrl: "https://commons.wikimedia.org/wiki/File:The_Godfather_logo.svg#/media/File:The_Godfather_logo.svg"
  },
  {
    title: "The Dark Knight",
    director: "Christopher Nolan",
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    genre: ["Action", "Crime", "Drama"],
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/1/1c/The_Dark_Knight_%282008_film%29.jpg"
  },
  {
    title: "12 Angry Men",
    director: "Sidney Lumet",
    description: "The jury in a New York City murder trial is frustrated by a single member whose skeptical caution forces them to more carefully consider the evidence before jumping to a hasty verdict.",
    genre: ["Crime", "Drama"],
    imageUrl: "https://upload.wikimedia.org/wikipedia/commons/b/b5/12_Angry_Men_%281957_film_poster%29.jpg"
  },
  {
    title: "Schindler's List",
    director: "Steven Spielberg",
    description: "In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution by the Nazis.",
    genre: ["Biography", "Drama", "History"],
    imageUrl: "https://upload.wikimedia.org/wikipedia/en/3/38/Schindler%27s_List_movie.jpg"
  }
];

//create write stream
const logStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'});

//use Morgan to log requests to server
app.use(morgan("common", {stream: logStream}));

// Return a list of ALL movies to the user; — GET — /movies
app.get("/movies", (req, res) => {
  res.json(topMovies);
});

// Return data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title to the user; — GET — /movies/titles

// Return data about a genre (description) by name/title (e.g., “Thriller”); —GET — /movies/genres
// Return data about a director (bio, birth year, death year) by name; —GET /movies/directors
// Allow new users to register; —POST /register 
// Allow users to update their user info (username); —PUT /update_information
// Allow users to add a movie to their list of favorites (showing only a text that a movie has been added) —POST /add
// Allow users to remove a movie from their list of favorites (showing only a text that a movie has been removed); —DELETE /delete
// Allow existing users to deregister (showing only a text that a user email has been removed—more on this later) —DELETE /deregister


// get textual default at / route
app.get('/', (req, res) => {
    res.send('Welcome to the Movies API');
})

// Use express.static to serve your “documentation.html” file from the public folder 
app.use(express.static('public'));

// create error-handling middleware function
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong');
})

app.listen(8080, () => {
    console.log('App is listening on port 8080');
})