const express = require("express");
const path = require("path");
const session = require("express-session");
const dotenv = require("dotenv");
const morgan = require("morgan");

//Customer Routes

const customerLoginRoutes = require("./routes/customerRoutes/loginRoutes");
const customerSignUpRoutes = require("./routes/customerRoutes/SignUpRoutes");
const customerHomeRoutes = require("./routes/customerRoutes/HomeRoutes");
const customerVerificationRoutes = require("./routes/customerRoutes/VerificationRoutes");

//Admin Routes

const adminLoginRoutes = require("./routes/adminRoutes/loginRoutes");
const adminHomeRoutes = require("./routes/adminRoutes/HomeRoutes");
const adminLogOutRoutes = require("./routes/adminRoutes/logOutRoutes");
const adminCategoryRoutes = require("./routes/adminRoutes/CategoryRoutes");

//Common Routes

const errorController = require("./controller/404");

const connectDB = require("./database/connection");

const adminDatabase = require("./models/adminModel");

dotenv.config({ path: "config.env" });
const PORT = process.env.PORT || 8080;

// mongodb connection
connectDB();

const app = express();

// app.use(morgan(":method :status :url'http-version'"));

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

app.use("/Customer", customerSignUpRoutes);
app.use("/Customer", customerHomeRoutes);
app.use("/Customer", customerVerificationRoutes);
app.use("/", customerLoginRoutes);

app.use("/Admin", adminLoginRoutes);
app.use("/Admin", adminHomeRoutes);
app.use("/Admin", adminCategoryRoutes);
app.use("/Admin", adminLogOutRoutes);

app.use(errorController.get404);
app.use(adminDatabase); //create admin collection (only one time)

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
