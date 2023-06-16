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
  },
  {
    title: "The Godfather",
    director: "Francis Ford Coppola",
  },
  {
    title: "The Dark Knight",
    director: "Christopher Nolan",
  },
  {
    title: "12 Angry Men",
    director: "Sidney Lumet",
  },
  {
    title: "Schindler's List",
    director: "Steven Spielberg",
  },
  {
    title: "The Lord of the Rings: The Return of the King",
    director: "Peter Jackson",
  },
  {
    title: "Pulp Fiction",
    director: "Quentin Tarantino",
  },
  {
    title: "The Good, the Bad and the Ugly",
    director: "Sergio Leone",
  },
  {
    title: "Spider-Man: Across the Spider-Verse",
    director: ["Joaquim Dos Santos", "Kemp Powers", "Justin K. Thompson"],
  },
  {
    title: "Forrest Gump",
    director: "Robert Zemeckis",
  },
];

//create write stream
const logStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'});

//use Morgan to log requests to server
app.use(morgan("common", {stream: logStream}));

// To Do
// Return a list of ALL movies to the user;
// Return data (description, genre, director, image URL, whether it’s featured or not) about a single movie by title to the user;
// Return data about a genre (description) by name/title (e.g., “Thriller”);
// Return data about a director (bio, birth year, death year) by name;
// Allow new users to register;
// Allow users to update their user info (username);
// Allow users to add a movie to their list of favorites (showing only a text that a movie has been added—more on this later);
// Allow users to remove a movie from their list of favorites (showing only a text that a movie has been removed—more on this later);
// Allow existing users to deregister (showing only a text that a user email has been removed—more on this later).

// get list of top movies from /movies endpoint
app.get("/movies", (req, res) => {
  res.json(topMovies);
});

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