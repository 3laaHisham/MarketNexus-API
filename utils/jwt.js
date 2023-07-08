import jwt from "jsonwebtoken";

require("dotenv").config();
const TOKEN_SECRET = process.env.TOKEN_SECRET;

const generateToken = async (userId, userRole) =>
  jwt.sign({ id: userId, role: userRole }, TOKEN_SECRET);

const verifyToken = async (token) => jwt.verify(token, TOKEN_SECRET);

export default { generateToken, verifyToken };
