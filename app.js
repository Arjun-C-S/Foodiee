const express = require("express");
const path = require("path");
const session = require("express-session");
const dotenv = require("dotenv");
const morgan = require("morgan");

const connectDB = require("./database/connection");

const adminDatabase = require("./models/adminModel");

dotenv.config({ path: "config.env" });
const PORT = process.env.PORT || 8080;

// mongodb connection
connectDB();

morgan("tiny");

const app = express();

app.use(function (req, res, next) {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");
  next();
});

app.use(
  session({
    secret: "key",
    resave: false,
    saveUninitialized: false,
  })
);

app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.use(adminDatabase); //create admin collection (only one time)

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
