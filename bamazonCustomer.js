var mysql = require("mysql");
var inquirer = require('inquirer');


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

connection.query('SELECT * FROM products', function(err,results) {
    if (err) throw err;
    console.log(`ID\t|\tName\n`);
    results.forEach(function(product){
        console.log(`${product.id}\t|\t${product.product_name}\t\t($${product.price})`);
    });

    console.log('\n');

    var customer_product_id;
    var customer_units;

    inquirer
      .prompt([
          {
            type: 'list',
            name: 'product_id',
            message: 'Which product would you like to purchase? (Select ID)',
            choices: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
        },
        {
        type: 'input',
        name: 'units',
        message: "How many units would you like to purchase?(enter a number between 0 - 10)"
  }
      ])
      .then(answers => {

        // console.log(JSON.stringify(answers, null, '  '));
        customer_product_id = answers.product_id;
        customer_units = parseInt(answers.units);

        searchQuery = 'SELECT * FROM products WHERE id = ' + parseInt(customer_product_id);

        connection.query(searchQuery,function(err, res){
            if (err) throw err;


            console.log(res);
            var quantity = res[0].stock_quantity;
            if (customer_units <= quantity) {
                updateQuery = 'UPDATE'
            }
            else {
                console.log('Insufficient Quantity!');
            }

            connection.end();
        });





      });


});







