var mysql = require('mysql');
var inquirer = require('inquirer');
const cTable = require('console.table');

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    user: "root",
    password: "password",
    database: "Bamazon"
});

connection.connect(function(err) {
    if (err) throw err;
    // console.log("connected as id " + connection.threadID);

});


function viewAllProducts() {
    var query = 'SELECT * FROM products;'


    connection.query(query, function(err,res){
        if (err) throw err;

        console.table(res);
        connection.end();
    });

}

function viewLowInventory() {
    var query = 'SELECT * FROM products WHERE stock_quantity < 5';
    connection.query(query, function(err,res){
        if (err) throw err;

        console.table(res);
        connection.end();
    });
}

function addToInventory() {

    var products = [];
    var query = 'SELECT product_name FROM products';
    connection.query(query, function(err,res){
        if (err) throw err;
        res.forEach(function(product){
            products.push(product.product_name);
        });
        // console.log(products);

        inquirer.prompt
        ([
            {
              type: 'list',
              name: 'productToAddTo',
              message: 'Which would you like to add to?',
              choices: products
          },
          {
              type: 'input',
              name: 'unitsToAdd',
              message: 'How many units would you like to add? (Enter a number between 1 - 100)'
          }

      ]).then(answers => {

        var searchQuery = `SELECT * FROM products WHERE product_name = '${answers.productToAddTo}'`;
        var productID;
        connection.query(searchQuery, function(err,results){
            if (err) throw err;
            // console.log(results);
            productID = results[0].id;
            // console.log(productID);
            var newTotal = parseInt(answers.unitsToAdd) + parseInt(results[0].stock_quantity);
            var query = `UPDATE products SET stock_quantity = ${newTotal} WHERE id = ${productID}`;
            connection.query(query,function(err,res){
                if (err) throw err;
                console.log(`* * SUCCESS * *\nYou've added ${answers.unitsToAdd} units to the ${answers.productToAddTo} stock!`);
            });



            connection.end();
        });


        // connection.query(query, function(err,res){
        //     if (err) throw err;
        //     console.log(res);
        //     connection.end();
        // });
        // console.log(JSON.stringify(answers, null, '  '));

        });




    });


}

inquirer.prompt
(
    {
      type: 'list',
      name: 'menu',
      message: 'What would you like to do?',
      choices: [
          'View Products for Sale',
          'View Low Inventory',
          'Add to Inventory',
          'Add New Product'
      ]
    }

).then(answers => {

    switch (answers.menu) {
        case 'View Products for Sale':
            viewAllProducts();
            break;
        case 'View Low Inventory':
            viewLowInventory();
            break;
        case 'Add to Inventory':
            addToInventory();

            break;

        case 'Add New Product':
            break;

    }
    // console.log(JSON.stringify(answers, null, '  '));
  });
