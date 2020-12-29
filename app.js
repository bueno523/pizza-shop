
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
//     res.render('admin-page');
// })

// app.get('/customer', function(req, res){
//     res.render('customer-page');
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

    res.setHeader('Content-type', 'text/plain');
    let file = fs.readFileSync('./orders.json', 'utf-8');

    const json = JSON.parse(file);

    json.pizzas.push({"size": size, "base": base, "toppings": toppings, "price": parseInt(price), "address": address})

    file = fs.writeFileSync('./orders.json', JSON.stringify(json));

    res.send('Order sent!');
})

app.put('/items', function(req, res){
    const items = req.items;

    res.setHeader('Content-type', 'text/plain');
    let file = fs.readFileSync('./items.json', 'utf-8');

    const json = JSON.parse(file);

    json.items = items;

    file = fs.writeFileSync('./items.json', JSON.stringify(json));

    res.send('Items saved Successfully');
})

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function() {
  var addr = server.address();
  console.log("Server listening at", addr.address + ":" + addr.port);
});