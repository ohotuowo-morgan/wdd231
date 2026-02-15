import { fetchCoinData } from "./api.mjs";

// Api Variables
const searchInput = document.querySelectorAll('input[type="search"]');

let allCoins = [];
let currentCoins = [];
let currentPage = 1;
const rowsPerPage = 10;


async function apiFetch() {
    
    const data = await fetchCoinData();
    console.log(data);
    allCoins = data;
    currentCoins = data;
    displayTicker(data);
    displayTopGainers(data);
    setupPagination();
    renderPage();

}

function renderPage() {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedItems = currentCoins.slice(start, end);
    displayTable(paginatedItems);
    updatePaginationControls();
}

function updatePaginationControls() {
    const pageInfo = document.getElementById('page-info');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const totalPages = Math.ceil(currentCoins.length / rowsPerPage);

    if (pageInfo) {
        pageInfo.textContent = `Page ${currentPage} of ${totalPages || 1}`
    }

    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages || totalPages === 0;
}

function setupPagination() {
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');

    prevBtn?.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderPage();
        }
    });

    nextBtn?.addEventListener('click', () => {
        const totalPages = Math.ceil(currentCoins.length / rowsPerPage);
        if (currentPage < totalPages) {
            currentPage++;
            renderPage();
        }
    });
}

// Function to format the number
const formatCompactNumber = (number) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        notation: 'compact',
        compactDisplay: 'short', // Use 'short' for T, B, M
        maximumFractionDigits: 2
    }).format(number);
};

function generateSparkline(prices) {
    if (!prices || prices.length === 0) return '';

    const width = 100;
    const height = 30;

    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const range = maxPrice - minPrice;

    // We map each price to a coordinate (X, Y)
    const points = prices.map((price, index) => {
        const x = (index / (prices.length - 1)) * width; // Spread points across width

        // Calculate Y (Invert it because SVG 0 is at the top)
        // We add a tiny buffer (5%) so the line doesn't get cut off at the edges
        const y = height - ((price - minPrice) / range) * height;
        return `${x},${y}`;
    }).join(' ');

    const isUp = prices[prices.length - 1] >= prices[0];
    const color = isUp ? '#10B981' : '#ff0000'; // Emerald or Red

    // 5. Return the HTML string
    return `
        <svg width="${width}" height="${height}" fill="none"  stroke-width="1" stroke="${color}">
            <polyline points="${points}" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
    `;
}

function displayTicker(coins) {
    const tickerTag = document.querySelector(".ticker-track");


    const tickerHTML = coins.map((coin) => {
        const isPositive = coin.price_change_percentage_24h >= 0;
        const colorClass = isPositive ? "up" : "down";
        const arrow = isPositive ? '▲' : '▼';

        return `<span class="ticker-item">
            <img src="${coin.image}" alt="${coin.name} width="20" height="20"/>
            ${coin.symbol.toUpperCase()}
            <span class="${colorClass}">${arrow} ${Math.abs(coin.price_change_percentage_24h).toFixed(2)}%</span>
        </span>`;

    }).join(".");

    tickerTag.innerHTML = tickerHTML + ' • ' + tickerHTML;


}

function displayTable(coins) {
    const tableBody = document.querySelector(".crypto-table-body");
    tableBody.innerHTML = "";

    coins.forEach(coin => {
        const row = document.createElement("tr");
        const priceChange = coin.price_change_percentage_24h;

        const sparklineHTML = generateSparkline(coin.sparkline_in_7d.price);

        // Example usage inside your loop:
        const marketCap = formatCompactNumber(coin.market_cap);
        const total_volume = formatCompactNumber(coin.total_volume);

        row.innerHTML = `
        
        <td>${coin.market_cap_rank}</td>
        <td > <div class="cry-logo"><img src="${coin.image}" alt="${coin.name}" width="24">${coin.name}</div></td>
        <td>${coin.symbol.toUpperCase()}</td>
        <td>${coin.current_price.toLocaleString()}</td>
        <td class="${priceChange >= 0 ? 'up' : 'down'}">
            ${priceChange.toFixed(2)}%
        </td>
        <td>${marketCap}</td>
        <td>${total_volume}</td>
        <td class="chart-cell">${sparklineHTML}</td>
        `;

        tableBody.appendChild(row);
    })
}

function displayTopGainers(coins) {
    // DOM vairables
    const topMover = document.querySelector(".top-gainer");
    const rank = document.querySelector(".rank")
    const topCap = document.querySelector(".top-market-cap");
    const topPrice = document.querySelector(".top-price");

    // Sort the Top gainer
    const sortedByGain = [...coins].sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h)
    const topGainer = sortedByGain[0];
    const topLoser = sortedByGain[sortedByGain.length - 1];


    const priceChange = topGainer.price_change_percentage_24h;
    const isPositive = topGainer.price_change_percentage_24h >= 0;
    const colorClass = isPositive ? "up" : "down";
    const arrow = isPositive ? '▲' : '▼';

    coins.forEach(coin => {
        const sparklineHTML = generateSparkline(coin.sparkline_in_7d.price);

        topMover.classList.add(`${priceChange >= 0 ? 'up' : 'down'}`)
        topMover.innerHTML = `
                            <p class="gainer ${priceChange >= 0 ? 'up' : 'down'}">
                                ${topGainer.name}
                                ${priceChange.toFixed(2)}%
                                ${arrow}
                            </p>
                            <span class="chart">${sparklineHTML}</span>`;
    });

    const marketCap = formatCompactNumber(topGainer.market_cap);

    rank.innerHTML = `No.${topGainer.market_cap_rank}`;
    topCap.innerHTML = `  ${marketCap}`
    topPrice.innerHTML = `$ ${topGainer.current_price.toLocaleString()}
    <span class="${priceChange >= 0 ? 'up' : 'down'}">
                                ${priceChange.toFixed(2)}%
                                ${arrow}
                            </span>`;

}

function searchListener() {
    searchInput.forEach(input => {
        input.addEventListener("input", (e) => {
            const searchTerm = e.target.value.toLowerCase();
            const name = document.getElementById("gainer-name");

            searchInput.forEach(otherInput => {
                if (otherInput !== input) {
                    otherInput.value = input.value;
                }
            });

            // name.textContent = `Search Result`;
            currentPage = 1;

            if (searchTerm === "") {
                name.textContent = "Top Gainers";
            } else {
                name.textContent = "Search Result";
            }

            const filteredCoins = allCoins.filter(coin =>
                coin.name.toLowerCase().includes(searchTerm) ||
                coin.symbol.toLowerCase().includes(searchTerm)
            );

            displayTopGainers(filteredCoins);

        });
    })

}
searchListener();

// Explorer Logic


// setInterval(()=>{
//     apiFetch();
//     console.log("Updated market data...");
// }, 6000)
apiFetch();
