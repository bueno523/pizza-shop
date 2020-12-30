function loadItems(){
    // fetching items
    fetch('/items')
    .then(res => res.json())
    .then(data => {
        let sizes = data.items.size;
        let toppings = data.items.topping;
        let bases = data.items.base;
        loadTable(sizes, 1);
        loadTable(bases, 2);
        loadTable(toppings, 3);
    })
    // fetching orders
    fetch('/orders')
    .then(res => res.json())
    .then(data => {
        loadOrders(data.pizzas);
    })
}

function loadTable(data, position){
    let table;
    if (position == 1) table = document.getElementById('tableSize');
    if (position == 2) table = document.getElementById('tableBase');
    if (position == 3) table = document.getElementById('tableToppings');

    data.forEach(item => {
        populateRow(table, item);
    });
    let emptyElem = {
        id: table.rows.length,
        name: '',
        price: 0,
    }

    populateRow(table, emptyElem, '1')
}

function loadOrders(pizzas){
    pizzas.forEach(pizza => {
        let table = document.getElementById('tableOrders');
        let rowCount = table.rows.length;
        let row = table.insertRow(rowCount);
        let addBtn = document.createElement('button');
        addBtn.classList.add('btn', 'btn-success', 'table-btn');
        addBtn.innerText = "SEND"
        addBtn.addEventListener('click', (event)=>{
            sendPizza(event);
        })
        row.insertCell(0).innerHTML = pizza.id;
        row.insertCell(1).innerHTML = pizza.size;
        row.insertCell(2).innerHTML = pizza.base;
        row.insertCell(3).innerHTML = pizza.toppings;
        row.insertCell(4).innerHTML = pizza.price;
        row.insertCell(5).innerHTML = pizza.address;
        row.insertCell(6).appendChild(addBtn);
    });

    
}

function populateRow(table, item, empty){
    let rowCount = table.rows.length;
    let row = table.insertRow(rowCount);

        let nameElem = document.createElement('input');
        let priceElem = document.createElement('input');
        let updateElem = document.createElement('button');
        let deleteElem = document.createElement('button');

        nameElem.type = "text";
        nameElem.value = item.name;
        priceElem.type = "number";
        priceElem.value = item.price;
        updateElem.innerText = empty ? 'ADD' : 'UPDATE';
        deleteElem.innerText = 'DELETE'

        updateElem.classList.add('btn', 'btn-success', 'table-btn');
        deleteElem.classList.add('btn', 'btn-danger', 'table-btn');

        updateElem.addEventListener('click', (event)=> {
            if ( empty ) {
                addRow(event);
            } else {
                updateRow(event);
            }
   
        })
        deleteElem.addEventListener('click', (event)=> {
                deleteRow(event);
        })

        row.insertCell(0).innerHTML = item.id;
        row.insertCell(1).appendChild(nameElem);
        row.insertCell(2).appendChild(priceElem);
        row.insertCell(3).appendChild(updateElem);
        if (!empty) row.insertCell(4).appendChild(deleteElem);

}

function updateRow(event){
    // id of the row
    let id = getRowId(event);
    // section name
    let section = getTableSection(event);
    let price = getRowPrice(event);
    let name = getRowName(event);
    console.log(price)
    console.log(name)
    // send post request to /orders

    fetch('/item', {
        method: 'PUT',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({section, item: {
            id, price, name
        }})
    }).then(res => res.json()).then(data => {
        alert(data.message);
        if (data.status == 200) {
            location.reload();
        }
    })
}

function deleteRow(event){
        // id of the row
    let id = getRowId(event);
    // section name
    let section = getTableSection(event);
}

function addRow(event){
    // validating inputs

    let row = getRowElem(event);

    let id = row.children[0].innerText;
    let name = row.children[1].firstChild.value;
    let price = Number(row.children[2].firstChild.value);
    let section =  getTableSection(event).toLowerCase();

    if ( name.trim() == '' ) return;

    let jsonElem = {
        id,
        name,
        price,
        section
    }

    // send post request to /orders

    fetch('/item', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(jsonElem)
    }).then(res => res.json()).then(data => {
        alert(data.message);
        if (data.status == 200) {
            location.reload();
        }
    })

}

function sendPizza(event){
    let id = getRowId(event);

    fetch('/orders', {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify({id})
    }).then(res => res.json()).then(data => {
        alert(data.message);
        if (data.status == 200) {
            location.reload();
        }
    })
}


function getRowElem(event) {
    return event.target.parentNode.parentNode;
}

function getRowId(event) {
    return event.target.parentNode.parentNode.firstChild.innerText;
}
function getTableSection(event) {
    return event.target.parentNode.parentNode.parentNode.children[0].children[1].innerText;
}

function getRowPrice(event) {
    return event.target.parentNode.parentNode.children[2].firstChild.value;
}

function getRowName(event) {
    return event.target.parentNode.parentNode.children[1].firstChild.value;
}
loadItems();