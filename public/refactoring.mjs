const buttonRefresh = document.getElementById("button");
const listContainer = document.getElementById("list");
const productForm = document.getElementById("create-product");
const statusText = document.getElementById("status");

const searchForm = document.getElementById("find-product");

const colorBox = document.getElementById("colors");

const colorContainer = document.getElementById("color-container");

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
const api = {
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
  queryProduct: (query) => request(`/products?${query}`),
};

/*Renders the ui elements by clearing the container each time
for each product we render its name and price and a delete button,
they get appended to our list element, and then we append them to our container

*/
function renderProducts(products) {
  listContainer.replaceChildren();

  products.forEach((p) => {
    const list = document.createElement("li");
    const productName = document.createElement("h4");
    productName.textContent = `Name: ${p.name}`;
    const productPrice = document.createElement("span");
    productPrice.id = "price-id";
    productPrice.textContent = `Price: ${p.price}`;

    const dltBtn = document.createElement("button");
    dltBtn.textContent = "Delete";
    dltBtn.addEventListener("click", async () => {
      try {
        await api.deleteProduct(p);
        loadList();
      } catch (error) {
        statusText.textContent = ` Error ${error.message}`;
      }
    });

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", async () => {
      const editInput = document.createElement("input");
      editInput.type = "number";
      editInput.step = "0.01";
      editInput.name = "price";
      editInput.value = p.price;
      productPrice.replaceWith(editInput);

      const buttonGroup = document.createElement("div");

      const confirm = document.createElement("button");
      confirm.textContent = "confirm";

      const cancel = document.createElement("button");
      cancel.textContent = "cancel";

      buttonGroup.append(confirm, cancel);
      editBtn.replaceWith(buttonGroup);

      confirm.addEventListener("click", async () => {
        try {
          const newPrice = editInput.value;
          api.editProduct(p, newPrice);
          loadList();
        } catch (error) {
          statusText.textContent = `Error ${error.message}`;
        }
      });

      cancel.addEventListener("click", () => {
        buttonGroup.replaceWith(editBtn);
        editInput.replaceWith(productPrice);
      });
    });

    list.append(productName, productPrice, editBtn, dltBtn);
    listContainer.append(list);
  });
}

async function loadList() {
  statusText.textContent = "Loading...";
  try {
    const products = await api.getProducts();
    renderProducts(products);
    statusText.textContent = "";
  } catch (error) {
    statusText.textContent = `Error: ${error.message}`;
  }
}

/*Need to render an array list by accesing values from an array 
each color in said array should have an id, and text we then append them with a button
so they can be deleted from the array then we render the array again on each array render
we need to clear the lisit so they dont constantly add on each other


so step 1 create array

render function that adds the attributes needed and aggregates them to our array


add function which allows us to add a new color to our array

delete function that deletes that color from our array via the id 

we should prob add a limit on how many items our array can have so we set a limit of 7 colors 
per product



once data is done we send it to our form data by accesing the array we should prob make it a global value
*/
let colorArray = [];

function renderColors() {
  colorContainer.innerHTML = "";
  colorArray.forEach((color) => {
    const colorTagContainer = document.createElement("div");
    const colorTag = document.createElement("span");
    colorTag.textContent = color.color;
    const removeColorBtn = document.createElement("button");
    removeColorBtn.textContent = "x";

    removeColorBtn.addEventListener("click", (e) => {
      e.preventDefault();
      deleteColor(color.id);
    });
    colorTagContainer.append(colorTag, removeColorBtn);
    colorContainer.append(colorTagContainer);
  });
}

function addColor(color) {
  colorArray.push({ id: Date.now() + Math.random(), color });
  renderColors();
}

function deleteColor(colorId) {
  colorArray = colorArray.filter((c) => c.id !== colorId);
  console.log(colorArray);
  renderColors();
}

colorBox.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    addColor(colorBox.value);
    colorBox.value = "";
  }
});

async function uploadProduct(event) {
  event.preventDefault();
  const cleanedProductForm = new FormData(productForm);
  const readyProduct = Object.fromEntries(cleanedProductForm);
  readyProduct.colors = colorArray.map((c) => c.color);
  try {
    api.uploadProducts(readyProduct);
    productForm.reset();
    loadList();
    colorArray = [];
    renderColors();
    console.log(result);
  } catch (error) {
    statusText.textContent = `Error: ${error.message}`;
  }
}

async function searchQuery(event) {
  event.preventDefault();
  const query = new URLSearchParams(new FormData(searchForm));

  for (const [key, value] of [...query]) {
    if (!value) query.delete(key);
  }
  const res = api.queryProduct(query);

  console.log(res);
}

buttonRefresh.addEventListener("click", loadList);
productForm.addEventListener("submit", uploadProduct);
searchForm.addEventListener("submit", searchQuery);
renderColors();
loadList();
