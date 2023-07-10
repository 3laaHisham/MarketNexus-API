const express = require("express");
const router = express.Router();
const controller = require("../controllers");

const { isAuthenticated, isAuthorized } = require("../middlewares");

router.post("/", isAuthenticated, (req, res) => controller(res)(getOrderById)(req.body.order));
router.get("/", isAuthenticated, (req, res) => controller(res)(getAllOrders)());


router.get("/:id", isAuthenticated, (req, res) => controller(res)(getOrderById)(req.params.id));
//the order of the next functions is important 
router.put("/:id/cancel", isAuthenticated, (req, res) => controller(res)(cancelOrder)(req.params.id));
router.put("/:id/:status", isAuthorized("admin"), (req, res) => controller(res)(updateOrderStatus)(req.params.id, req.params.status));

module.exports = router;
