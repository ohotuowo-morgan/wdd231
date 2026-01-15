const url = 'https://byui-cse.github.io/cse-ww-program/data/latter-day-prophets.json';

const cards = document.querySelector("#cards");

async function getProphetsData() {
    const response = await fetch(url);
    const data = await response.json();
    // console.table(data.prophets);
    displayProphets(data.prophets)
}

getProphetsData();

const displayProphets = (prophets) => {
    prophets.forEach((prophet) => {
        const cardBox = document.querySelector("#cards");

        const card = document.createElement("section");
        const title = document.createElement("h2");
        const dateofBirth = document.createElement("p");
        const placeofBirth = document.createElement("p");
        const image = document.createElement("img");

        title.textContent = `${prophet.name} ${prophet.lastname}`;
        image.setAttribute('src', prophet.imageurl);
        image.setAttribute('alt', `Portriate of Prophet ${prophet.name}` );
        image.setAttribute('loading', 'lazy');
        image.setAttribute('width', '340');
        image.setAttribute('height', '440');
        dateofBirth.textContent = prophet.birthdate;
        placeofBirth.textContent = prophet.birthplace

        card.appendChild(title);
        card.appendChild(dateofBirth);
        card.appendChild(placeofBirth);
        card.appendChild(image);

        cardBox.appendChild(card);
    });
} 