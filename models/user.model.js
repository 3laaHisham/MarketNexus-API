const mongoose = require("mongoose");
const validator = require("validator");
// const {addressObject} = require("../utils/commonObjects");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    validate(value) {
      return validator.isEmail(value);
    },
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 8,
    maxlength: 50,
  },
  address: {
    type: [String],
    required: true,
    trim: true,
    minlength: 3,
    maxlength: 50,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;

// suggested
// address filef
// address:[addressObject],