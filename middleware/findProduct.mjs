import productsList from "../data/productData.mjs";

function findProduct(req, res, next) {
  const id = Number(req.params.id);

  const foundProduct = productsList.products.find((p) => p.id === id);
  if (foundProduct === undefined) {
    return res.status(404).json({ error: "Product not found" });
  }

  res.locals.product = foundProduct;
  next();
}

export default findProduct;
