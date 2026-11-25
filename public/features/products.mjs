import { api } from "./api.mjs";
import { resetColors, getColors } from "./colors.mjs";

const statusText = document.getElementById("status");
const listContainer = document.getElementById("list");
const productForm = document.getElementById("create-product");

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

async function uploadProduct(event) {
  event.preventDefault();
  const cleanedProductForm = new FormData(productForm);
  const readyProduct = Object.fromEntries(cleanedProductForm);
  readyProduct.colors = getColors();
  try {
    api.uploadProducts(readyProduct);
    productForm.reset();
    loadList();
    resetColors();
    console.log(result);
  } catch (error) {
    statusText.textContent = `Error: ${error.message}`;
  }
}

export { loadList, uploadProduct };
