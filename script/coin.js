let status = document.getElementById("status");
let errorDiv = document.getElementsByClassName("showError")[0];
let coinImg = document.getElementsByClassName("coin-img")[0];
let coinName2 = document.getElementsByClassName("coin-name2")[0];
let coinPrice = document.getElementsByClassName("coin-price")[0];
let coinPrice2 = document.getElementById("li-price");
let liLowHigh = document.getElementById("li-low-high");
let liVolume = document.getElementById("li-volume");
let liMarketCap = document.getElementById("li-market-cap");
let liAllTime = document.getElementById("li-all-time");
let liLow = document.getElementById("li-low");
let coinAboutHeader = document.getElementById("coin-about-header");
let coinAboutDesc = document.getElementById("coin-about-desc");
let platformsTable = document.getElementById("platforms-table");
let priceChart = document.getElementById("price-chart");

import showError from "./showError.js";

//check if there is an id parameter in url
const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');
if(id == null){
    window.location.href = "index.html";
}else{
    getData();
}

//get crypto data from API
async function getData(){
    try{
        const data = await fetch("https://api.coingecko.com/api/v3/coins/"+id);
        status.textContent = "Connected";
        const dataJSON = await data.json();
        updatePage(dataJSON);
        //get data for chart
        const timeNow = Math.floor(Date.now() / 1000);
        const time24hAgo = timeNow - 86400;
        const time7dAgo = timeNow - 604800;
        const time30dAgo = timeNow - 2592000;
        const time1yAgo = timeNow - 31536000;
        console.log(timeNow);
        const options = {method: 'GET', headers: {accept: 'application/json'}}
        const chartData = await fetch("https://api.coingecko.com/api/v3/coins/"+id+"/market_chart/range?vs_currency=usd&from="+time24hAgo+"&to="+timeNow+"&precision=7", options);
        const chartDataJSON = await chartData.json();
        const chartPriceData = chartDataJSON.prices;
        createChart(chartPriceData);
    }catch(error){
        showError(error, errorDiv);
    }
}

//update page contents using API data
function updatePage(data){
    console.log(data);
    document.title = "Coininfo - " + data.name;
    document.querySelector('meta[name="description"]').setAttribute("content","More information about " + data.name);
    document.querySelector('meta[name="keywords"]').setAttribute("content", data.name + ", crypto, cryptocurrency");
    coinImg.setAttribute("src", data.image.small);
    coinImg.setAttribute("alt", data.symbol);
    coinName2.textContent = data.name;
    coinPrice.textContent = "$" + formatNumber(data.market_data.current_price.usd);
    coinPrice2.textContent = "Price: $" + formatNumber(data.market_data.current_price.usd);
    liLowHigh.textContent = "24h low / 24h high: $" + formatNumber(data.market_data.low_24h.usd) + " / $" + formatNumber(data.market_data.high_24h.usd);
    liVolume.textContent = "Total Volume: $" + formatNumber(data.market_data.total_volume.usd);
    liMarketCap.textContent = "Market Cap: $" + formatNumber(data.market_data.market_cap.usd);
    liAllTime.textContent = "All Time High: $" + formatNumber(data.market_data.ath.usd);
    liLow.textContent = "All Time Low: $" + formatNumber(data.market_data.atl.usd);
    coinAboutHeader.textContent = "What is " + data.name + "?";
    coinAboutDesc.innerHTML = data.description.en;
}

function createChart(apiData){

    //create empty data variable
    let data = {
        labels: [],
        datasets: [{
            data: [],
            fill: false,
            borderColor: 'rgb(75,192,192)'
        }]
    }

    //fill the data var with data from api
    apiData.forEach((elem) => {
        data.labels.push(unixToDate(elem[0]));
        data.datasets[0].data.push(elem[1]);
    });

    //create a chart
    new Chart(priceChart, {
        type: 'line',
        data: data,
        options: {
            plugins: {
                legend: {display: false}
            },
            scales: {
                x: {ticks: {display: false}}
            },
            elements:{
                point: {pointStyle: false},
                line: {cubicInterpolationMode: 'monotone'}
            }
        }
    });
}

function unixToDate(unixTime){
    let date = new Date(unixTime);
    return date.toLocaleString('en-GB', {timezone: 'GMT+2'});
}

function formatNumber(number){
    return number;
}