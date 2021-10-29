
let productPrices = [];
let productNames = [];

// amazon
productNames.push(document.querySelector('#productTitle'));
let ourPrice = document.querySelector('#priceblock_ourprice');
let dealPrice = document.querySelector('#priceblock_dealprice');
if (ourPrice) productPrices.push(ourPrice);
else productPrices.push(dealPrice);

// flipkart
productNames.push(document.querySelector('.B_NuCI'));
productPrices.push(document.getElementsByClassName('_30jeq3 _16Jk6d')[0]);

// myntra
productNames.push(document.getElementsByClassName('pdp-name')[0]);
productPrices.push(document.getElementsByClassName('pdp-price')[0]);

let btn = document.createElement("BUTTON");
btn.innerHTML = 'ADD';
btn.style.borderRadius = '15px';
btn.style.outline = 'none';
btn.style.height = 'min-content';
btn.style.padding = '10px';
btn.style.outlineColor = 'none';
btn.style.fontSize = '1.1rem';
btn.style.paddingTop = '10px';
btn.style.paddingBottom = '10px';
btn.style.fontWeight = 'bold';
btn.style.margin = '3px';
btn.style.borderColor = '#24963e';
btn.style.backgroundColor = '#28a745';

btn.onmouseover = (() => {
    btn.style.backgroundColor = '#24963e'
    btn.style.boxShadow = '0 0 8px #24963e'
})

btn.onmouseout = (() => {
    btn.style.backgroundColor = '#28a745'
    btn.style.boxShadow = '0 0 2px #28a745'
})

btn.addEventListener("click", (e) => addProduct(e));

let productName, productPrice;

for (let i = 0; i < 3; ++i) {
    if (productNames[i] && productPrices[i]) {
        productName = productNames[i].textContent.trim();
        productPrice = productPrices[i].textContent.trim();
        productNames[i].appendChild(btn);

        if (productPrice[0] == 'R') {
            productPrice = productPrice.slice(4);
        }
        break;
    }
}

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