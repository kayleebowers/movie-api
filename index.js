const express = require("express"),
  mongoose = require("mongoose"),
  models = require("./models.js"),
  morgan = require("morgan"),
  fs = require('fs'),
  uuid = require('uuid'),
  bodyParser = require('body-parser'),
  path = require('path');

const app = express(),
  //declare models
  Movies = Models.Movie,
  Users = Models.User;

//set up bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//connect mongoose to database
mongoose.connect('mongodb://localhost:27017/moviesdb', {useNewUrlParser: true, useUnifiedTopology: true});

//create write stream
const logStream = fs.createWriteStream(path.join(__dirname, 'log.txt'), {flags: 'a'});

//use Morgan to log requests to server
app.use(morgan("common", {stream: logStream}));

// Return a list of ALL movies to the user; — GET — /movies
app.get("/movies", (req, res) => {
  Movies.find()
    .then((movies) => {
      res.status(201).res.json(movies)
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error: " + error);
    })
});

// get movie data by title — GET — /movies/:title
app.get("/movies/:title", (req, res) => {
  Movies.findOne({ Title: req.body.Title})
    .then((movie) => {
      res.json(movie);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error: " + error);
    })
})

// Return data about a genre (description) by name/title (e.g., “Thriller”); —GET — /movies/genres/:name
app.get("/genres/:genre", (req, res) => {
  res.status(200).send('So many genres to choose from')
})

// Return data about a director (bio, birth year, death year) by name; —GET /movies/directors
app.get("/directors/:name", (req, res) => {
  const name = req.params.name;
  let director = topMovies.find(movie => movie.director === name).director;

  if (director) {
    res.status(200).json(director);
  } else {
    res.status(400).send('No director found');
  }
})

// Allow new users to register; —POST /register 
// Expected body format: 
// {
//   ID: Integer,
//   Username: String,
//   Password: String,
//   Email: String,
//   Birthday: Date
// }
app.post("/register", (req, res) => {
  Users.findOne({ Username: req.body.Username })
    .then((user) => {
      if (user) {
        return res.status(400).send(req.body.Username + " already exists");
      } else {
        Users
          .create({
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday
          })
        .then((user) => { res.status(201).json(user) })
        .catch((error) => {
          console.error(error);
          res.status(500).send("Error: " + error)
        })
      }
    })
    .catch((error) => {
      console.error(error);
      res.status(500).send("Error: " + error)
    });
});

// Allow users to update their user info (username); —PUT /register/:name
  /* We’ll expect JSON in this format
  {
    Username: String,
    (required)
    Password: String,
    (required)
    Email: String,
    (required)
    Birthday: Date
  }*/

app.put("/register/:Username/", (req, res) => {
  Users.findOneAndUpdate({ Username: req.body.Username }, {
    $set: {
      Username: req.body.Username,
      Password: req.body.Password,
      Email: req.body.Email,
      Birthday: req.body.Birthday
    }
  }, 
  { new: true }, 
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    } else {
      res.json(updatedUser);
    }
  });
});

// Allow users to add a movie to their list of favorites —POST /movies/:title
app.post("/register/:Username/movies/:MovieID", (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username}, {
    $push: { FavoriteMovies: req.params.MovieID} 
  }, 
  { new: true },
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    } else {
      res.json(updatedUser);
    }
  });
});

// Allow users to remove a movie from their list of favorites (showing only a text that a movie has been removed); —DELETE /favorites/:title
app.delete("/register/:Username/movies/:MovieID", (req, res) => {
  Users.findOneAndUpdate({ Username: req.params.Username}, {
    $pull: { FavoriteMovies: req.params.MovieID} 
  }, 
  { new: true },
  (err, updatedUser) => {
    if(err) {
      console.error(err);
      res.status(500).send("Error: " + err);
    } else {
      res.json(updatedUser);
    }
  });
});

// Allow existing users to deregister by username —DELETE /register/:Username
app.delete("/register/:Username", (req, res) => {
  Users.findOneAndRemove({ Username: req.params.Username })
    .then((user) => {
      if(!user) {
        res.status(400).send(req.params.Username + " was not found");
      } else {
        res.status(200).send(req.params.Username + " was deleted");
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error: " + error);
    });
});

// get textual default at / route
app.get('/', (req, res) => {
  res.sendFile('public/documentation.html', { root: __dirname });
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