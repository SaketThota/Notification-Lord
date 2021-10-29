var tbodyRef = document.querySelector('.table').getElementsByTagName('tbody')[0];
let products = [];
let mailIdRef = document.querySelector('#mailId');
let timerRef = document.querySelector('#timer');
let daysRef = document.querySelector('#days');
let hoursRef = document.querySelector('#hours');
let minutesRef = document.querySelector('#minutes');
let tableBg = document.querySelector('#table-bg');
let noProducts = document.querySelector('#no-products');
var mailId, hours, days, minutes;

async function getTime() {
    daysRef.addEventListener('change', (e) => setDays(e));
    hoursRef.addEventListener('change', (e) => setHours(e));
    minutesRef.addEventListener('change', (e) => setMinutes(e));

    await chrome.storage.local.get(['days'], function (res) {
        if (res) {
            days = res.days;
            daysRef.value = days;
        }
    })

    await chrome.storage.local.get(['hours'], function (res) {
        if (res) {
            hours = res.hours;
            hoursRef.value = hours;
        }
    })

    await chrome.storage.local.get(['minutes'], function (res) {
        if (res) {
            minutes = res.minutes;
            minutesRef.value = minutes;
        }
    })
}

async function getMailId() {
    mailIdRef.addEventListener('change', (e) => setMailId(e));
    await chrome.storage.local.get(['mailId'], function (res) {
        if (res.mailId) {
            mailId = res.mailId;
            mailIdRef.value = mailId;
        }
    })
}

async function sendDetails() {
    let details = {
        message: 'details',
        days: days,
        hours: hours,
        minutes: minutes,
        mailId: mailId
    };

    console.log(details)

    await chrome.runtime.sendMessage(details, (res) => {
        // console.log(res);
    });
}

async function setDays(e) {
    days = Math.max(Math.floor(parseInt(e.target.value)), 0);
    await chrome.storage.local.set({ 'days': days });
    daysRef.value = days;
    sendDetails();
}

async function setHours(e) {
    hours = Math.max(Math.floor(parseInt(e.target.value)), 0);
    await chrome.storage.local.set({ 'hours': hours });
    hoursRef.value = hours;
    sendDetails();
}

async function setMinutes(e) {
    minutes = Math.max(Math.floor(parseInt(e.target.value)), 0);
    await chrome.storage.local.set({ 'minutes': minutes });
    minutesRef.value = minutes;
    sendDetails();
}

async function setMailId(e) {
    mailId = e.target.value;
    await chrome.storage.local.set({ 'mailId': mailId });
    mailIdRef.value = mailId;
    sendDetails();
}

async function fillTable(newProduct) {
    let rowLength = 1;
    tbodyRef.innerHTML = '';
    let vis = new Map();

    chrome.storage.local.get(['key'], function (res) {
        products = res.key;

        if (newProduct) {
            products.push(newProduct);
        }

        if (products.length) {
            tableBg.style.display = 'block';
            noProducts.style.display = 'none';

            for (cur of products) {
                if (vis[cur.name] == true) continue;
                vis[cur.name] = 1;

                let newRow = tbodyRef.insertRow();
                newRow.scope = 'row';

                let fourthCol = newRow.insertCell(0);
                let deleteBtn = document.createElement('button');
                deleteBtn.innerHTML = 'Del';
                deleteBtn.addEventListener('click', (e) => deleteRow(e));
                deleteBtn.classList.add('btn');
                deleteBtn.classList.add('btn-danger');
                deleteBtn.classList.add('fw-bold');
                fourthCol.appendChild(deleteBtn);

                let thirdCol = newRow.insertCell(0);
                let aTag = document.createElement('a');
                aTag.setAttribute('href', cur.link);
                if (cur.name.length > 30)
                    cur.name = cur.name.slice(0, 30) + '...';

                aTag.innerText = cur.name;
                thirdCol.appendChild(aTag);

                let secondCol = newRow.insertCell(0);
                let secondColInput = document.createElement('input');
                cur.price = cur.price.split('.')[0];
                secondColInput.value = parseInt(cur.price.replace(/\D/g, ''));
                secondColInput.addEventListener('change', (e) => changePrice(e));
                secondCol.appendChild(secondColInput);

                let firstCol = newRow.insertCell(0);
                let firstColText = document.createTextNode(rowLength);
                firstCol.appendChild(firstColText);

                rowLength++;
            }
        } else {
            tableBg.style.display = 'none';
            noProducts.style.display = 'block';
            console.log('ok')
        }

        chrome.storage.local.set({ key: products }, function () {
            // console.log("storage saved");
        });
    });
}

(async () => {
    await fillTable(null);
    await getMailId();
    await getTime();
})()

async function deleteRow(e) {
    let curName = e.path[2].cells[2].innerText;
    console.log(curName);
    // redundant to remove
    // let td = e.target.parentNode;
    // let tr = td.parentNode;
    // tr.parentNode.removeChild(tr);

    chrome.storage.local.get(['key'], function (res) {
        let products = res.key;

        products = products.filter((e) => {
            return ((e.name != curName) && (curName != 'undefined'));
        })

        chrome.storage.local.set({ key: products }, function () {
            // console.log("storage saved");
            (async () => {
                await fillTable(null);
            })()
        });
    });
}

async function changePrice(e) {
    let newValue = e.target.value;
    let productName = e.path[2].cells[2].innerText;

    chrome.storage.local.get(['key'], function (res) {
        let products = res.key;

        console.log(products)

        for (let i = 0; i < products.length; ++i) {
            if (products[i].name == productName) {
                products[i].price = newValue;
            }
        }

        console.log(products)

        chrome.storage.local.set({ key: products }, function () {
            (async () => {
                await fillTable(null);
            })()
        })
    })
}

