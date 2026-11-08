const buttonRefresh = document.getElementById("button");
const listContainer = document.getElementById("list");

async function loadList() {
  const status = document.getElementById("status");

  status.textContent = "Loading...";
  try {
    const res = await fetch("/products");

    if (!res.ok) {
      const body = await res.json();
      throw new Error(`HTTP error ${res.status}`);
      //body.error ||
    }

    listContainer.innerHTML = "";
    const products = await res.json();
    products.forEach((p) => {
      const listElement = document.createElement("li");
      const priceTag = document.createElement("span");
      priceTag.textContent = p.price;
      listElement.textContent = p.name;
      listContainer.append(listElement, priceTag);
    });
    status.textContent = "";
  } catch (error) {
    status.textContent = `Error: ${error.message}`;
  }
}

loadList();

async function uploadProduct() {
  const productForm = document.getElementById("create-product");
  const cleanedProductForm = new FormData(productForm);
  const readyProduct = Object.fromEntries(cleanedProductForm.entries());

  try {
    const res = await fetch("/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(readyProduct),
    });

    if (!res.ok) {
      const body = await res.json();
      throw new Error(`HtTP error ${res.status}`);
    }
  } catch (error) {}
}

buttonRefresh.addEventListener("click", loadList);
