let plants = JSON.parse(localStorage.getItem("plants")) || [];

function renderPlants() {
  const plantList = document.getElementById("plantList");
  plantList.innerHTML = "";

  plants.forEach((plant, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
      ${plant}
      <div style="margin-top:5px;">
        <button onclick="editPlant(${index})">Edit</button>
        <button onclick="deletePlant(${index})" style="background:#c62828;">Delete</button>
      </div>
    `;

    plantList.appendChild(li);
  });

  localStorage.setItem("plants", JSON.stringify(plants));
}

function addPlant() {
  const input = document.getElementById("plantName");
  const name = input.value.trim();
  if (!name) return;

  plants.push(name);
  input.value = "";
  renderPlants();
}

function editPlant(index) {
  const newName = prompt("Edit plant name:", plants[index]);
  if (newName && newName.trim() !== "") {
    plants[index] = newName.trim();
    renderPlants();
  }
}

function deletePlant(index) {
  if (confirm("Delete this plant?")) {
    plants.splice(index, 1);
    renderPlants();
  }
}

renderPlants();