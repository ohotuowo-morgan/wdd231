document.getElementById("currentyear").textContent = new Date().getFullYear();
document.getElementById("lastModified").textContent = `Last Modified: ${document.lastModified}`;

// Api fetch call
const lat = "5.037794871777592"
const lon = "7.91289974164656"
const apikey = "dab29e64e1c634bee2f2ae337735c943";


const weatherurl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}&units=metric`;

const forecasturl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apikey}&units=metric`;

async function apiFetch() {
    try {
        const response = await fetch(weatherurl);
        if (response.ok) {
            const result = await response.json();
            console.log(result);
            displayCurrentWeather(result);
        } else {
            throw Error(await response.text());
        }


        const forecastResponse = await fetch(forecasturl);
        if (forecastResponse.ok) {
            const forecastData = await forecastResponse.json();
            displayForecast(forecastData);
        } else {
            throw Error(await forecastResponse.text());
        }

    } catch (error) {
        console.log(error);
    }
}

function displayCurrentWeather(data) {
    const weatherCardInner = document.querySelector(".weather-card");
    
    const statsDiv = weatherCardInner.querySelector("div");
    const currentTemp = document.querySelector("#current-temp");
    const description = document.querySelector("#weather-desc");
    const high = document.querySelector("#high-temp");
    const low = document.querySelector("#low-temp");
    const humidity = document.querySelector("#humidity");
    const sunrise = document.querySelector("#sunrise");
    const sunset = document.querySelector("#sunset");

    currentTemp.innerHTML = `${data.main.temp.toFixed(0)}&deg;C`;
    description.textContent = data.weather[0].description;
    high.innerHTML = `${data.main.temp_max.toFixed(0)}&deg;C`;
    low.innerHTML = `${data.main.temp_min.toFixed(0)}&deg;C`;
    humidity.textContent = `${data.main.humidity}%`;

    const icon = document.createElement("img");

    const iconsrc = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;
    icon.setAttribute('src', iconsrc);
    icon.setAttribute('alt', data.weather[0].description);
    icon.setAttribute('id', 'weather-icon'); // Give it the ID back for styling
    icon.setAttribute('width', '100');     // Good for performance
    icon.setAttribute('height', '100');

    weatherCardInner.insertBefore(icon, statsDiv);

    const sunriseTime = new Date(data.sys.sunrise * 1000).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });

    const sunsetTime = new Date(data.sys.sunset * 1000).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
    });

    // 3. DISPLAY THEM
    sunrise.textContent = sunriseTime;
    sunset.textContent = sunsetTime;
}

function displayForecast(data) {

    const noonForecasts = data.list.filter(item => item.dt_txt.includes('12:00:00'));

    const dayNames = ['day1-name', 'day2-name', 'day3-name'];
    const dayTemps = ['day1-temp', 'day2-temp', 'day3-temp'];

    const numDays = Math.min(3, noonForecasts.length);

    for (let i = 0; i < numDays; i++) {
        const forecast = noonForecasts[i];

        const date = new Date(forecast.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });

        const temp = `${forecast.main.temp.toFixed(0)}&deg;C`;

        document.getElementById(dayNames[i]).textContent = dayName;
        document.getElementById(dayTemps[i]).innerHTML = temp;
    }
}

apiFetch();

// Data for business cards 
async function getMembers() {
    try {
        const response = await fetch("data/members.json");
        const data = await response.json(); // Added 'await' here!

        // Check if your JSON is an array or an object with a 'members' property
        // This line handles both cases safely
        const members = data.members || data;

        displaySpotlights(members);
    } catch (error) {
        console.error("Error fetching members:", error);
    }
}

getMembers();


// 2. Filter, Shuffle, and Display
function displaySpotlights(members) {
    // 1. Filter: Keep only Gold (3) and Silver (2) members
    const qualifiedMembers = members.filter(member => member.membershipLevel >= 2);

    // 2. Shuffle: Randomize the order
    const shuffled = qualifiedMembers.sort(() => 0.5 - Math.random());

    // 3. Slice: Take only the first 3 members
    const selectedMembers = shuffled.slice(0, 3);

    // 4. Display: Loop through ONLY the selected 3
    const container = document.querySelector(".business-cards");
    container.innerHTML = ""; // Clear any default content

    selectedMembers.forEach((company) => {
        // Create the Card Container
        const card = document.createElement("section");
        card.classList.add("spotlight-card");

        // Create Elements
        const image = document.createElement("img");
        const name = document.createElement("h3"); // Changed to h3 for better SEO
        const address = document.createElement("p");
        const phone = document.createElement("p");
        const website = document.createElement("a");
        const level = document.createElement("p"); // For Membership Level

        // Set Attributes & Content
        // Assuming images are in an 'images/' folder. If your JSON has the full path, remove 'images/'
        image.setAttribute("src", company.image);
        image.setAttribute("alt", `${company.name} logo`);
        image.setAttribute("loading", "lazy");
        image.setAttribute("width", "100");
        image.setAttribute("height", "100");

        name.textContent = company.name;

        address.textContent = company.address;

        phone.textContent = company.phone;

        // Website: href works as the link, textContent displays the URL string
        website.setAttribute("href", company.website);
        website.textContent = company.website;
        website.setAttribute("target", "_blank"); // Open in new tab

        // Membership Level (Convert number to text)
        const membershipText = company.membershipLevel === 3 ? "Gold Member" : "Silver Member";
        level.textContent = membershipText;
        level.classList.add("level"); // Add class for styling

        // Append everything to the card (Order matters!)
        card.appendChild(image);
        card.appendChild(name);
        card.appendChild(address);
        card.appendChild(phone);
        card.appendChild(website);
        card.appendChild(level);

        // Append the card to the main container
        container.appendChild(card);
    });
}