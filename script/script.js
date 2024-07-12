const statusSpan = document.getElementById("status");
const cryptosTable = document.getElementsByClassName("cryptos")[0];
const errorDiv = document.getElementsByClassName("showError")[0];
const pageSelectDiv = document.getElementsByClassName("page-select")[0];
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

import showError from "./showError.js";

//getting data from api
async function fetchAPI(page){
    try{
        const data = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=25&page='+page+'&sparkline=false&price_change_percentage=24h&locale=en');
        statusSpan.textContent = "Connected";
        const dataJSON = await data.json();
        console.log(dataJSON);
        dataJSON.forEach((coin) => {
            let row = cryptosTable.insertRow();
            let cell0 = row.insertCell(0);
            let cell1 = row.insertCell(1);
            let cell2 = row.insertCell(2);
            let cell3 = row.insertCell(3);
            let cell4 = row.insertCell(4);
            cell0.innerHTML = '<a href="coin.html?id='+coin.id+'"><img src="'+coin.image+'" alt="'+coin.symbol+'" class="coin-img"> ' + '<div class="coin-name">'+coin.name+'</div></a>';
            cell1.textContent = "$" + coin.current_price;
            cell2.textContent = "$" + coin.market_cap;
            cell3.textContent = "$" + coin.total_volume;
            cell4.textContent = coin.price_change_percentage_24h.toFixed(2) + "%";
        });
    }catch(error){
        showError("Error when fetching API: " + error, errorDiv);
    }
}

//function for generating dummy data
function generateCoin(name, price, mcap, volume24, change24){
    let row = cryptosTable.insertRow(1);
    let cell0 = row.insertCell(0);
    let cell1 = row.insertCell(1);
    let cell2 = row.insertCell(2);
    let cell3 = row.insertCell(3);
    let cell4 = row.insertCell(4);
    cell0.innerHTML = '<img src="img/bitcoin.webp" alt="btc" class="coin-img"> ' + '<div class="coin-name">'+name+'</div>';
    cell1.textContent = "$" + price;
    cell2.textContent = "$" + mcap;
    cell3.textContent = "$" + volume24
    cell4.textContent = change24 + "%";
}

//generateCoin("bitcoin", 25000, 1000000, 250000, 2);

//change current page
function changePage(pnumber){
    window.location.href = 'index.html?page='+pnumber;
}

//check current page
function checkPage(){
    const pnumberExists = urlParams.has('page');
    let page;
    if(!pnumberExists){
        page = 1;
    }else{
        page = urlParams.get('page');
        if(page < 1){
            page = 1;
        }else if(page > 50){
            page = 50;
        }
    }
    generatePageBtn(page);
    fetchAPI(page);
}

//generate page select buttons
function generatePageBtn(currentPage){
    currentPage = parseInt(currentPage);
    let beginBtn = document.createElement("button");
    let endBtn = document.createElement("button");

    beginBtn.innerHTML = "&lt;";
    beginBtn.className = "page-begin page-btn";
    beginBtn.onclick = function () {changePage(1);};

    endBtn.innerHTML = "&gt;";
    endBtn.className = "page-end page-btn";
    endBtn.onclick = function () {changePage(50);};

    pageSelectDiv.appendChild(beginBtn);

    for(let i=currentPage-1; i<=currentPage+1; i++){
        if(i > 0 && i < 51){
            let pageBtn = document.createElement("button");
            pageBtn.innerHTML = i;
            if(currentPage == i){
                pageBtn.className = "page-number page-btn current-page-btn";
            }else{
                pageBtn.className = "page-number page-btn";
            }
            pageBtn.onclick = function () {changePage(i);};
            pageSelectDiv.appendChild(pageBtn);
        }
    }

    pageSelectDiv.appendChild(endBtn);
}

checkPage();