function menuPageLoad() {
    console.log('menuPage loaded')
    fillMenuAndView()
}


function fillMenuAndView() {
    let url = '/getMenu';
    $.post(url, "give me the menu plz", function (data, status) {
        if (status === "success") {
            menu = JSON.parse(data);
            console.log('http status response 200 OK, menu: ' + data);
            setEditMenuView();
        } else {
            console.log('Something went wrong with receiving the menu');
        }
    });
}

function setEditMenuView() {
    $('#main').empty()
    for (let category in menu) {
        let currentCategory = menu[category];

        let categoryDiv = document.createElement('div')
        categoryDiv.setAttribute('class', 'category-div-' + category)
        categoryDiv.setAttribute('id', 'category-div-' + category + ' opened')

        let itemContainer = document.createElement('div');
        itemContainer.setAttribute('class', "item-container");

        let itemNamePrice = document.createElement('div');
        itemNamePrice.setAttribute('class', "item-name-price");
        let itemName = document.createElement('p');
        itemName.setAttribute('class', "category-name");
        itemName.setAttribute('id', "category-" + category);
        itemName.append(document.createTextNode(category));
        itemName.onclick = function () {
            toggleCategory(category);
        };
        itemNamePrice.append(itemName);

        let itemAmountButtons = document.createElement('div');
        itemAmountButtons.setAttribute('class', "category-button");
        let dropDownButton = document.createElement('span');
        dropDownButton.setAttribute('class', 'mdc-icon-button material-icons');
        dropDownButton.setAttribute('id', 'dropDown-button-' + category);
        dropDownButton.onclick = function () {
            toggleCategory(category);
        };
        dropDownButton.append(document.createTextNode('arrow_drop_down'));
        dropDownButton.setAttribute('style', 'transform: rotate(180deg)')
        itemAmountButtons.append(dropDownButton);
        itemContainer.append(itemNamePrice);
        itemContainer.append(itemAmountButtons);
        categoryDiv.append(itemContainer);

        let list = document.createElement('ul');
        list.setAttribute('class', 'item-list list-opened');
        list.setAttribute('id', 'item-list-' + category);

        for (let menuItem in currentCategory) {
            console.log('item: ', currentCategory[menuItem]['name']);
            let listItem = document.createElement('li');

            let itemContainer = document.createElement('div');
            itemContainer.setAttribute('class', "item-container");
            let itemNamePrice = document.createElement('div');
            itemNamePrice.setAttribute('class', "item-name-price");
            let itemName = document.createElement('p');
            itemName.setAttribute('class', "item-name");
            itemName.setAttribute('id', "item-name-" + currentCategory[menuItem].name);
            itemName.append(document.createTextNode(currentCategory[menuItem].name));
            let itemEuroPrice = document.createElement('div');
            itemEuroPrice.setAttribute("class", "item-€-price");
            let euroSign = document.createElement('span');
            euroSign.append(document.createTextNode('€'));
            let priceSpan = document.createElement('span');
            priceSpan.setAttribute('id', 'item-price-' + currentCategory[menuItem].name);
            priceSpan.append(document.createTextNode(currentCategory[menuItem].price));
            itemEuroPrice.append(euroSign);
            itemEuroPrice.append(priceSpan);
            itemNamePrice.append(itemName);
            itemNamePrice.append(itemEuroPrice);
            let itemAmountButtons = document.createElement('div');
            itemAmountButtons.setAttribute('class', "item-amount-buttons");
            let toggleSwitchDiv = document.createElement('div')
            if (currentCategory[menuItem].availability) {
                toggleSwitchDiv.setAttribute('class', 'mdc-switch mdc-switch--checked')
            } else {
                toggleSwitchDiv.setAttribute('class', 'mdc-switch mdc-switch--unchecked')
            }
            toggleSwitchDiv.setAttribute('id', 'toggle-switch-' + currentCategory[menuItem].name)
            let trackDiv = document.createElement('div')
            trackDiv.setAttribute("class", "mdc-switch__track")
            toggleSwitchDiv.append(trackDiv)
            let thumbUnderlayDiv = document.createElement('div')
            thumbUnderlayDiv.setAttribute('class', 'mdc-switch__thumb-underlay')
            let thumbDiv = document.createElement('div')
            thumbDiv.setAttribute('class', 'mdc-switch__thumb')
            thumbUnderlayDiv.append(thumbDiv)
            let checkBox = document.createElement('input')
            checkBox.setAttribute('type', 'checkbox')
            checkBox.setAttribute('class', 'mdc-switch__native-control')
            checkBox.setAttribute('role', 'switch')
            checkBox.setAttribute('aria-checked', 'false')
            checkBox.setAttribute('checked', 'false')
            thumbUnderlayDiv.append(checkBox)
            toggleSwitchDiv.append(thumbUnderlayDiv)

            let toggleSwitchLabel = document.createElement('label')
            toggleSwitchLabel.setAttribute('for', 'toggle-switch-' + currentCategory[menuItem].name)
            toggleSwitchLabel.append(document.createTextNode("off/on"))

            let addButton = document.createElement('div')
            addButton.setAttribute('class', 'mdc-icon-button material-icons');
            addButton.setAttribute('id', 'add-button-' + currentCategory[menuItem].name);
            addButton.append(document.createTextNode('add_circle'));
            addButton.setAttribute('style', 'transform: rotate(45deg)')
            itemAmountButtons.append(toggleSwitchDiv, addButton);
            itemContainer.append(itemNamePrice);
            itemContainer.append(itemAmountButtons);

            listItem.append(itemContainer);
            list.append(listItem);
        }

        //TODO add an empty menu item for a new item

        let listItem = document.createElement('li');
        let form = document.createElement('form');
        form.setAttribute('class', 'form-tableNumber-remark');
        let newItemNameLabel = document.createElement('label');
        newItemNameLabel.setAttribute('for', 'newItemName');
        newItemNameLabel.append(document.createTextNode('Naam van het item'));
        let newItemName = document.createElement('input');
        newItemName.setAttribute('type', 'text');
        newItemName.setAttribute('placeholder', 'Primus');
        newItemName.setAttribute('id', 'newItemName-' + category);
        let priceLabel = document.createElement('label');
        priceLabel.setAttribute('for', 'newItemName');
        priceLabel.append(document.createTextNode('Prijs van het item'));
        let price = document.createElement('input');
        price.setAttribute('type', 'number');
        price.setAttribute('id', 'remark');
        price.setAttribute('placeholder', 'Prijs');


        let addButton = document.createElement('div')
        addButton.setAttribute('class', 'mdc-icon-button material-icons');
        addButton.setAttribute('id', 'add-button-' + category);
        addButton.onclick = function () {
            console.log('add ' + category)
        }
        addButton.append(document.createTextNode('add_circle'));

        form.append(newItemNameLabel, newItemName, priceLabel, price);
        listItem.append(form)
        //list.append(listItem)

        categoryDiv.append(list)
        $('#main').append(categoryDiv);

        for (let menuItemId in currentCategory) {
            console.log('settign button onclick for ' + currentCategory[menuItemId].name);
            document.getElementById('toggle-switch-' + currentCategory[menuItemId].name).onclick = function () {
                toggleAvailability(currentCategory[menuItemId].name)
            }
            document.getElementById('add-button-' + currentCategory[menuItemId].name).onclick = function () {
                removeMenuItem(currentCategory[menuItemId].name);
            };

        }
    }
}

function removeMenuItem(menuitemName) {
    console.log('remove ' + menuitemName)
}

function toggleAvailability(menuItemName) {
    let toggleSwitch = document.getElementById('toggle-switch-' + menuItemName)
    let url = "/toggle/" + menuItemName
    $.post(url, menuItemName, function (toggleResponse, status) {
        if (status === "success") {
            console.log('succesfully toggles ' + menuItemName)
            if (toggleSwitch.getAttribute('class') === 'mdc-switch mdc-switch--checked') {
                toggleSwitch.setAttribute('class', 'mdc-switch mdc-switch--unchecked')
            } else {
                toggleSwitch.setAttribute('class', 'mdc-switch mdc-switch--checked')
            }
        } else {
            console.error("Something went wrong while toggling the availability of " + menuItemName);
        }
    })
}