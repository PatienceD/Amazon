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

// let productArry = [];
// let stockArry = [];
// let priceArry = [];

connection.connect(function (err) {
    if (err) {
        console.log("error! " + err);
        return;

    }
    console.log("Connection made! " + connection.threadId);
    items();
});

function items() {
    connection.query('SELECT * FROM products', function (error, results) {
        if (error) throw error;
        // console.log(results);

        for (var i = 0; i < results.length; i++) {
            console.log("Item: " + results[i].item_id + " " + "$" + results[i].price + " " + results[i].product_name);
            // console.log("Product Name: " + results[i].product_name);
            // productArry.push(results[i].item_id + " " + results[i].product_name.split(","));
            // stockArry.push(results[i].stock_quantity);
            // priceArry.push(results[i].price);
            // console.log(results[i].item_id + " " + results[i].product_name);
        }
        // console.log("Products: " + productArry);
        // console.log("Stock Quantities: " + stockArry);
        // console.log("Prices: " + priceArry);

        buyItem();

        // connection.end();
    });
};

function buyItem() {
    inquirer.prompt([{
        name: "id",
        type: "input",
        message: "Which item would you like to buy? (enter id)"
    }, {
        name: "quantity",
        type: "input",
        message: "How many would you like to buy?"
    }]).then(answer => {
        connection.query("SELECT * FROM products", function (err, result) {
            if (err) throw err;

            var chosenItem;
            for (var i = 0; i < result.length; i++) {
                if (result[i].item_id === parseInt(answer.itemId)) {
                    chosenItem = result[i];
                }
            }

            if (chosenItem.stock_quantity > parseInt(answer.quantity)) {
                connection.query("UPDATE products SET ? WHERE ?", [
                    {
                        stock_quantity: (chosenItem.stock_quantity - parseInt(answer.quantity))
                    },
                    {
                        item_id: chosenItem.item_id
                    }
                ],
                    function (error) {
                        if (error) throw error;
                        console.log("Thank you for shopping with us! Your total is " + "$" + parseInt(answer.quantity) * chosenItem.price)
                    });
            } else {
                console.log("We're sorry, we don't have enough of that in stock right now.");
            }
        });
    });
};