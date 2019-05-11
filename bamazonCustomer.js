var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "lovedaddy",
    database: "bamazon_db"
});

let productArry = [];
let stockArry = [];
let priceArry = [];

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    // start();
});

connection.query('SELECT * FROM products', function (error, results, fields) {
    if (error) throw error;
    // console.log(results);

    for (var i = 0; i < results.length; i++) {
        productArry.push(results[i].item_id + " " + results[i].product_name);
        stockArry.push(results[i].stock_quantity);
        priceArry.push(results[i].price);
        // console.log(results[i].item_id + " " + results[i].product_name);
    }
    console.log("Products: " + productArry);
    console.log("Stock Quantities: " + stockArry);
    console.log("Prices: " + priceArry);
});

connection.end();

// function start() {
//     inquirer
//         .prompt({
//             name: "whichproduct",
//             type: "list",
//             message: "Which product would you like to buy?",
//             choices: [productArry]
//         })
    // .then(function(answer) {
    //     // based on their answer, either call the bid or the post functions
    //     if (answer.postOrBid === "POST") {
    //       postAuction();
    //     }
    //     else if(answer.postOrBid === "BID") {
    //       bidAuction();
    //     } else{
    //       connection.end();
    //     }
    //   });
// }