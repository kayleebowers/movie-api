const express = require("express");
morgan = require("morgan");

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

// get list of top movies from /movies endpoint
app.get("/movies", (req, res) => {
  res.json(topMovies);
});

// get textual default at / route
app.get('/', (req, res) => {
    res.send('Welcome to the Movies API');
})

// app.get('/index.html', (req, res) => {
//     res.end('Index file');
// })

app.listen(8080, () => {
    console.log('App is listening on port 8080');
})