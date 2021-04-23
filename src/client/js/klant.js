let menu = [];
let order = [];
let totalPrice =0;
let tableNumber = 0;
let remark = ';'

function pageLoad(){
    fillMenuAndView();
    updateTotalPrice();
}

function fillMenuAndView(){
    let url = '/getMenu';
    $.post(url, "give me the menu plz", function (data, status){
        if(status === "success"){
            menu = JSON.parse(data);
            console.log(menu);
            setPlaceOrderView();
            console.log('http status response 200 OK');
        }else{
            console.log('Something went wrong with receiving the userlist');
        }
    });
}

function setPlaceOrderView() {
    let list = document.createElement('ul');
    list.setAttribute('class','item-list');

    for(let menuItem in menu){
        console.log('item: ', menu[menuItem]['name']);
        let listItem = document.createElement('li');

        let itemContainer = document.createElement('div');
        itemContainer.setAttribute('class', "item-container");
            let itemNamePrice = document.createElement('div');
            itemNamePrice.setAttribute('class', "item-name-price");
                let itemName = document.createElement('p');
                itemName.setAttribute('class', "item-name");
                itemName.setAttribute('id', "item-name-"+menu[menuItem].name);
                itemName.append(document.createTextNode(menu[menuItem].name));
                let itemEuroPrice = document.createElement('div');
                itemEuroPrice.setAttribute("class","item-€-price");
                    let euroSign = document.createElement('span');
                    euroSign.append(document.createTextNode('€'));
                    let priceSpan= document.createElement('span');
                    priceSpan.setAttribute('id','item-price-'+menu[menuItem].name);
                    priceSpan.append(document.createTextNode(menu[menuItem].price));
                itemEuroPrice.append(euroSign);
                itemEuroPrice.append(priceSpan);
            itemNamePrice.append(itemName);
            itemNamePrice.append(itemEuroPrice);
            let itemAmountButtons = document.createElement('div');
            itemAmountButtons.setAttribute('class', "item-amount-buttons");
                let amountSelected= document.createElement('span');
                amountSelected.setAttribute('id','amountSelected-'+menu[menuItem].name);
                amountSelected.append(document.createTextNode('0'));
                let removeButton =document.createElement('span');
                removeButton.setAttribute('class','mdc-icon-button material-icons');
                removeButton.setAttribute('id','remove-button-'+menu[menuItem].name);
                removeButton.append(document.createTextNode('remove_circle'));
                let addButton =document.createElement('span');
                addButton.setAttribute('class','mdc-icon-button material-icons');
                addButton.setAttribute('id','add-button-'+menu[menuItem].name);
                addButton.append(document.createTextNode('add_circle'));
            itemAmountButtons.append(amountSelected);
            itemAmountButtons.append(removeButton);
            itemAmountButtons.append(addButton);
        itemContainer.append(itemNamePrice);
        itemContainer.append(itemAmountButtons);

        listItem.append(itemContainer);


        list.append(listItem);
    }

    $('#main').empty()
    $('#main').append(list);

    for(let menuItemId in menu){
        console.log('settign button onclick for '+menu[menuItemId].name);
        document.getElementById('add-button-'+menu[menuItemId].name).onclick = function() {addItem(menu[menuItemId].name);};
        document.getElementById('remove-button-'+menu[menuItemId].name).onclick = function() {removeItem(menu[menuItemId].name);};
    }

    /** FOOTER */

    let totalDiv = document.createElement('div');
    totalDiv.setAttribute('class', "total");
    let totalEuro= document.createElement('span');
    totalEuro.append(document.createTextNode('Totaal: €'));
    let total =document.createElement('span');
    total.setAttribute('id','total');
    total.append(document.createTextNode('0'))
    totalDiv.append(totalEuro);
    totalDiv.append(total);
    let spaceBetweenDiv = document.createElement('div');
    spaceBetweenDiv.setAttribute('class', "space-between-footer");
    let button = document.createElement('button');
    button.setAttribute('class', 'mdc-button mdc-button--raised');
    button.onclick = function () {continueButton();};
    button.append(document.createTextNode('VERDER'));

    $('#footer').empty();
    $('#footer').append(totalDiv, spaceBetweenDiv, button)

}
function setOrderDetailsView(){
    /** MAIN */
    let form = document.createElement('form');
    form.setAttribute('class','form-tableNumber-remark');
    let tableNumberLabel = document.createElement('label');
    tableNumberLabel.setAttribute('for','tableNumber');
    tableNumberLabel.append(document.createTextNode('Tafel nummer:'));
    let inputNumber = document.createElement('input');
    inputNumber.setAttribute('type','number');
    inputNumber.setAttribute('placeholder','1');
    inputNumber.setAttribute('id','tableNumber');
    let remarks = document.createElement('input');
    remarks.setAttribute('type','text');
    remarks.setAttribute('id','remark');
    remarks.setAttribute('placeholder','Opmerking');
    form.append(tableNumberLabel,inputNumber,remarks);

    let h3 = document.createElement('h3');
    h3.setAttribute('id', 'total');
    h3.append(document.createTextNode('0'));
    h3.append(document.createTextNode(' euro'));

    let list = document.createElement('ul');
    list.setAttribute('class', 'item-list')
    for(let menuItem in order){
        console.log('item: ', order[menuItem]['name']);
        let listItem = document.createElement('li');

        let itemContainer = document.createElement('div');
        itemContainer.setAttribute('class', "item-container");
        let itemTimesAndName = document.createElement('div');
        itemTimesAndName.setAttribute('class', "item-name-price");
            let itemName = document.createElement('p');
            itemName.append(document.createTextNode(order[menuItem].amount + ' x ' +order[menuItem].name));
            itemName.setAttribute('class','item-times-name');
            let itemEuroPrice = document.createElement('div');
            itemEuroPrice.setAttribute('class','item-€-price')
                let times2 = document.createElement('span');
                times2.append(document.createTextNode(order[menuItem].amount));
                let x2 = document.createElement('span');
                x2.append(document.createTextNode('x'));
                let itemPrice = document.createElement('span');
                itemPrice.append(document.createTextNode(order[menuItem].pricePerItem+ ' euro'));
            itemEuroPrice.append(times2, x2, itemPrice);
        itemTimesAndName.append(itemName,itemEuroPrice);

        let itemAmountButtons = document.createElement('div');
        itemAmountButtons.setAttribute('class', 'item-amount-buttons');
            let totalPricePerItem = document.createElement('span')
            totalPricePerItem.append(document.createTextNode((order[menuItem].pricePerItem * order[menuItem].amount).toString()));
            let euro = document.createElement('span')
            euro.append(document.createTextNode('euro'));
        itemAmountButtons.append(totalPricePerItem, euro);

        itemContainer.append(itemTimesAndName, itemAmountButtons);

        listItem.append(itemContainer);

        list.append(listItem);
    }

    $('#main').empty()
    $('#main').append(form,h3,list);
    updateTotalPrice();


    /** FOOTER **/
    let button1 = document.createElement('button');
    button1.setAttribute('class', 'mdc-button mdc-button--raised');
    button1.onclick = function () {backButton();};
    button1.append(document.createTextNode('TERUG'));

    let spaceBetweenDiv = document.createElement('div');
    spaceBetweenDiv.setAttribute('class', "space-between-footer");

    let button2 = document.createElement('button');
    button2.setAttribute('class', 'mdc-button mdc-button--raised');
    button2.onclick = function () {payButton();};
    button2.append(document.createTextNode('BETALEN'));

    $('#footer').empty();
    $('#footer').append(button1, spaceBetweenDiv,button2)
}

