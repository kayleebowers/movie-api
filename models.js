const mongoose = require("mongoose"),
  bcrypt = require("bcrypt");

//define movie schema
let movieSchema = mongoose.Schema({
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  Genre: {
    Name: String,
    Description: String,
  },
  Director: {
    Name: String,
    Bio: String,
  },
  Actors: [String],
  ImagePath: String,
  Featured: Boolean,
});

//define user schema
let userSchema = mongoose.Schema({
  Username: { type: String, required: true },
  Password: { type: String, required: true },
  Email: { type: String, required: true },
  Birthday: Date,
  Favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Movie" }],
});

//hash password function
userSchema.statics.hashPassword = (password) => {
  return bcrypt.hashSync(password, 10);
}

//declare models
let Movie = mongoose.model("Movie", movieSchema);
let User = mongoose.model("User", userSchema);

//export models
module.exports.Movie = Movie;
module.exports.User = User;
