import bcrypt from "bcryptjs";

const hashPassword = (password) => bcrypt.hash(password, 12);

const comparePasswords = (password, hashedPassword) =>
  bcrypt.compare(password, hashedPassword);

export default { hashPassword, comparePasswords };
