import express from "express";
const router = express.Router();

import controller from "./controller";

import { authService } from "../services";
const { register, login, logout, changePassword } = authService;

import { isAuthenticated } from "../middlewares";

router.post("/register", (req, res) => controller(res)(register)());
router.post("/login", (req, res) => controller(res)(login)());

router.use(isAuthenticated);

router.post("/logout", (req, res) => controller(res)(logout)());
router.put("/change-password", (req, res) => controller(res)(changePassword)());

export default router;
