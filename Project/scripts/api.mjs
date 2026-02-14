export let allCoins =[];
export let currentCoins = [];

const apikey = "CG-zLtbuPm5XcgHWfVHsqWK8Wgh";
const url = `https://api.coingecko.com/api/v3/`;

export async function fetchCoinData() {
    try{
        const response = await fetch(`${url}/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1&sparkline=true&x_cg_demo_api_key=${apikey}`);
        if(response.ok){
            const data = await response.json();
            allCoins = data;
            currentCoins = data;
            return data;
        }else {
            throw Error(await response.text());
        }
    }catch(error){
        console.log(error);
        return [];
    }
}