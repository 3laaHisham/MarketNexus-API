import express from "express";
const router = express.Router();

import controller from "../controllers";

import { authService } from "../services";
const { register, login, logout, changePassword } = authService;

import { isAuthenticated } from "../middlewares";

router.post("/register", controller(register)(req.body));

router.post(
  "/login",
  controller(login)((token = req.header.authorization), req.body)
);

router.use(isAuthenticated);

router.post("/logout", controller(logout)({ _id: req.user.id }));

router.put(
  "/change-password",
  controller(changePassword)({ _id: req.user.id }, req.body)
);

export default router;
