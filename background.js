const axios = require('axios');
const cheerio = require('cheerio');

const sgMail = require('@sendgrid/mail');
const SENDGRID_API_KEY = "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";
sgMail.setApiKey(SENDGRID_API_KEY);

var mailId, days, hours, minutes, intervalFunction;

async function fillTable(newProduct) {
    chrome.storage.local.get(['key'], function (res) {
        products = res.key;

        if (!products) {
            products = [];
        }

        if (newProduct) {
            products.push(newProduct);
        }

        if (products.length == 0) {
            
        } else {
            
        }

        chrome.storage.local.set({ key: products }, function () {
            // console.log("storage saved");
        });
    });
}

async function getMailId() {
    await chrome.storage.local.get(['mailId'], function (res) {
        mailId = res.mailId;
        totalTime = (minutes * 60) + (hours * 60 * 60) + (days * 24 * 60 * 60);
        totalTime = (totalTime * 1000)

        clearInterval(intervalFunction);
        if (!isNaN(totalTime)) {
            if (totalTime >= 0 && mailId != '') {
                intervalFunction = setInterval(checkPrices, totalTime);
            }
        }
    });
}

async function getTime() {
    clearInterval(intervalFunction);

    await chrome.storage.local.get(['days'], function (res) {
        days = res.days;
    })
    await chrome.storage.local.get(['hours'], function (res) {
        hours = res.hours;
    })
    await chrome.storage.local.get(['minutes'], function (res) {
        minutes = res.minutes;
    })

    totalTime = (minutes * 60) + (hours * 60 * 60) + (days * 24 * 60 * 60);
    totalTime = (totalTime * 1000)

    if (!isNaN(totalTime)) {
        if (totalTime >= 0 && mailId != '') {
            intervalFunction = setInterval(checkPrices, totalTime);
        }
    }
}

(async () => {
    await fillTable(null);
    await getTime();
    await getMailId();
})()

chrome.runtime.onMessage.addListener(
    async function (product, sender, sendResponse) {

        if (product.message == 'product') {
            let newProduct = {
                price: product.productPrice,
                link: sender.tab.url,
                name: product.productName
            }

            fillTable(newProduct);
            sendResponse();
        } else if (product.message == 'details') {
            await getMailId();
            await getTime();
            await sendResponse();
        }
    }
);

chrome.webRequest.onBeforeSendHeaders.addListener(
    function (details) {
        for (var i = 0; i < details.requestHeaders.length; ++i) {
            if (details.requestHeaders[i].name === 'User-Agent') {
                details.requestHeaders.splice(i, 1);
                break;
            }
        }
        return { requestHeaders: details.requestHeaders };
    },
    { urls: ["<all_urls>"] },
    ["blocking", "requestHeaders"]
);

async function sendEmail(subject, body) {
    try {
        return fetch("https://sendgrid.com/v3/mail/send", {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + SENDGRID_API_KEY,
                "content-type": "application/json"
            },
            body: JSON.stringify({
                personalizations: [
                    {
                        to: [{ email: mailId }]
                    }
                ],
                from: {
                    email: "saketthota98@gmail.com",
                    name: "Notification-Lord"
                },
                subject,
                content: [
                    {
                        type: "text/plain",
                        value: body
                    }
                ]
            })
        });
    } catch (e) {
        e => console.log(e);
    }
}

async function checkPrices() {
    await chrome.storage.local.get(['key'], function (res) {
        let allProducts = res.key;

        if (allProducts) {
            for (p of allProducts) {
                let url = p.link;
                axios.get(url)
                    .then(res => {
                        const $ = cheerio.load(res.request.response);
                        let ourPrice = $('#priceblock_ourprice').text().trim();
                        let dealPrice = $('#priceblock_dealprice').text().trim();
                        let expectedPrice = parseInt(p.price);
                        let curPrice = (dealPrice ? dealPrice : ourPrice);
                        curPrice = curPrice.split('.')[0];
                        curPrice = parseInt(curPrice.replace(/\D/g, ''));

                        if (curPrice <= expectedPrice) {
                            console.log("Working");
                            // sendEmail(`Price drop on ${p.name}`, `Price on product ${p.link} dropped to Rs.${curPrice}`);
                        }
                    })
                    .catch(err => console.log(err));
            }
        }

    })
}