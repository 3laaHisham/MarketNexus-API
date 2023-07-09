import express from "express";
const router = express.Router();

import controller from "../controllers";

import { userService } from "../services";
const { getUsers, updateUser, deleteUser } = userService;

import { isAuthenticated } from "../middlewares";

router.get("/:id", controller(getUsers)({ _id: req.params.id }));

router.get("/", controller(getUsers)(req.query));

// The following routes needs authentication.
router.use(isAuthenticated);

router.get("/me", controller(getUsers)({ _id: req.user.id }));

router.put(
  "/me",
  (controller = updateUser({ _id: req.user.id }, req.body.user))
);

router.delete("/me", controller(deleteUser)({ _id: req.user.id }));

router.delete(
  "/:id",
  isAuthorized("admin"),
  controller(deleteUser)({ _id: req.params.id })
);

export default router;
