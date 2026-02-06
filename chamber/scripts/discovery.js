// Import items data
import {places} from "../data/items.mjs";

// Dynamic date and lastmodified time
document.getElementById ("currentyear").textContent = new Date().getFullYear();
document.getElementById("lastModified").textContent  = document.lastModified;

// Card creation from Item data 

places.map((place) => {
    const container = document.getElementById("container");

    const card = document.createElement("div");
    const header = document.createElement("h2");
    const image  = document.createElement("img");
    const description = document.createElement("p");
    const address = document.createElement("p");

    // Adding classes for styling
    card.classList.add("place-card");
    header.classList.add("place-header");
    image.classList.add("place-immg");
    description.classList.add("place-des");
    address .classList.add("place-ads");

    header.textContent = `${place.name}`;
    description.textContent = `${place.description}`;
    address.textContent = `${place.address}`;
    image.setAttribute("src", `${place.image}`)
    image.setAttribute("alt", "Recreational site image");
    image.setAttribute("width", "300");
    image.setAttribute("height", "200");

    card.appendChild(header);
    card.appendChild(image);
    card.appendChild(description);
    card.appendChild(address);

    container.appendChild(card);
    

});

// Local storage logic for user visit