function validateForm(req, res, next) {
  const { name, description } = req.body || {};
  const price = Number(req.body?.price);
  const stock = Number(req.body?.stock);

  let errors = [];

  if (price === null || typeof price !== "number" || price <= 0) {
    errors.push("Invalid input, price must be a positive number! ");
  }
  if (name === undefined || typeof name !== "string" || name.trim() === "") {
    errors.push("Invalid input name cannot be an empty space ");
  }
  if (stock === undefined || typeof stock !== "number" || stock < 1) {
    errors.push("Invalid input needs to be a number greater than 1");
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: errors });
  }

  res.locals.name = name;
  res.locals.price = price;
  res.locals.stock = stock;
  res.locals.description = description;
  next();
}

export default validateForm;
