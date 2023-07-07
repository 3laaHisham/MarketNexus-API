import express from "express";
import { connect } from "mongoose";
import session from "express-session";
import { json, urlencoded } from "body-parser";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";

require("dotenv").config();

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

const app = express();

app.use(json());
app.use(urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(
  session({
    secret: "superSecret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: true,
      secure: false,
    },
  })
);

// routes
app.all("*", (req, res, next) => res.status(404).send("NOT FOUND"));

connect(MONGO_URI)
  .then(() =>
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`))
  )
  .catch((err) => console.log(err));
