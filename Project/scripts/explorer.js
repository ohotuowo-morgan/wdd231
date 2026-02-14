import { fetchCoinData } from "./api.mjs";

let allCoins = [];
let currentCoins = [];
let currentPage = 1;
const rowsPerPage = 10;

async function initExplorer() {

    const data = await fetchCoinData();
    allCoins = data;
    currentCoins = data;
    setUpPagination();
    setUpFilters();
    renderPage();

}

function renderPage() {
    const start = (currentPage - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedItems = currentCoins.slice(start, end);

    displayTable(paginatedItems);
    updatePaginationControls();
}

function setUpFilters() {
    const price = document.querySelector(".price");
    const vol = document.querySelector(".vol");
    const marketCap = document.querySelector(".market");
    const btnContainer = document.querySelectorAll(".filter-btn");
    const items = [...btnContainer];

    items.forEach(item => {
        item.addEventListener("click",  (e) => {

            items.forEach(btn => btn.classList.remove("active-filter"))
            // this.classList.add("active-filter");
            e.currentTarget.classList.add('active-filter')
        });
    });

    price.addEventListener("click", () => {
        currentCoins.sort((a, b) => b.current_price - a.current_price);
        currentPage = 1;
        renderPage();
    });

    vol.addEventListener("click", () => {
        currentCoins.sort((a, b) => b.total_volume - a.total_volume);
        currentPage = 1;
        renderPage();
    });

    marketCap.addEventListener("click", () => {
        currentCoins.sort((a, b) => a.market_cap_rank - b.market_cap_rank);
        currentPage = 1;
        renderPage();
    });

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

function setUpPagination() {
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
            <polyline points="${points}" />
        </svg>
    `;
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
        <td class="cry-logo"><img src="${coin.image}" alt="${coin.name}" width="24">${coin.name}</td>
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


initExplorer();