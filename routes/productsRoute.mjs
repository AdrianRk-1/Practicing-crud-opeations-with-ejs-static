import express from "express";
import productsList from "../data/productData.mjs";
import validateForm from "../middleware/validateForm.mjs";
import findProduct from "../middleware/findProduct.mjs";

const productRoute = express.Router();

productRoute.get("/", (req, res, next) => {
  res.json(productsList.products);
});

productRoute.post("/", express.json(), validateForm, (req, res, next) => {
  productsList.products.push({
    id: productsList.nextId++,
    name: res.locals.name,
    price: res.locals.price,
    stock: res.locals.stock,
    description: res.locals.description,
  });

  res.status(201).json({ status: "Created new product" });
});

productRoute.delete("/:id", findProduct, (req, res, next) => {
  productsList.products = productsList.products.filter(
    (p) => p.id !== res.locals.product.id,
  );

  console.log(productsList.products);
  res.status(204).json({ status: "Deleted succesfully" });
});
export default productRoute;
