let chart = document.getElementById("price-chart");
let chartInfo = document.getElementsByClassName("chart-info")[0];
const container = document.getElementsByClassName("container")[0];
let priceData = [];
let timeData = [];
let normalTime = [];
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

async function getData(coin){
    try{
        chartInfo.textContent = "Loading price chart...";
        const url = 'https://api.coingecko.com/api/v3/coins/'+coin+'/market_chart?vs_currency=usd&days=7&interval=hourly';
        const data = await fetch(url);
        if(!data.ok){
            throw Error ("Cannot load data from API");
        }
        const dataJSON = await data.json();
        dataJSON.prices.forEach((price) => {
            timeData.push(price[0]);
            priceData.push(price[1]);
            let normalDate = new Date(price[0]);
            normalTime.push(normalDate);
        });
        new Chart(chart, {
            type: "line",
            data: {
                labels: [...normalTime],
                datasets: [{
                    label: "coin_name price",
                    data: [...priceData],
                    borderWidth: 2
                }]
            },
            options: {
                legend: {display: false},
                scales: {
                    x:{display: false}
                }
            }
        });
        chartInfo.textContent = "";
    }
    catch(error){
        console.log(error);
        chartInfo.textContent = error;
    }
}

function checkURL(){
    const paramExists = urlParams.has("coin");
    let coinName = "";
    if(paramExists){
        coinName = urlParams.get("coin");
        getData(coinName);
    }else{
        container.innerHTML = 'Wrong URL. <a href="index.html">Main page</a>';
    }
}

checkURL();