function setPaymentMethodView(){
    let pcdiv = document.createElement('div')
    pcdiv.setAttribute("class","payconiq-cash-div");
    let h3 = document.createElement('h3');
    h3.appendChild(document.createTextNode("Kies je betaalmethode:"));
    let pdiv = document.createElement('div')
    pdiv.setAttribute("class","logo-div");
    let img = document.createElement('img');
    img.setAttribute('id', 'payconiq_logo');
    img.onclick = function () {payWithPayconiq();};
    img.setAttribute('src', '../img/payconiq_by_Bancontact-logo-app-pos.png');
    img.setAttribute('alt', 'payconiq_by_Bancontact.png');
    pdiv.append(img)
    let hr = document.createElement('hr');
    hr.setAttribute('style','width: 80%');
    let cdiv = document.createElement('div');
    cdiv.setAttribute("class","logo-div");
    let img2 = document.createElement('img');
    img2.setAttribute('id', 'cash_logo');
    img2.onclick = function () {payInCash();};
    img2.setAttribute('src', '../img/cash.png');
    img2.setAttribute('alt', 'cash.png');
    cdiv.append(img2)
    pcdiv.append(h3,pdiv,hr,cdiv);

    $('#main').empty()
    $('#main').append(pcdiv);
    $('#footer').empty();
}

