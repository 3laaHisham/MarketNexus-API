import jwt from "jsonwebtoken";
const TOKEN_SECRET = process.env.TOKEN_SECRET;

async function generateToken(userId, options = {}) {
  jwt.sign({ id: userId }, secret, options);
}

const verifyToken = (token) => jwt.verify(token, TOKEN_SECRET);

export default { generateToken, verifyToken };
