const statusSpan = document.getElementById("status");
const cryptosTable = document.getElementsByClassName("cryptos")[0];
const errorDiv = document.getElementsByClassName("showError")[0];
const pageSelectDiv = document.getElementsByClassName("page-select")[0];
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);

//getting data from api
async function fetchAPI(page){
    try{
        const response = await fetch("https://api.coingecko.com/api/v3/ping");
        statusSpan.textContent = "Connected";
        const data = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=25&page='+page+'&sparkline=false&price_change_percentage=24h&locale=en');
        const dataJSON = await data.json();
        dataJSON.forEach((coin) => {
            let row = cryptosTable.insertRow();
            let cell0 = row.insertCell(0);
            let cell1 = row.insertCell(1);
            let cell2 = row.insertCell(2);
            let cell3 = row.insertCell(3);
            let cell4 = row.insertCell(4);
            cell0.innerHTML = '<img src="'+coin.image+'" alt="'+coin.symbol+'" class="coin-img"> ' + '<div class="coin-name">'+coin.name+'</div>';
            cell1.textContent = "$" + coin.current_price;
            cell2.textContent = "$" + coin.market_cap;
            cell3.textContent = "$" + coin.total_volume;
            cell4.textContent = coin.price_change_percentage_24h.toFixed(2) + "%";
        });
    }catch(error){
        showError("Error when fetching API: " + error);
    }
}

//function that shows errors
function showError(text){
    errorDiv.textContent = text;
    errorDiv.style.padding = "10px";
    errorDiv.style.border = "2px solid rgb(173, 14, 46)";
    setTimeout(() => {
        errorDiv.textContent = "";
        errorDiv.style.padding = "0";
        errorDiv.style.border = "0";
    }, 2000);
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
    //fetchAPI(page);
}

//generate page select buttons
function generatePageBtn(currentPage){
    currentPage = parseInt(currentPage);
    let beginBtn = document.createElement("button");
    let endBtn = document.createElement("button");

    beginBtn.innerHTML = "&lt;";
    beginBtn.className = "page-begin";
    beginBtn.onclick = function () {changePage(1);};

    endBtn.innerHTML = "&gt;";
    endBtn.className = "page-end";
    endBtn.onclick = function () {changePage(50);};

    pageSelectDiv.appendChild(beginBtn);

    for(let i=currentPage-3; i<currentPage+3; i++){
        if(i > 0 && i < 51){
            let pageBtn = document.createElement("button");
            pageBtn.innerHTML = i;
            pageBtn.className = "page-number";
            pageBtn.onclick = function () {changePage(i);};
            pageSelectDiv.appendChild(pageBtn);
        }
    }

    pageSelectDiv.appendChild(endBtn);
}

checkPage();