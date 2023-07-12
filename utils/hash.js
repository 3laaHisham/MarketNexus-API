const bcrypt = require('bcryptjs');

const hashPassword = async (password) => bcrypt.hash(password, 12);

const comparePasswords = async (password, hashedPassword) =>
  bcrypt.compare(password, hashedPassword);

module.exports = { hashPassword, comparePasswords };