function orderReceivedView(){
    let div = document.createElement('div')
    div.setAttribute("class","order-received-div");
    let h3 = document.createElement('h3');
    h3.append(document.createTextNode('We hebben je bestelling goed ontvangen!'));
    let span = document.createElement('span');
    span.append(document.createTextNode('Klik '));
    let a = document.createElement('a');
    a.setAttribute('href','#');
    a.onclick = function () {location.reload();};
    a.append(document.createTextNode('hier'));
    span.append(a)
    span.append(document.createTextNode(' om een nieuwe bestelling te plaatsen.'))

    div.append(h3, span);

    $('#main').empty()
    $('#main').append(div);
    $('#footer').empty();
}


function updateTotalPrice(){
    document.getElementById('total').childNodes[0].nodeValue = totalPrice.toString();
}

function addItem(item){
    console.log('add item: '+item);
    for(let menuItemId in menu){
        if(menu[menuItemId].name === item){
            let amountOfItemText = document.getElementById('amountSelected-'+menu[menuItemId].name);
            let newValue = parseInt(amountOfItemText.childNodes[0].nodeValue)+1;
            if(newValue>99) return;
            totalPrice = parseInt(totalPrice) + parseInt(menu[menuItemId].price);
            updateTotalPrice()
            amountOfItemText.childNodes[0].nodeValue= newValue.toString(); //add one to the existing value
        }
    }
}

function removeItem(item){
    console.log('remove item: '+item)
    for(let menuItemId in menu){
        if(menu[menuItemId].name === item){
            let amountOfItemText = document.getElementById('amountSelected-'+menu[menuItemId].name)
            let newValue = parseInt(amountOfItemText.childNodes[0].nodeValue)-1;
            if(newValue<0) return;
            totalPrice = totalPrice - menu[menuItemId].price;
            updateTotalPrice()
            amountOfItemText.childNodes[0].nodeValue= newValue.toString() //add one to the existing value
        }
    }
}

function continueButton(){
    order = [];
    for(let menuItemId in menu){
        let amountOfItemText = document.getElementById('amountSelected-'+menu[menuItemId].name).childNodes[0].nodeValue;
        if(amountOfItemText>0){
            let orderItem = {
                name: menu[menuItemId].name,
                amount: amountOfItemText,
                pricePerItem: menu[menuItemId].price
            }
            order.push(orderItem);
        }
    }
    if(order.length === 0){
        alert('Voeg eerst een item toe aan je bestelling!');
        return;
    }
    setOrderDetailsView();
}

function payButton(){
    tableNumber = $('#tableNumber').val();
    if(tableNumber<= 0 || tableNumber >=10){
        alert('Gelieve een tafelnummer tussen 1 en 10 in te vulen.');
        return;
    }
    remark = $('#remark').val();
    console.log('table number: '+ tableNumber.toString() + ' and remark: '+remark);
    setPaymentMethodView();
}

function backButton(){
    setPlaceOrderView()
    for(let menuItemId in order){
        let amountOfItemText = document.getElementById('amountSelected-'+order[menuItemId].name)
        let newValue = order[menuItemId].amount;
        amountOfItemText.childNodes[0].nodeValue= newValue.toString() //add one to the existing value
    }
    updateTotalPrice()
}

function payWithPayconiq(){

    let ios = /iphone|XBLWP7/i.test(navigator.userAgent.toLowerCase());
    let android = /android|XBLWP7/i.test(navigator.userAgent.toLowerCase());
    let phoneOS = ""
    if(ios) phoneOS = "ios"
    if(android) phoneOS = "android"

    //TODO implement payconiq
    alert('Paying with payconiq is not supported yet')
    //Check if the last item is already some order details. In this case delete that information
    if(order[order.length-1].payed !== undefined)  order.pop();

    let orderDetails = {
        payed: false,
        tableNumber: tableNumber,
        remark: remark,
        paymentMethod: "payconiq_by_bancontact",
        phoneOS: phoneOS,
        finished: false,
        timestamp:Date.now()
    }
    order.push(orderDetails)

    let url = '/placeOrder/payconiq';
    $.post(url, JSON.stringify(order), function (data, status){
        if(status === "success"){
            console.log('Order sent to JH de bem server');
        }else{
            console.log('Something went wrong with placing the order');
        }
    });
}

function payInCash(){
    //Check if the last item is already some order details. In this case delete that information
    if(order[order.length-1].payed !== undefined)  order.pop();

    let orderDetails = {
        payed: false,
        tableNumber: tableNumber,
        remark: remark,
        paymentMethod: "cash",
        finished: false,
        timestamp:Date.now()
    }
    order.push(orderDetails)

    let url = '/placeOrder/cash';
    $.post(url, JSON.stringify(order), function (data, status){
        if(status === "success"){
            console.log('Order placed successfully');
            orderReceivedView()
        }else{
            console.log('Something went wrong with placing the order');
        }
    });
}

