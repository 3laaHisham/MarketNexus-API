const express = require("express");
const router = express.Router();

const controller = require("../controllers");

const { cartService } = require("../services");
const { isAuthenticated, isAuthorized } = require("../middlewares");

router.get("/", isAuthenticated, (req, res) => controller(res)(getCurrentCart)(req.user.id))
router.put("/products/:id/reduce", isAuthenticated, (req, res) => controller(res)(changeCountOfProduct)(req.params.id, -1, req.user.id));
router.put("/products/:id/increase", isAuthenticated, (req, res) => controller(res)(changeCountOfProduct)(req.params.id, 1, req.user.id));
router.post("/products", isAuthenticated, (req, res) => controller(res)(addProduct)(req.user.id, req.body.product));
router.delete(":id", isAuthenticated, (req, res) => controller(res)(deleteCurrentCart)(req.params.id));
router.delete("/products/:id", isAuthenticated, (req, res) => controller(res)(deleteProduct)(req.params.id, req.user.id));

module.exports = router;
