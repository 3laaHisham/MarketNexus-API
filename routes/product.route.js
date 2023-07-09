import express from "express";
const router = express.Router();

import controller from "../controllers";

import { productService } from "../services";
const { getProducts, addProduct, updateProduct, deleteProduct } =
  productService;

import { isAuthenticated, isAuthorized, isResourceOwner } from "../middlewares";

router.get("/:id", controller(getProducts)({ _id: id }));

router.get("/", controller(getProducts)(req.query));

router.get(
  "/top10-cheapest",
  controller(getProducts)({
    limit: 10,
    sort: { price: 1 },
    category: req.query.category,
  })
);

router.get(
  "/top10-rated",
  controller(getProducts)({
    limit: 10,
    sort: { avgRating: -1 },
    category: req.query.category,
  })
);

router.get(
  "/most10-sold",
  controller(getProducts)({
    limit: 10,
    sort: { noSold: -1 },
    category: req.query.category,
  })
);

router.use(isAuthenticated, isAuthorized("seller"));

router.post("/", controller(addProduct)(req.body));

router.use(isResourceOwner("Product", req.params.id, req.user.id));

router.put("/:id", controller(updateProduct)({ _id: req.params.id }, req.body));

router.delete("/:id", controller(deleteProduct)({ _id: req.params.id }));

export default router;
