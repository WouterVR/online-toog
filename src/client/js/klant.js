let menu = [];

function pageLoad(){
    fillMenu()
    createList();
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

function createList() {
    //let list = $('#item-list');
    let list;
    if(list !== undefined) {
        console.log('list is not undefined');
        list.empty();
    } else{
        list = document.createElement('ul');
    }

    list = document.createElement('ul');
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
                let addButton =document.createElement('span');
                addButton.setAttribute('class','mdc-icon-button material-icons');
                addButton.append(document.createTextNode('add_circle'));
                let removeButton =document.createElement('span');
                removeButton.setAttribute('class','mdc-icon-button material-icons');
                removeButton.append(document.createTextNode('remove_circle'));
            itemAmountButtons.append(amountSelected);
            itemAmountButtons.append(addButton);
            itemAmountButtons.append(removeButton);
        itemContainer.append(itemNamePrice);
        itemContainer.append(itemAmountButtons);

        listItem.append(itemContainer);


        list.append(listItem);
        $('#main').append(list);
    }
}

function test(){

    var para = document.createElement("p");
    var node = document.createTextNode("This is a new paragraph.");
    var element = document.getElementById("title-container");
    element.appendChild(para);
}