function showError(text, container){
    container.textContent = text;
    container.style.padding = "10px";
    container.style.border = "2px solid rgb(173, 14, 46)";
    setTimeout(() => {
        container.textContent = "";
        container.style.padding = "0";
        container.style.border = "0";
    }, 2000);
}

export default showError;