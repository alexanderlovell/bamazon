// let manager = require('bamazon-manager.js');
// let supervisor = require('bamazon-supervisor.js');
const inquirer = require('inquirer');
const mysql = require('mysql');
const Table = require('cli-table');
var keys = require('./keys.js');

var connection = mysql.createConnection(keys.connection);
// check keys when getting error 'Cannot read property 'host' of undefined'
// keys looks like:
// exports.connection = {
// 	host: 'localhost',
// 	port: 3306,
// 	user: 'root',
// 	password: '',
// 	database: 'bamazon_db'
// };

connection.connect(function(err) {
    if(err) throw err;
});

function selection() {
    connection.query('SELECT * FROM products', function(err, res) {
        if(err) throw err;

        // Set up table and populate
        var table = new Table({
            head: ['Product ID', 'Product Name', 'Department Name', 'Price', 'Quantity'],
            colWidths: [15, 20, 20, 15, 15],
        });

        for (var i=0; i<res.length; i++) {
            table.push(
                [res[i].ItemID, res[i].ProductName, res[i].DepartmentName, parseFloat(res[i].Price).toFixed(2), res[i].StockQuantity]
                // price only works with parseFloat
                // parseFloat function parses an argument and returns a floating point number
                // toFixed method formats a number using fixed-point notation
            );
        }
        console.log(table.toString());

        // Inquirer
        inquirer.prompt([
            {
                type: 'number',
                message: 'Enter product ID for item you want to purchase',
                name: 'itemNumber'
            },
            {
                type: 'number',
                message: 'How many of this item do you want?',
                name: 'howMany'
            },

        ]).then(function(user) {
            connection.query('SELECT * FROM products JOIN departments ON products.DepartmentName', function(err, res){
                if(err) throw err;

                if(res[user.itemNumber--].StockQuantity > user.howMany) {
                    var newQuantity = parseInt(res[user.itemNumber--].StockQuantity) - parseInt(user.howMany);
                    // parseInt() function parses a string argument and returns an integer of the specified radix (the base in mathematical numeral systems).
                    var total = parseFloat(user.howMany) * parseFloat(res[user.itemNumber--].Price);
                    total = total.toFixed(2);

                    var departmentTotal = parseFloat(total) + parseFloat(res[user.itemNumber--].TotalSales);
                    departmentTotal = departmentTotal.toFixed(2);

                    connection.query('UPDATE departments SET ? WHERE ?', [{
                        TotalSales: departmentTotal
                    }, 
                    {
                        DepartmentName: res[user.itemNumber--].DepartmentName
                    }],
                    function(err, res) {
                        if(err) throw err;

                        // Tell user their order is complete
                        console.log('Your order for ' + user.howMany + 'of ' + res[user.itemNumber -1].ProductName + ' is complete');
                        console.log('Your total is $' + total);
                        
                        // Start orderMore function
                        orderMore();
                    });
                } else {
                    // tell user why order was not completed
                    console.log('Not enough in stock. We only have ' + res[user.itemNumber--].StockQuantity + ' in stock');
                    orderMore();
                };
            });
        });
    });
};