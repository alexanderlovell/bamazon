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
    console.log('started');
    inquirer.prompt([
        {
            type: 'rawlist',
            message: 'Whatchu want?',
            choices: ['See Stock', 'See Low Inventory', 'Add to Inventory', 'Add New Product', 'Exit'],
            name: 'action'
        },
    ]).then(function (user){
        switch(user.action) {
            case 'See Stock':
                seeProducts();
                break;
            case 'See Low Inventory':
                seeLowInventory();
                break;
            case 'Add to Inventory':
                addInventory();
                break;
            case 'Add New Product':
                addProduct();
                break;
            case 'Exit':
                exit();
                break;
        };
    });
};

function seeProducts() {
    connection.query('SELECT * FROM products', function(err, res) {
        if (err) throw err;

        var table = new Table({
        head: ['Product ID', 'Product Name', 'Department Name', 'Price', 'Quantity'],
        colWidths: [15, 20, 20, 15, 15],
        });

        for(i=0; i<res.length; i++) {
            table.push(
            [res[i].ItemID, res[i].ProductName, res[i].DepartmentName, parseFloat(res[i].Price).toFixed(2), res[i].StockQuantity]
            );
        };

    console.log(table.toString());

    // call next function
    selection();
    });
};

function seeLowInventory() {
	connection.query('SELECT * FROM products', function(err, res) {
	    if (err) throw err;

        var table = new Table({
            head: ['Product ID', 'Product Name', 'Department Name', 'Price', 'Quantity'],
            colWidths: [15, 20, 20, 15, 15],
            });
		
		for(var i = 0; i < res.length; i++) {
			if(res[i].StockQuantity < 5) {		//Will only push products with less than 5 quantity
				table.push(
			    	[res[i].ItemID, res[i].ProductName, res[i].DepartmentName, parseFloat(res[i].Price).toFixed(2), res[i].StockQuantity]
				);
			}
		}

		if(table.length > 0) {
	    	console.log("\nHere are low quantity products (less than 5):");		
			console.log(table.toString());			
		} else {
			console.log("\nThere are no low quantity products right now!\n");
		}

		selection();
	});
}

function addInventory() {
	connection.query('SELECT * FROM products', function(err, res) {
	    if (err) throw err;

        var table = new Table({
            head: ['Product ID', 'Product Name', 'Department Name', 'Price', 'Quantity'],
            colWidths: [15, 20, 20, 15, 15],
            });
		
		for(var i = 0; i < res.length; i++) {
			table.push(
			    [res[i].ItemID, res[i].ProductName, res[i].DepartmentName, parseFloat(res[i].Price).toFixed(2), res[i].StockQuantity]
			);
		}
		
		console.log(table.toString());
		inquirer.prompt([
		{
			type: "number",
			message: "Which product would you like to add to? (the Product ID)",
			name: "itemNumber"
		},
		{
			type: "number",
			message: "How many more would you like to add?",
			name: "howMany"
		},
		]).then(function (user) {
			var newQuantity = parseInt(res[user.itemNumber - 1].StockQuantity) + parseInt(user.howMany);
			connection.query("UPDATE products SET ? WHERE ?", [{
    			StockQuantity: newQuantity
    		}, {
    			ItemID: user.itemNumber
    		}], function(error, results) {
    			if(error) throw error;

	    		console.log("\nYour quantity has been updated!\n");
	    		selection();
		    });

		});
	});
}

function addProduct() {
	inquirer.prompt([
	{
		type: "input",
		message: "What is the product name?",
		name: "itemName"
	},
	{
		type: "input",
		message: "In which department is it?",
		name: "itemDepartment"
	},
	{
		type: "number",
		message: "What is it's price?",
		name: "itemPrice"
	},
	{
		type: "number",
		message: "How many do we have of this product?",
		name: "itemQuantity"
	},
	]).then(function (user) {
		connection.query("INSERT INTO products SET ?", {
			ProductName: user.itemName,
			DepartmentName: user.itemDepartment,
			Price: user.itemPrice,
			StockQuantity: user.itemQuantity
		}, function(err, res) {
			if(err) throw err;

            console.log("\nYour product has been added!\n");
            
			selection();
		});
	});
}

function exit() {
	connection.end();
	console.log("Have a nice day");
}

selection();