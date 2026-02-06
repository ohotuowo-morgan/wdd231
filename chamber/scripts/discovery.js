// Import items data
import {places} from "../data/items.mjs";

// Dynamic date and lastmodified time
document.getElementById ("currentyear").textContent = new Date().getFullYear();
document.getElementById("lastModified").textContent  = document.lastModified;

// variables
const hamburger = document.getElementById("hamburger");
const navigation = document.getElementById("navigation");
hamburger.addEventListener("click", ()=>{
    hamburger.classList.toggle("active");
    navigation.classList.toggle("open");
});

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
    image.classList.add("place-img");
    description.classList.add("place-des");
    address .classList.add("place-ads");

    header.textContent = `${place.name}`;
    description.textContent = `${place.description}`;
    address.innerHTML = `<strong>Location:</strong> ${place.address}`;
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
const msPerDay = 86400000; 
const visitorMessage = document.getElementById("visitor-message");
const lastVisit = localStorage.getItem("lastVisit");
const now = Date.now();

if (!lastVisit) {
    visitorMessage.textContent = "Welcome! Let us know if you have any questions.";
} else {
    const timeDiff = now - lastVisit;
    const daysDiff = Math.floor(timeDiff / msPerDay);

    if (daysDiff < 1) {
        visitorMessage.textContent = "Back so soon! Awesome!";
    } else {
        const dayWord = daysDiff === 1 ? "day" : "days";
        visitorMessage.textContent = `You last visited ${daysDiff} ${dayWord} ago.`;
    }
}

localStorage.setItem("lastVisit", now);