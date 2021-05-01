let orders
let unfinishedOrders
function toogPageLoad(){
    getOrdersAndUpdateToogView();
}

setInterval(function (){
    getOrdersAndUpdatePaymentStatusAndTime();
}, 30000)

function updateToogView(){
    let list = document.createElement('ul');
    list.setAttribute('class','item-list');

    if(unfinishedOrders.length === 0){
        let noNewOrders = document.createElement('h3')
        noNewOrders.append(document.createTextNode("Geen nieuwe bestellingen"))
        list.append(noNewOrders)
        $('#main').empty()
        $('#main').append(list);
        return;
    }
    for (let orderIndex in unfinishedOrders){
        let currentOrder = unfinishedOrders[orderIndex]
        let orderInfo = currentOrder[currentOrder.length-1] //last element contains order details
        let timeSinceOrder = (Date.now() - orderInfo.timestamp)/1000;
        if(timeSinceOrder < 3500){
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

        let dropDownAndInfoDiv = document.createElement('div')
        dropDownAndInfoDiv.setAttribute("class", "order-items-list")

        let dropDownButton = document.createElement('span');
        dropDownButton.setAttribute('class', 'mdc-icon-button material-icons');
        dropDownButton.setAttribute('id', 'dropDown-button-' + orderInfo.timestamp);
        dropDownButton.onclick = function () {
            toggleOrderView(currentOrder);
        };
        dropDownButton.append(document.createTextNode('arrow_drop_down'));
        dropDownButton.setAttribute('style','transform: rotate(180deg)')


        dropDownAndInfoDiv.append(dropDownButton)

        let orderInfoAndList = document.createElement('div')
        orderInfoAndList.setAttribute('class','orderInfo-and-list closed')
        orderInfoAndList.setAttribute('id','orderInfo-and-list-'+orderInfo.timestamp)

        if(!(orderInfo.remark === "")) {
            let remark = document.createElement('p')
            remark.append(document.createTextNode("Opmerking: " + orderInfo.remark))
            orderInfoAndList.append(remark)
        }
        let paymentStatus = document.createElement('h3')
        paymentStatus.setAttribute('id', 'paymentStatus-' + orderInfo.timestamp)
        let paymentStatusText
        if(orderInfo.paymentMethod === "cash") {
            let paymentAmount = document.createElement('h3')
            paymentAmount.setAttribute('id', 'paymentAmount-' + orderInfo.timestamp)
            paymentAmount.append(document.createTextNode("Totaal: €"+orderInfo.amount))
            paymentStatusText = "Betaling: cash"
            paymentStatus.append(document.createTextNode(paymentStatusText));
            orderInfoAndList.append(paymentAmount, paymentStatus);
        }
        else {
            paymentStatusText = translatePaymentStatus(orderInfo.paymentStatus)
            paymentStatus.append(document.createTextNode(paymentStatusText));
            orderInfoAndList.append(paymentStatus);
        }

        let orderItemsList = document.createElement('ul');
        orderItemsList.setAttribute('id','order-items-list-'+orderInfo.timestamp)
        orderItemsList.setAttribute("class","order-items-list closed")

        for(let orderItemIndex in currentOrder){
            if(orderItemIndex === (currentOrder.length - 1).toString()) break;

            let orderItem = currentOrder[orderItemIndex];
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
            itemTimesAndName.append(itemName);

            let itemAmountButtons = document.createElement('div');
            itemAmountButtons.setAttribute('class', 'item-amount-buttons');
            let totalPricePerItem = document.createElement('span')
            totalPricePerItem.append(document.createTextNode((orderItem.pricePerItem * orderItem.amount).toString()));
            let euro = document.createElement('span')
            euro.append(document.createTextNode('euro'));
            itemAmountButtons.append(totalPricePerItem, euro);

            itemContainer.append(itemTimesAndName, itemAmountButtons);

            li.append(itemContainer);

            orderItemsList.append(li)
            orderItemsList.setAttribute('class','order-items-list closed')
        }

        orderInfoAndList.style.display='none'
        orderInfoAndList.append(orderItemsList)

        dropDownAndInfoDiv.append(orderInfoAndList)
        listItem.append(itemContainer,dropDownAndInfoDiv);

        list.append(listItem);

    }

    $('#main').empty()
    $('#main').append(list);

}

function toggleOrderView(order){
    let orderInfo = order[order.length -1];
    let orderInfoAndItemsList = document.getElementById('orderInfo-and-list-'+orderInfo.timestamp)
    if(orderInfoAndItemsList.getAttribute("class")==="orderInfo-and-list closed"){
        console.log('adding items form list of order with timestamp: '+ orderInfo.timestamp)
        orderInfoAndItemsList.style.display='block'
        let dropdownButton = document.getElementById('dropDown-button-' + orderInfo.timestamp)
        dropdownButton.setAttribute('style','transform: rotate(0deg)')
        orderInfoAndItemsList.setAttribute('class','orderInfo-and-list opened')
    }else{
        console.log('removing items form list of order with timestamp: '+ orderInfo.timestamp)
        let dropdownButton = document.getElementById('dropDown-button-' + orderInfo.timestamp)
        dropdownButton.setAttribute('style','transform: rotate(180deg)')
        orderInfoAndItemsList.style.display='none'
        orderInfoAndItemsList.setAttribute('class','orderInfo-and-list closed')
    }
}

function getOrdersAndUpdateToogView(){
    let main = $('#main')
    main.empty()
    let loader = document.createElement('div')
    loader.setAttribute('class','loader')
    main.append(loader)
    let url = '/getOrders'
    $.post(url, "getOrders", function (response, status){
        if(status === "success"){
            orders = JSON.parse(response);
            console.log('Received orders: '+ JSON.stringify(orders))
            //Sorting from old to new
            let timestamps = Object.keys(orders)
            timestamps.sort(function (a,b) {return b-a})
            let sortedOrders =[]
            let initialLength = timestamps.length
            for(let i = 0; i<initialLength; i++){
                sortedOrders.push(orders[timestamps.pop()])
            }

            console.log('Sorted orders: '+ sortedOrders)
            orders = sortedOrders
            unfinishedOrders = []
            for(let order in orders){
                let currentOrder = orders[order]
                if(!currentOrder[currentOrder.length-1].finished) unfinishedOrders.push(currentOrder)
            }
            updateToogView()
        }else{
            console.log('Something went wrong with retrieving the orders');
        }
    });
}

function orderIsReadyButton(order){
    let orderDetails = order.pop()
    orderDetails.finished = true
    order.push(orderDetails)

    let el = $('#order-'+orderDetails.timestamp)
    el.animate({opacity: '0'}, 150, function(){
    el.animate({height: '0px'}, 150, function(){
        for (var i = 0; i < unfinishedOrders.length; i++) {
            if (unfinishedOrders[i][unfinishedOrders[i].length-1].timestamp === orderDetails.timestamp) {
                unfinishedOrders.splice(i, 1);
            }
        }
        updateToogView()
        let url = "/orderFinished/"+orderDetails.timestamp
        $.post(url, order, function (response, status){
            if(status === "succes") console.log('succesfully sent the finish command for order: '+orderDetails.timestamp)
            else console.error('something went wrong wiht sending the finish command for order: '+orderDetails.timestamp)
        })
    });
});

}

function translatePaymentStatus(paymentStatus){
    switch (paymentStatus) {
        case "SUCCEEDED":
            return "Betaling: Succesvol"
        case "FAILED":
            return "Betaling: Mislukt"
        case "PENDING":
            return "Betaling: In Afwachting"
        case "IDENTIFIED":
            return "Betaling: (Nog) Niet In Orde"
        case "AUTHORIZED":
            return "Betaling: (Nog) Niet In Orde"
        case "AUTHORIZATION_FAILED":
            return "Betaling: Autorisatie mislukt"
        case "CANCELLED":
            return "Betaling: Geannuleerd"
        case "EXPIRED":
            return "Betaling: Verlopen"
        default:
            return "Betaling: Geen Gegevens"
    }
}

function getOrdersAndUpdatePaymentStatusAndTime(){
    let url = '/getOrders'
    $.post(url, "getOrders", function (response, status){
        if(status === "success"){
            orders = JSON.parse(response);
            console.log('Received orders: '+ JSON.stringify(orders))
            //Sorting from old to new
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
}

