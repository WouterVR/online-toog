let orders
function toogPageLoad(){
    getOrdersAndUpdateToogView();
}

setInterval(function (){
    updatePaymentStatusAndTime();
}, 10000)

function updateToogView(){
    //getOrders()
    //onclick -> openorder
    //klaarbutton -> bestelling is klaar
    let list = document.createElement('ul');
    list.setAttribute('class','item-list');
    for (let orderIndex in orders){
        let currentOrder = orders[orderIndex]
        let orderInfo = currentOrder[currentOrder.length-1] //last element contains order details
        let timeSinceOrder = (Date.now() - orderInfo.timestamp)/1000;
        if(timeSinceOrder < 3600){
            //les then an hour ago
            timeSinceOrder = Math.round(timeSinceOrder/60)
            timeSinceOrder = timeSinceOrder.toString() + " min"
        }else if(timeSinceOrder < 86400){
            //more than an hour ago, but less than a day ago
            timeSinceOrder = Math.round(timeSinceOrder/60/60)
            timeSinceOrder = timeSinceOrder.toString() + " uur"
        }else {
            //more than a day ago
            timeSinceOrder = ">1 dag"
        }

        let listItem = document.createElement('li');
        listItem.setAttribute('id',"order-"+orderInfo.timestamp);
        let itemContainer = document.createElement('div');
        itemContainer.setAttribute('class', "item-container");
        let itemNamePrice = document.createElement('div');
        itemNamePrice.setAttribute('class', "item-name-price");
        let itemName = document.createElement('p');
        itemName.setAttribute('class', "item-name");
        itemName.setAttribute('id', "item-name-" + orderInfo.timestamp);
        itemName.append(document.createTextNode("Bestelling "+orderInfo.timestamp));
        let itemEuroPrice = document.createElement('div');
        itemEuroPrice.setAttribute("class", "item-€-price");
        let timeIcon = document.createElement('span');
        timeIcon.setAttribute('class',"material-icons")
        timeIcon.setAttribute('style',"font-size: 10px")
        timeIcon.append(document.createTextNode('schedule'))
        let time = document.createElement('span')
        time.setAttribute("id","item-time-"+orderInfo.timestamp)
        time.append(document.createTextNode(timeSinceOrder))
        let priceSpan = document.createElement('span');
        priceSpan.setAttribute('id', 'item-price-' + orderInfo.timestamp);
        priceSpan.append(document.createTextNode('€'+ orderInfo.amount));
        let paymentLogo = document.createElement('img')
        if(orderInfo.paymentMethod === "cash") paymentLogo.setAttribute('src','../img/cash.png')
        else if (orderInfo.paymentMethod === "payconiq_by_bancontact") paymentLogo.setAttribute('src','../img/payconiq_by_Bancontact-logo-app-pos.png')
        paymentLogo.setAttribute('alt',"payment_method_logo")
        paymentLogo.setAttribute('style',"width: 10px; height: 10px")
        let tableNumber = document.createElement('span')
        tableNumber.setAttribute('id','item-table-'+orderInfo.tableNumber)
        tableNumber.append(document.createTextNode("Tafel: "+orderInfo.tableNumber))
        itemEuroPrice.append(timeIcon,time,priceSpan,paymentLogo,tableNumber);
        itemNamePrice.append(itemName,itemEuroPrice);
        itemNamePrice.onclick = function () {toggleOrderView(currentOrder);};
        let itemAmountButtons = document.createElement('div');
        itemAmountButtons.setAttribute('class', "item-amount-buttons");
        let readyButton = document.createElement('button');
        readyButton.setAttribute('class', 'mdc-button mdc-button--raised');
        readyButton.setAttribute('id', 'ready-button-' + orderInfo.timestamp);
        readyButton.onclick = function () {orderIsReadyButton(currentOrder);};
        readyButton.append(document.createTextNode('KLAAR'));
        itemAmountButtons.append(readyButton);

        itemContainer.append(itemNamePrice);
        itemContainer.append(itemAmountButtons);

        let orderItemsList = document.createElement('ul');
        orderItemsList.setAttribute('id','order-items-list-'+orderInfo.timestamp)
        orderItemsList.setAttribute("class","order-items-list closed")

        listItem.append(itemContainer,orderItemsList);

        list.append(listItem);

    }

    $('#main').empty()
    $('#main').append(list);

}

