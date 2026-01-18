// Modify footer with current date and last modiified data
document.getElementById("currentyear").textContent = new Date().getFullYear();
document.getElementById("lastModified").textContent = `Last Modified: ${document.lastModified}`;

// variables
const hamburger = document.getElementById("hamburger");
const navigation = document.getElementById("navigation");
const grid =  document.getElementById("grid");
const list = document.getElementById("list");

hamburger.addEventListener("click", ()=>{
    hamburger.classList.toggle("active");
    navigation.classList.toggle("open");
});

async function getCompanyInfo() {
    const response = await fetch("data/members.json");
    const data = await response.json();
    displayCompany(data);
}

getCompanyInfo();

const displayCompany = (companies) => {
    companies.forEach((company) =>  {
        const cardBox = document.querySelector(".cardbox");

        const card = document.createElement("section");
        const image = document.createElement("img");
        const title = document.createElement("p");
        const address = document.createElement("p")
        const website = document.createElement("a");
        const phone = document.createElement("p");

        image.setAttribute("src", company.image);
        image.setAttribute("alt", `${company.name} logo`);
        image.setAttribute("loading", "lazy");
        image.setAttribute('width', '100');
        image.setAttribute('height', '100');
        title.textContent = `${company.name}`;
        address.textContent = `${company.address}`;
        website.setAttribute("href", company.website);
        website.textContent = `${company.website}`;
        phone.textContent = `${company.phone}`;

        // Temporal check
        grid.addEventListener("click", ()=>{
            cardBox.classList.remove("flex");
            card.classList.remove("business");
        });
        list.addEventListener("click", ()=>{
            cardBox.classList.add("flex");
            card.classList.add("business");
        })
        
        

        card.appendChild(image);
        card.appendChild(title);
        card.appendChild(address);
        card.appendChild(website);
        card.appendChild(phone);

        cardBox.appendChild(card);
        
    });
}