const express = require("express");
const router = express.Router();
const controller = require("../controllers");

const { isAuthenticated, isAuthorized } = require("../middlewares");

router.get("/:id", (req, res) => controller(res)(getReviewById)(req.params.id));
router.put(":/id", isAuthenticated, (req, res) => {
  controller(res)(updateReviewById)(
    req.params.id,
    req.body.message,
    body.stars
  );
});
router.delete("/:id", isAuthenticated, (req, res) => {
  controller(res)(deleteReview)(req.params.id);
});

// router.get("/product/:productID", (req, res) => controller(res)()(req.params.productID));
//TODO

router.post(":/productID", isAuthenticated, (req, res) =>
  controller(res, createNewreview)()
);
//TODO

module.exports = router;
