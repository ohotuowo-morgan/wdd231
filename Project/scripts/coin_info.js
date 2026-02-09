// Api Variables
// /simple/price
// /coins/markets
const apikey = "CG-zLtbuPm5XcgHWfVHsqWK8Wgh"
const url = `https://api.coingecko.com/api/v3/`

async function apiFetch() {
    try {
        const response = await fetch(`${url}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=true&x_cg_demo_api_key=${apikey}`);
        if (response.ok) {
            const data = await response.json();

            // data.sort((a, b) => b.current_price - a.current_price);
            // console.log("Sorted price:", data);
            console.log(data)

            displayTicker(data);

            displayTable(data.slice(0, 10));

        } else {
            throw Error(await response.text());
        }

    } catch (error) {
        console.log(error)
    }
}

// Function to draw the mini-chart
function generateSparkline(prices) {
    if (!prices || prices.length === 0) return '';
    
    // 1. Setup dimensions
    const width = 100;  
    const height = 30;  // Height of the chart in pixels
    
    // 2. Find min and max prices to scale the chart
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const range = maxPrice - minPrice;
    
    // 3. Create the "points" string for the SVG polyline
    // We map each price to a coordinate (X, Y)
    const points = prices.map((price, index) => {
        const x = (index / (prices.length - 1)) * width; // Spread points across width
        
        // Calculate Y (Invert it because SVG 0 is at the top)
        // We add a tiny buffer (5%) so the line doesn't get cut off at the edges
        const y = height - ((price - minPrice) / range) * height; 
        return `${x},${y}`;
    }).join(' ');

    // 4. Determine color (Green if up over 7 days, Red if down)
    const isUp = prices[prices.length - 1] >= prices[0];
    const color = isUp ? '#10B981' : '#ff0000'; // Emerald or Red

    // 5. Return the HTML string
    return `
        <svg width="${width}" height="${height}" fill="none"  stroke-width="2" stroke="${color}">
            <polyline points="${points}" />
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
            ${coin.symbol.toUpperCase()}
            <span class="${colorClass}">${arrow} ${Math.abs(coin.price_change_percentage_24h).toFixed(2)}%</span>
        </span>`;

    }).join(".");

    tickerTag.innerHTML = tickerHTML + ' • ' + tickerHTML;


}

function displayTable(coins) {
    const tableBody = document.querySelector(".crypto-table-body");
    tableBody.innerHTML  = "";

    coins.forEach(coin => {
        const row = document.createElement("tr");
        const priceChange = coin.price_change_percentage_24h;

        const sparklineHTML = generateSparkline(coin.sparkline_in_7d.price);

        row.innerHTML = `
        
        <td>${coin.market_cap_rank}</td>
        <td class="cry-logo"><img src="${coin.image}" alt="${coin.name}" width="24">${coin.name}</td>
        <td>${coin.symbol.toUpperCase()}</td>
        <td>${coin.current_price.toLocaleString()}</td>
        <td class="${priceChange >= 0 ? 'up' : 'down'}">
            ${priceChange.toFixed(2)}%
        </td>
        <td>${coin.market_cap.toLocaleString()}</td>
        <td>${coin.total_volume.toLocaleString()}</td>
        <td class="chart-cell}">${sparklineHTML}</td>
        `;

        tableBody.appendChild(row);
    })
}

// setInterval(()=>{
//     apiFetch();
//     console.log("Updated market data...");
// }, 10000)
apiFetch();