function toggleOrderView(order){
    let orderInfo = order[order.length -1];
    if($('#order-items-list-'+orderInfo.timestamp).attr("class")==="order-items-list closed"){
        console.log('adding items form list of order with timestamp: '+ orderInfo.timestamp)
        $('#order-items-list-'+orderInfo.timestamp).empty();
        let paymentStatus = document.createElement('h3')
        paymentStatus.setAttribute('id', 'paymentStatus-' + orderInfo.timestamp)
        let paymentStatusText
        if(orderInfo.paymentMethod === "cash") {
            let paymentAmount = document.createElement('h3')
            paymentAmount.setAttribute('id', 'paymentAmount-' + orderInfo.timestamp)
            paymentAmount.append(document.createTextNode("Totaal: €"+orderInfo.amount))
            paymentStatusText = "Betaling: cash"
            paymentStatus.append(document.createTextNode(paymentStatusText));
            $('#order-items-list-'+orderInfo.timestamp).append(paymentAmount, paymentStatus);
        }
        else {
            paymentStatusText = translatePaymentStatus(orderInfo.paymentStatus)
            paymentStatus.append(document.createTextNode(paymentStatusText));
            $('#order-items-list-' + orderInfo.timestamp).append(paymentStatus);
        }

        for(let orderItemIndex in order){
            if(orderItemIndex === (order.length - 1).toString()) break;

            let orderItem = order[orderItemIndex];
            let li = document.createElement('li')


            let itemContainer = document.createElement('div');
            itemContainer.setAttribute('class', "item-container");
            let itemTimesAndName = document.createElement('div');
            itemTimesAndName.setAttribute('class', "item-name-price");
            let itemName = document.createElement('p');
            itemName.append(document.createTextNode(orderItem.amount + ' x ' +orderItem.name));
            itemName.setAttribute('class','item-times-name');
            let itemEuroPrice = document.createElement('div');
            itemEuroPrice.setAttribute('class','item-€-price')
            let times2 = document.createElement('span');
            times2.append(document.createTextNode(orderItem.amount));
            let x2 = document.createElement('span');
            x2.append(document.createTextNode('x'));
            let itemPrice = document.createElement('span');
            itemPrice.append(document.createTextNode(orderItem.pricePerItem+ ' euro'));
            itemEuroPrice.append(times2, x2, itemPrice);
            itemTimesAndName.append(itemName,itemEuroPrice);

            let itemAmountButtons = document.createElement('div');
            itemAmountButtons.setAttribute('class', 'item-amount-buttons');
            let totalPricePerItem = document.createElement('span')
            totalPricePerItem.append(document.createTextNode((orderItem.pricePerItem * orderItem.amount).toString()));
            let euro = document.createElement('span')
            euro.append(document.createTextNode('euro'));
            itemAmountButtons.append(totalPricePerItem, euro);

            itemContainer.append(itemTimesAndName, itemAmountButtons);

            li.append(itemContainer);

            $('#order-items-list-'+orderInfo.timestamp).append(li)
            $('#order-items-list-'+orderInfo.timestamp).attr('class','order-items-list opened')
        }
    }else{
        console.log('removing items form list of order with timestamp: '+ orderInfo.timestamp)
        $('#order-items-list-'+orderInfo.timestamp).empty();
        $('#order-items-list-'+orderInfo.timestamp).attr('class','order-items-list closed')
    }
}

