import express from "express";
const router = express.Router();

import controller from "./controller";

import { userService } from "../services";
const { getUser, getUsers, updateUser, deleteUser } = userService;

import { isAuthenticated } from "../middlewares";

router.get("/", (req, res) => controller(res)(getUsers)(req.query));

router.get("/:id", (req, res) => controller(res)(getUser)(req.params.id));

// The following routes needs authentication.
router.use(isAuthenticated);

router.get("/me", async (req, res) => controller(res)(getUser)(req.user.id));

router.delete("/me", async (req, res) =>
  controller(res)(deleteUser)(req.user.id)
);

router.put("/me", (req, res) =>
  controller(res)(updateUser)(req.user.id, req.body.user)
);

router.delete("/:id", isAuthorized("admin"), (req, res) =>
  controller(res)(deleteUser)(req.params.id)
);

export default router;
