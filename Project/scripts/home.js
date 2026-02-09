// Declare Variables
const hamburger = document.getElementById("hamburger");
const nav = document.querySelector(".navigation")

// Date
document.querySelector("#currentyear").textContent = new Date().getFullYear();
document.querySelector("#lastModified").textContent = `Last Modified ${document.lastModified}`


hamburger.addEventListener("click", ()=>{
    hamburger.classList.toggle("active")
    nav.classList.toggle("open")
})