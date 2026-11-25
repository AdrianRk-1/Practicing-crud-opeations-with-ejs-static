import { api } from "./api.mjs";

const categoryContainer = document.getElementById("category-container");

export async function getCategories() {
  try {
    const result = await api.getCategories();
    renderDropdown(result);
  } catch (error) {
    console.log(error);
  }
}

function renderDropdown(categories) {
  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categoryContainer.append(option);
  });
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
