import { initColors } from "./features/colors.mjs";
import { loadList, uploadProduct } from "./features/products.mjs";
import { getCategories } from "./features/search.mjs";

const buttonRefresh = document.getElementById("button");
const productForm = document.getElementById("create-product");

const searchForm = document.getElementById("find-product");

buttonRefresh.addEventListener("click", loadList);
productForm.addEventListener("submit", uploadProduct);

initColors();
loadList();

getCategories();
