const express = require("express"),
  mongoose = require("mongoose"),
  models = require("./models.js"),
  morgan = require("morgan"),
  fs = require("fs"),
  uuid = require("uuid"),
  bodyParser = require("body-parser"),
  path = require("path");

const app = express(),
  //declare models
  Movies = models.Movie,
  Users = models.User;

//set up bodyParser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//require cors
const cors = require("cors");
app.use(cors());

//require express-validator
const { check, validationResult } = require("express-validator");

//require auth and passport
let auth = require("./auth")(app);
const passport = require("passport");
require("./passport");

//connect mongoose to online database
mongoose.connect("process.env.CONNECTION_URI", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
// connect mongoose to local database
// mongoose.connect("mongodb://localhost:27017/moviesdb", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

//create write stream
const logStream = fs.createWriteStream(path.join(__dirname, "log.txt"), {
  flags: "a",
});

//use Morgan to log requests to server
app.use(morgan("common", { stream: logStream }));

// Return a list of ALL movies to the user; — GET — /movies
app.get(
  "/movies",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.find()
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

// get movie data by title — GET — /movies/:title
app.get(
  "/movies/:title",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ Title: req.params.title })
      .then((movie) => {
        res.json(movie);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

// Return data about a genre (description) by name (e.g., “Thriller”); —GET — /movies/genres/:name
app.get(
  "/genres/:name",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.find({ "Genre.Name": req.params.name })
      .then((movie) => {
        res.status(200).json(movie[0].Genre["Description"]);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

// Return data about a director (bio, birth year, death year) by name; —GET /movies/directors
app.get(
  "/directors/:name",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Movies.findOne({ "Director.Name": req.params.name })
      .then((movie) => {
        res.status(200).json(movie.Director);
      })
      .catch((error) => {
        console.error(error);
        res.status(400).send("Error: " + error);
      });
  }
);

// Allow new users to register; —POST /register
// Expected body format:
// {
//   ID: Integer,
//   Username: String,
//   Password: String,
//   Email: String,
//   Birthday: Date
// }
app.post(
  "/register",
  //validate inputs on server side
  [
    check(
      "Username",
      "Username must be at least 5 characters and can only use alphanumeric characters"
    )
      .isAlphanumeric()
      .isLength({ min: 5 }),
    check("Password", "Password is required").not().isEmpty(),
    check("Email", "Valid email is required").not().isEmpty().isEmail(),
  ],
  (req, res) => {

    //check validation object for errors
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    let hashedPassword = Users.hashPassword(req.body.Password);
    Users.findOne({ Username: req.body.Username })
      //check if user already exists
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + " already exists");
        } else {
          Users.create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday,
          })
            .then((user) => {
              res.status(201).json(user);
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send("Error: " + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

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

app.put(
  "/register/:Username",
  passport.authenticate("jwt", { session: false }),
  //validate user input in req body
  [
    check("Username", "Username must contain at least 5 characters that are all alphanumeric").isAlphanumeric().isLength({ min: 5 }),
    check("Password", "Password is required").not().isEmpty(),
    check("Email", "Must use valid email").isEmail(),
    check("Birthday", "Date must be valid").isDate()
  ],
  (req, res) => {
    //check validation object for errors
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    Users.findOneAndUpdate({ Username: req.params.Username })
      .then((user) => {
        let hashedPassword = Users.hashPassword(req.body.Password);

        user.Username = req.body.Username;
        user.Password = hashedPassword;
        user.Email = req.body.Email;
        user.Birthday = req.body.Birthday;

        return res.status(201).json(user);
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send("Error: " + error);
      });
  }
);

// Allow users to add a movie to their list of favorites —POST /movies/:title
app.post(
  "/register/:Username/movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username })
      .then((user) => {
        user.Favorites = user.Favorites.push(req.params.MovieID);
        return res.status(201).json(user);
      })
      .catch((error) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// Allow users to remove a movie from their list of favorites (showing only a text that a movie has been removed); —DELETE /favorites/:title
app.delete(
  "/register/:Username/movies/:MovieID",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username })
      .then((user) => {
        let index = user.Favorites.indexOf(req.params.MovieID);
        //check if movie is in their favorites list
        if (index > -1) {
          user.Favorites.splice(index, 1);
          return res.status(201).json(user);
        } else {
          return res.status(400).send("Movie ID not found");
        }
      })
      .catch((error) => {
        console.error(err);
        res.status(500).send("Error: " + err);
      });
  }
);

// Allow existing users to deregister by username —DELETE /register/:Username
app.delete(
  "/register/:Username",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Users.findOneAndRemove({ Username: req.params.Username })
      .then((user) => {
        if (!user) {
          res.status(400).send(req.params.Username + " was not found");
        } else {
          res.status(200).send(req.params.Username + " was deleted");
        }
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send("Error: " + error);
      });
  }
);

// get textual default at / route
app.get("/", (req, res) => {
  res.sendFile("public/documentation.html", { root: __dirname });
});

// Use express.static to serve your “documentation.html” file from the public folder
app.use(express.static("public"));

// create error-handling middleware function
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong");
});

app.listen(8080, () => {
  console.log("App is listening on port 8080");
});
