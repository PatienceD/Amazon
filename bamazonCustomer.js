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

        for (var i = 0; i < results.length; i++) {
            console.log("Item ID: " + results[i].item_id + " " + "$" + results[i].price + " " + results[i].product_name);
        }
        buyItem();

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
        connection.query('SELECT * FROM products', function (err, results) {
            if (err) throw err;

            let chosenItem;
            for (var i = 0; i < results.length; i++) {

                if (results[i].item_id === parseInt(answer.id)) {
                    chosenItem = results[i];
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
            connection.end();
        });
    });
};
