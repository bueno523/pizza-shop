
var http = require('http'),
    path = require('path'),
    express = require('express'),
    bodyParser = require('body-parser'),
    fs = require('fs'),
    expAutoSan = require('express-autosanitizer'),
    tabulator = require('tabulator-tables');
    

var app = express();
var server = http.createServer(app);

app.use(express.static(path.resolve(__dirname, 'views')));
app.use(bodyParser.urlencoded({extended: true}));

app.use(bodyParser.json());
app.use(expAutoSan.allUnsafe);



app.get('/', function(req, res){
    res.render('index');
})

// app.get('/admin', function(req, res){
//     res.setHeader('Content-type', 'text/html');
//     res.render('admin-page');
// })

// app.get('/customer', function(req, res){
//     res.render('customer-page.html');
// })



app.get('/orders', function(req, res){
    const file = fs.readFileSync('./orders.json', 'utf-8');
    res.setHeader('Content-type', 'text/json');
    res.send(file);
})

app.get('/items', function(req, res){
    const file = fs.readFileSync('./items.json', 'utf-8');
    res.setHeader('Content-type', 'text/json');
    res.send(file);
})

app.post('/orders', function(req, res){
    const base = req.body.base;
    const size = req.body.size;
    const toppings = req.body.toppings;
    const price = req.body.price;
    const address = req.body.address;

    res.setHeader('Content-type', 'text/json');
    let file = fs.readFileSync('./orders.json', 'utf-8');

    const json = JSON.parse(file);

    const lastId = Number(json.pizzas[json.pizzas.length - 1].id);

    json.pizzas.push({"id": lastId + 1, "size": size, "base": base, "toppings": toppings, "price": parseInt(price), "address": address})

    file = fs.writeFileSync('./orders.json', JSON.stringify(json));

    res.send({
        status: 200,
        message: 'Order placed Successfully'
    });
})

app.delete('/orders', function(req, res){
    const id = req.body.id;
    let file = fs.readFileSync('./orders.json', 'utf-8');
    console.log('deleting')
    const json = JSON.parse(file);
    const pizzas = json.pizzas;
    const filteredJson = pizzas.filter(elem => {
        return elem.id != id;
    })

    file = fs.writeFileSync('./orders.json', JSON.stringify({
        pizzas: filteredJson
    }));

    res.setHeader('Content-type', 'text/json');
    res.send({
        status: 200,
        message: 'Order Sent Successfully'
    });
})

app.post('/item', function(req, res){
    const id = req.body.id;
    const name = req.body.name;
    const section = req.body.section;
    const price = req.body.price;


    res.setHeader('Content-type', 'text/json');
    let file = fs.readFileSync('./items.json', 'utf-8');

    const json = JSON.parse(file);
    if ( section=='base') json.items.base.push({id, name, price})
    if ( section=='topping') json.items.topping.push({id, name, price})
    if ( section=='size') json.items.size.push({id, name, price})

    file = fs.writeFileSync('./items.json', JSON.stringify(json));

    res.send({
        status: 200,
        message: 'Item Added Successfully'
    });
    console.log('Item added')
})


app.put('/item', function(req, res){
    const item = req.body.item;
    const section = (req.body.section).toLowerCase();
    let secGroup;
    console.log(section)
    console.log(item)
    res.setHeader('Content-type', 'text/json');
    let file = fs.readFileSync('./items.json', 'utf-8');

    const json = JSON.parse(file);

    if (section =='base') secGroup = json.items.base;
    if (section =='topping') secGroup = json.items.topping;
    if (section =='size') secGroup = json.items.size;

    console.log(secGroup)

    secGroup.forEach(elem => {
        if(elem.id == item.id) {
            console.log(elem)
            console.log('Item found')
            elem.name = item.name;
            elem.price = item.price;
            console.log(elem)
        }
    });

    console.log(json)

    file = fs.writeFileSync('./items.json', JSON.stringify(json));

    res.send({
        status: 200,
        message: 'Item updated Successfully'
    });
})

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function() {
  var addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
});