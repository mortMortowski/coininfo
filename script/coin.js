let status = document.getElementById("status");
let errorDiv = document.getElementsByClassName("showError")[0];

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
        const connection = await fetch("https://api.coingecko.com/api/v3/ping");
        status.textContent = "Connected";
        const data = await fetch("https://api.coingecko.com/api/v3/coins/"+id);
        const dataJSON = await data.json();
        updatePage(dataJSON);
    }catch(error){
        showError(error, errorDiv);
    }
}

//update page contents using API data
function updatePage(data){
    document.title = "Coininfo - " + data.name;
    document.querySelector('meta[name="description"]').setAttribute("content","More information about " + data.name);
    document.querySelector('meta[name="keywords"]').setAttribute("content", data.name + ", crypto, cryptocurrency");
}