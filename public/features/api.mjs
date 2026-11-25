/*function in chrage of handling requests, either returns the

response parsed into am object or returns an error that travels up our functions
until it meets a try catch to handle said error

*/
async function request(route, options) {
  const res = await fetch(route, options);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Http error ${res.status}`);
  }
  return res.json().catch(() => null);
}

//contains my routes and bodies in an object
export const api = {
  getProducts: () => request("/products"),
  uploadProducts: (product) =>
    request("/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    }),
  deleteProduct: (product) =>
    request(`/products/${product.id}`, { method: "DELETE" }),
  editProduct: (product, newValue) =>
    request(`/products/${product.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price: newValue }),
    }),
  getCategories: () => request("/products/api/categories"),
  queryProduct: (query) => request(`/products?${query}`),
};
