
let productName = document.querySelector('#productTitle');
let ourPrice = document.querySelector('#priceblock_ourprice');
let dealPrice = document.querySelector('#priceblock_dealprice')
let productPrice;

if (productName) {
    productName = productName.textContent.trim();
}

if (dealPrice) {
    productPrice = dealPrice.textContent.trim();
} else if (ourPrice) {
    productPrice = ourPrice.textContent.trim();
}

let btn = document.createElement("BUTTON");
btn.innerHTML = 'Add';
btn.style.backgroundColor = '#f0b690'
btn.style.borderRadius = '15px';
btn.style.height = 'min-content';
btn.style.padding = '10px'
btn.style.outlineColor = 'none'
btn.style.fontSize = '1rem'
btn.style.paddingTop = '10px'
btn.style.paddingBottom = '10px'

btn.onmouseover = (() => {
    btn.style.backgroundColor = '#e3c3ac'
    btn.style.boxShadow = '0 0 8px #c9ab95'
    
})

btn.onmouseout = (() => {
    btn.style.backgroundColor = '#ebcab3'
    btn.style.boxShadow = '0 0 2px #c9ab95'
})

if (document.querySelector('#productTitle')) {
    document.querySelector('#productTitle').appendChild(btn);
}
btn.addEventListener("click", (e) => addProduct(e));

function addProduct(e) {
    let product = {
        message: 'product',
        productName: productName,
        productPrice: productPrice
    };

    if (chrome.runtime) {
        chrome.runtime.sendMessage(product, (res) => {
            // console.log(res);
        });
    }
}