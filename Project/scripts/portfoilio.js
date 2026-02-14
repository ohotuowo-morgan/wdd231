import { fetchCoinData } from "./api.mjs";

let allCoins = [];
let currentCoins = [];

async function initPortfolio() {
    const data = await fetchCoinData();
    allCoins = data;
    currentCoins = data;
    displayPortfolioTable(allCoins);

    populateCoinSelect(allCoins);
}

function populateCoinSelect(coins) {
    const select = document.getElementById('coin');
    select.innerHTML = '<option value="" disabled selected>Select Coin</option>';

    coins.forEach(coin => {
        const option = document.createElement('option');

        option.value = coin.id;

        option.text = `${coin.name} (${coin.symbol.toUpperCase()})`;

        select.appendChild(option);
    });
}

const addAssetForm = document.getElementById('add-asset-form');

addAssetForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const coinSelect = document.querySelector('#coin');
    const amountInput = document.querySelector('#amount');

    const selectedCoinId = coinSelect.value;
    const amountEntered = parseFloat(amountInput.value);

    if (!selectedCoinId) {
        alert('Please Select a Coin');
        return
    }
    if (isNaN(amountEntered) || amountEntered <= 0) {
        alert("Please enter a valid number");
        return;
    }

    let myPortfolio = JSON.parse(localStorage.getItem('coinPulsePortfolio')) || [];
    const existingAssetIndex = myPortfolio.findIndex(asset => asset.id === selectedCoinId);

    if (existingAssetIndex >= 0) {
        myPortfolio[existingAssetIndex].amount += amountEntered;
    } else {
        const newAsset = {
            id: selectedCoinId,
            amount: amountEntered
        };
        myPortfolio.push(newAsset);
    }

    localStorage.setItem("coinPulsePortfolio", JSON.stringify(myPortfolio));
    displayPortfolioTable(allCoins);

    console.log("Portfolio Updated:", myPortfolio);
    alert("Asset Added Successfully!");

    addAssetForm.reset();
});

const formatMoney = (num) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2
    }).format(num);
};

function displayPortfolioTable(coinsData) {
    const tableBody = document.querySelector('.crypto-table-body');
    const portfolioData = JSON.parse(localStorage.getItem('coinPulsePortfolio')) || [];

    tableBody.innerHTML = '';

    if (portfolioData.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding: 2rem;">No assets found. Add a coin above!</td></tr>`;
        updatePorfolioSummary(0, 0, 0);
        return;
    }


    const coinMap = {};
    coinsData.forEach(coin => {
        coinMap[coin.id] = coin;
    });

    let totalPortfolioValue = 0;
    let totalPreviousValue = 0;

    portfolioData.forEach(asset => {
        const coin = coinMap[asset.id];
        if (coin) {
            const currentTotal = asset.amount * coin.current_price;
            totalPortfolioValue += currentTotal

            // --- PROFIT CALCULATION LOGIC ---
            // 1. Get the percentage change (e.g., 5.0 for 5%)
            const changePercent = coin.price_change_percentage_24h;
            
            // 2. Calculate what this asset was worth 24h ago
            // Formula: Current / (1 + (percent / 100))
            const previousTotal = currentTotal / (1 + (changePercent / 100));
            
            // 3. Add to our running total for yesterday
            totalPreviousValue += previousTotal;
        }
    });

    const totalProfit = totalPortfolioValue -totalPreviousValue

    // Build table rows
    portfolioData.forEach((asset, index) => {
        const coin = coinMap[asset.id];

        // If for some reason the coin ID doesn't exist in API data, skip it
        if (!coin) return;

        const currentPrice = coin.current_price;
        const totalValue = asset.amount * currentPrice;
        const priceChange = coin.price_change_percentage_24h;

        // Calculate Allocation %
        const allocation = totalPortfolioValue > 0 ? (totalValue / totalPortfolioValue) * 100 : 0;

        const row = document.createElement('tr');

        row.innerHTML = `
        <td>${index + 1}</td>
        <td>
            <div style="display: flex; align-items: center; gap: 10px;">
                <img src="${coin.image}" alt="${coin.name}" width="24">
                <span>${coin.name} <span style="color:#888; font-size:0.8em;">${coin.symbol.toUpperCase()}</span></span>
            </div>
        </td>
        <td>${asset.amount} <span style="font-size:0.8em; ">${coin.symbol.toUpperCase()}</span></td>
        <td>${formatMoney(currentPrice)}</td>
        <td><strong>${formatMoney(totalValue)}</strong></td>
        <td class="${priceChange >= 0 ? 'up' : 'down'}">
            ${priceChange >= 0 ? '▲' : '▼'} ${Math.abs(priceChange).toFixed(2)}%
        </td>
        <td>
            <div style="display:flex; align-items:center; gap:8px;">
                <progress value="${allocation}" max="100" style="width:50px;"></progress>
                ${allocation.toFixed(1)}%
            </div>
        </td>
        `;

        tableBody.appendChild(row);
    });

    updatePorfolioSummary(totalPortfolioValue, portfolioData.length, totalProfit);
}

function updatePorfolioSummary(totalValue, assetCount, totalProfit) {
    const balanceEl = document.getElementById("total-balance");
    const countEl = document.getElementById("asset-count");
    const profitEl = document.getElementById("total-profit");

    if (balanceEl) balanceEl.textContent = formatMoney(totalValue);
    if (countEl) countEl.textContent = `${assetCount} Coins`;

    if (profitEl) {
        const isPositive = totalProfit >= 0;
        const arrow = isPositive ? '▲' : '▼';
        
        // Format: +$1,200.50
        profitEl.textContent = `${isPositive ? '+' : ''}${formatMoney(totalProfit)} ${arrow}`;
        
        // Update Color
        profitEl.classList.remove('up', 'down');
        profitEl.classList.add(isPositive ? 'up' : 'down');
    }
}

initPortfolio();