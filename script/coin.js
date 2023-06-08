let chart = document.getElementById("price-chart");
let priceData = [];
let timeData = [];

new Chart(chart, {
    type: "line",
    data: {
        labels: ["Red", "Blue", "Yellow"],
        datasets: [{
            label: "coin_name price",
            data: [12,14,17],
            borderWidth: 2
        }]
    }
});

async function getData(){
    try{
        const data = await fetch("https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=7&interval=daily");
        const dataJSON = await data.json();
        dataJSON.prices.forEach((price) => {
            timeData.push(price[0]);
            priceData.push(price[1]);
        });
        console.log(timeData,priceData);
    }
    catch(error){
        console.log(error);
    }
}

getData();