function getOrdersAndUpdateToogView(){
    //TODO fill with real orders
    let url = '/getOrders'
    $.post(url, "getOrders", function (response, status){
        if(status === "success"){
            orders = JSON.parse(response);
            console.log('Received orders: '+ JSON.stringify(orders))
            let timestamps = Object.keys(orders)
            timestamps.sort(function (a,b) {return b-a})
            let sortedOrders =[]
            let initialLength = timestamps.length
            for(let i = 0; i<initialLength; i++){
                sortedOrders.push(orders[timestamps.pop()])
            }

            console.log('Sorted orders: '+ sortedOrders)
            orders = sortedOrders
            updateToogView()
        }else{
            console.log('Something went wrong with retrieving the orders');
        }
    });
    /*let order0 =
            [{ amount: '1', name: 'Primus', pricePerItem: 1 },
    { amount: '1', name: 'Kasteelbier Rouge', pricePerItem: 2 },
    { amount: '1', name: 'Keizer Karel', pricePerItem: 2 },
    { amount: '1', name: 'Duvel', pricePerItem: 2 },
    { amount: '1', name: 'Grimbergen Blond', pricePerItem: 2 },
    { amount: '1', name: 'Tongerlo blond', pricePerItem: 2 },
    { amount: '1', name: 'Karmeliet', pricePerItem: 2 },
    { amount: '1', name: 'Water plat', pricePerItem: 0 },
    { amount: '1', name: 'Water bruis', pricePerItem: 1 },
    { amount: '1', name: 'Fanta', pricePerItem: 1 },
    { amount: '1', name: 'Cola', pricePerItem: 1 },
    { amount: '1', name: 'Pepsi max', pricePerItem: 1 },
    { amount: '1', name: 'IceTea', pricePerItem: 1 },
    { amount: '1', name: 'IceTea Green', pricePerItem: 1 },
    { finished: false,
        payed: false,
        paymentMethod: 'cash',
        amount: 19,
        remark: 'test',
        tableNumber: '2',
        timestamp: 1619647580000 } ]

    let order1 =
    [ { amount: '1', name: 'Primus', pricePerItem: 1 },
        { finished: false,
            payed: false,
            paymentMethod: 'payconiq_by_bancontact',
            paymentStatus:"SUCCEEDED",
            amount: 1.06,
            remark: '',
            tableNumber: '1',
            timestamp: 1619647558000} ]

    orders.push(order0, order1);

     */

}

function orderIsReadyButton(order){

}

function translatePaymentStatus(paymentStatus){
    switch (paymentStatus) {
        case "SUCCEEDED":
            return "Betaling: succesvol"
        case "FAILED":
            return "Betaling: mislukt"
        case "PENDING":
            return "Betaling: in afwachting"
        case "IDENTIFIED":
            return  "Betaling: geïdentificeerd"
        case "AUTHORIZED":
            return "Betaling: geautoriseerd"
        case "AUTHORIZATION_FAILED":
            return "Betaling: autorisatie mislukt"
        case "CANCELLED":
            return "Betaling: geannuleerd"
        case "EXPIRED":
            return "Betaling: verlopen"
        default:
            return "Betaling: geen gegevens"
    }
}

function updatePaymentStatusAndTime(){
    getOrders();
    for(let orderItemIndex in orders){
        let currentOrder = orders[orderItemIndex]
        let orderInfo = currentOrder[currentOrder.length-1] //last element contains order details

        /// UPDATE THE TIME //
        let timeSinceOrder = (Date.now() - orderInfo.timestamp)/1000;
        if(timeSinceOrder < 3600){
            //les then an hour ago
            timeSinceOrder = Math.round(timeSinceOrder/60)
            timeSinceOrder = timeSinceOrder.toString() + " min"
        }else if(timeSinceOrder < 86400){
            //more than an hour ago, but less than a day ago
            timeSinceOrder = Math.round(timeSinceOrder/60/60)
            timeSinceOrder = timeSinceOrder.toString() + " uur"
        }else {
            //more than a day ago
            timeSinceOrder = ">1 dag"
        }
        let time = $("#item-time-"+orderInfo.timestamp)
        time.empty()
        time.append(document.createTextNode(timeSinceOrder))

        /// UPDATE THE PAYMENT STATUS ///
        if($('#order-items-list-'+orderInfo.timestamp).attr("class")==="order-items-list opened") {
            let paymentStatus = $("#paymentStatus-" + orderInfo.timestamp)
            paymentStatus.empty();
            let paymentStatusText
            if (orderInfo.paymentMethod === "cash") {
                let paymentAmount = $('#paymentAmount-' + orderInfo.timestamp)
                paymentAmount.empty()
                paymentAmount.append(document.createTextNode("Totaal: €" + orderInfo.amount))
                paymentStatusText = "Betaling: cash"
                paymentStatus.append(document.createTextNode(paymentStatusText));
            } else {
                paymentStatusText = translatePaymentStatus(orderInfo.paymentStatus)
                paymentStatus.append(document.createTextNode(paymentStatusText));
            }
        }
    }
}

