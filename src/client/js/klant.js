let menu = [];
let order = [];
let totalPrice =0;

function pageLoad(){
    fillMenu()
    setPlaceOrderView();
    totalPrice =0;
    updateTotalPrice(0);
}

function fillMenu(){
    let item0 = {
        name: 'Primus',
        price: '1'
    }
    let item1= {
        name: 'Tongerloo',
        price: '2'
    }
    let item2 = {
        name: 'IceTea Green',
        price: '1'
    }
    let item3 = {
        name: 'Karmeliet',
        price: '2'
    }
    let item4 = {
        name: 'Duvel',
        price: '2'
    }
    let item5 = {
        name: 'Kasteelbier Rouge',
        price: '2'
    };
    menu = [item0, item1, item2, item3, item4, item5];
    console.log(menu);
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
    button1.onclick = function () {setPlaceOrderView();}; //TODO add ability to fill in old order
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
    let url = '/prepareOrder';
    $.post(url, JSON.stringify(order), function (data, status){
        if(status === "success"){
            console.log('http status response 200 OK');
        }else{
            console.log('Something went wrong with receiving the userlist');
        }
    });
}

function payButton(){
    alert('Betalen maar!');
}