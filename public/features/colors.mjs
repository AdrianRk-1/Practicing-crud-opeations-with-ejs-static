const colorBox = document.getElementById("colors");
const colorContainer = document.getElementById("color-container");

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



should add a limit as too how many items can be passed into our products 
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

function initColors() {
  colorBox.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addColor(colorBox.value);
      colorBox.value = "";
    }
  });
  renderColors();
}

function getColors() {
  colorArray.map((c) => c.color);
}

function resetColors() {
  colorArray = [];
  renderColors();
}

export { initColors, getColors, resetColors };
