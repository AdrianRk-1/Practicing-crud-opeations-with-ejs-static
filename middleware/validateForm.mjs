function validateForm(req, res, next) {
  const { name, colors, category } = req.body || {};
  const price = Number(req.body?.price);

  let errors = [];

  if (price === null || typeof price !== "number" || price <= 0) {
    errors.push("Invalid input, price must be a positive number! ");
  }
  if (name === undefined || typeof name !== "string" || name.trim() === "") {
    errors.push("Invalid input name cannot be an empty space ");
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: errors });
  }

  res.locals.name = name;
  res.locals.price = price;
  res.locals.colors = colors;
  res.locals.category = category;
  next();
}

export default validateForm;
