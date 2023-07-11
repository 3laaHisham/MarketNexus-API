const bcrypt = require('bcryptjs');

const hashPassword = (password) => bcrypt.hash(password, 12);

const comparePasswords = (password, hashedPassword) =>
  bcrypt.compare(password, hashedPassword);

module.exports = { hashPassword, comparePasswords };
