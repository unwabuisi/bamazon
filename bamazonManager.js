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
        if (res.length == 0) {
            console.log('\n N/A -- All products have more than 5 units in stock!\n');
        }
        else {
            console.table(res);
        }
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
                console.log('Here is the updated listing of all products\n\n');
            });
            viewAllProducts();
        });

        });
    });
}

function addNewProduct() {
    inquirer.prompt
    ([
        {
            type:'input',
            name:'productName',
            message:'What is the name of this new product?'
        },
        {
            type:'input',
            name:'department',
            message:'What store department does it belong to?'
        },
        {
            type:'input',
            name:'price',
            message:'What is the price of this new product? (ex: 1899.99)'
        },
        {
            type:'input',
            name:'stock',
            message:'What is the beginning stock quantity? (Enter a number between 1 - 1000)'
        }

    ]).then(answers => {
        var product = answers.productName;
        var dept = answers.department;
        var price = parseFloat(answers.price);
        var stock = parseInt(answers.stock);
        var deptQuery = 'SELECT * FROM departments';

        connection.query(deptQuery, function(err,results){
            var deptIncorrect = true;
            results.forEach(function(result,index){
                if (dept == result.department_name) {
                    deptIncorrect = false;
                    var query = `INSERT INTO products (product_name, department_name, price, stock_quantity, product_sales,dept_id) VALUES ("${product}","${dept}",${price},${stock},0,${result.department_id})`;
                    connection.query(query,function(err,res){
                        if (err) throw err;
                        console.log('* * SUCCESS * *');
                        console.log(`You've added a new product: ${product} -- units: ${stock}`);
                        connection.end();
                    });
                }
            });
            if (deptIncorrect) {
                console.log('* * FAILED * *');
                console.log('The department you are trying to add this product to does not exist or has been mispelled. Try again!');
                connection.end();
            }
        });

    });
}



// MAIN Program ---------------
inquirer.prompt
(
    {
      type: 'list',
      name: 'menu',
      message: 'What would you like to do?',
      choices: [
          'View Products for Sale',
          'View Low Inventory (Stock less than 5 units)',
          'Add to Inventory',
          'Add New Product'
      ]
    }

).then(answers => {

    switch (answers.menu) {
        case 'View Products for Sale':
            viewAllProducts();
            break;
        case 'View Low Inventory (Stock less than 5 units)':
            viewLowInventory();
            break;
        case 'Add to Inventory':
            addToInventory();
            break;
        case 'Add New Product':
            addNewProduct();
            break;
    }
    // console.log(JSON.stringify(answers, null, '  '));
  });
