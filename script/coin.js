let chart = document.getElementById("price-chart");
let chartInfo = document.getElementsByClassName("chart-info")[0];
const container = document.getElementsByClassName("container")[0];
let priceData = [];
let timeData = [];
let normalTime = [];
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

//get data from api
async function getData(coin){
    try{
        chartInfo.textContent = "Loading price chart...";
        //first load market data then load chart data

        const url0 = 'https://api.coingecko.com/api/v3/coins/bitcoin?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false&sparkline=false';
        const marketData = await fetch(url0);
        if(!marketData.ok){
            throw Error ("Cannot load market data");
        }

        const url1 = 'https://api.coingecko.com/api/v3/coins/'+coin+'/market_chart?vs_currency=usd&days=7&interval=hourly';
        const chartData = await fetch(url1);
        if(!chartData.ok){
            throw Error ("Cannot load data from API");
        }
        const chartDataJSON = await chartData.json();
        chartDataJSON.prices.forEach((price) => {
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

//check if url is correct
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