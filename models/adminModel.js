const mongoose = require("mongoose");

var schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: String,
});

const Admin = mongoose.model("Admin", schema);

Admin.find().then((data) => {
  if (data.length == 0) {
    Admin.create({
      // Inserting value of only one key
      name: "Admin",
      email: "admin@gmail.com",
      password: "123456789",
    })
      .then((data) => {
        console.log("admin credentials inserted");
      })
      .catch((err) => {
        console.log(err.message);
      });
  }
});

module.exports = Admin;
