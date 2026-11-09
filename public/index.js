const buttonRefresh = document.getElementById("button");
const listContainer = document.getElementById("list");
const productForm = document.getElementById("create-product");
const statusText = document.getElementById("status");

async function loadList() {
  statusText.textContent = "Loading...";
  try {
    const res = await fetch("/products");

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `HTTP error ${res.status}`);
    }

    listContainer.innerHTML = "";
    const products = await res.json();
    products.forEach((p) => {
      const listElement = document.createElement("li");
      const priceTag = document.createElement("span");
      priceTag.textContent = p.price;
      listElement.textContent = p.name;

      const dltBtn = document.createElement("button");
      dltBtn.textContent = "Delete";
      dltBtn.addEventListener("click", async () => {
        const res = await fetch(`/products/${p.id}`, { method: "DELETE" });
        if (!res.ok) {
          const body = await res.json().catch(() => ({}));
          console.log(body);
        }
        loadList();
      });
      listElement.append(priceTag, dltBtn);

      listContainer.append(listElement);
    });
    statusText.textContent = "";
  } catch (error) {
    statusText.textContent = `Error: ${error.message}`;
  }
}

async function uploadProduct(event) {
  event.preventDefault();
  const cleanedProductForm = new FormData(productForm);
  const readyProduct = Object.fromEntries(cleanedProductForm.entries());

  try {
    const res = await fetch("/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(readyProduct),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `HTTP error ${res.status}`);
    }

    result = await res.json();

    productForm.reset();
    loadList();
    console.log(result);
  } catch (error) {
    console.error(error);
  }
}

buttonRefresh.addEventListener("click", loadList);

productForm.addEventListener("submit", uploadProduct);

loadList();
