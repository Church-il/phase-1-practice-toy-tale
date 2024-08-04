document.addEventListener("DOMContentLoaded", () => {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyCollection = document.getElementById("toy-collection");
  const addToyForm = document.querySelector(".add-toy-form");

  let addToy = false;

  // Toggle the form display
  addBtn.addEventListener("click", () => {
      addToy = !addToy;
      toyFormContainer.style.display = addToy ? "block" : "none";
  });

  // Fetch and display toys
  fetch("http://localhost:3000/toys")
      .then(response => response.json())
      .then(toys => {
          toys.forEach(toy => renderToy(toy));
      })
      .catch(error => console.error("Error fetching toys:", error));

  // Handle form submission to add a new toy
  addToyForm.addEventListener("submit", event => {
      event.preventDefault();
      const toyName = event.target.name.value;
      const toyImage = event.target.image.value;

      const newToy = {
          name: toyName,
          image: toyImage,
          likes: 0
      };

      fetch("http://localhost:3000/toys", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
          },
          body: JSON.stringify(newToy)
      })
      .then(response => response.json())
      .then(toy => {
          renderToy(toy);
          addToyForm.reset();
          toyFormContainer.style.display = "none"; // Hide form after submission
      })
      .catch(error => console.error("Error adding new toy:", error));
  });

  // Render a toy card
  function renderToy(toy) {
      const div = document.createElement("div");
      div.className = "card";
      div.innerHTML = `
          <h2>${toy.name}</h2>
          <img src="${toy.image}" class="toy-avatar" onerror="this.onerror=null;this.src='https://example.com/default-image.jpg';" />
          <p>${toy.likes} Likes</p>
          <button class="like-btn" id="${toy.id}">Like ❤️</button>
      `;
      toyCollection.appendChild(div);

      // Add event listener for the like button
      div.querySelector(".like-btn").addEventListener("click", () => {
          updateLikes(toy);
      });
  }

  // Update likes
  function updateLikes(toy) {
      const newLikes = toy.likes + 1;
      const url = `http://localhost:3000/toys/${toy.id}`;

      fetch(url, {
          method: "PATCH",
          headers: {
              "Content-Type": "application/json",
              "Accept": "application/json"
          },
          body: JSON.stringify({ likes: newLikes })
      })
      .then(response => {
          if (!response.ok) {
              throw new Error("Network response was not ok: " + response.statusText);
          }
          return response.json();
      })
      .then(updatedToy => {
          toy.likes = updatedToy.likes;
          const toyCard = document.getElementById(toy.id).parentNode;
          toyCard.querySelector("p").textContent = `${updatedToy.likes} Likes`;
      })
      .catch(error => console.error("Error updating likes:", error));
  }
});
