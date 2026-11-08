import express from "express";
import productsList from "../data/productData.mjs";

const productRoute = express.Router();

productRoute.get("/", (req, res, next) => {
  res.json(productsList);
});

export default productRoute;
