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
        message: "How many units would you like to purchase? (Enter a number between 1 - 10)"
  }
      ])
      .then(answers => {

        // console.log(JSON.stringify(answers, null, '  '));
        customer_product_id = parseInt(answers.product_id);
        customer_units = parseInt(answers.units);

        searchQuery = 'SELECT * FROM products WHERE id = ' + parseInt(customer_product_id);

        connection.query(searchQuery,function(err, res){
            if (err) throw err;


            // console.log(res);
            var quantity = res[0].stock_quantity;
            var total_cost = res[0].price * customer_units;

            console.log(`You are purchasing ${customer_units} ${res[0].product_name}'s for ${res[0].price} each\n`);
            if (customer_units <= quantity) {
                var new_quantity = quantity - customer_units;
                var updateQuery = `UPDATE products SET stock_quantity = ${new_quantity} WHERE id = ${customer_product_id}`;

                connection.query(updateQuery, function(err,sqlresult) {
                    if (err) throw err;

                    console.log('* * PURCHASE SUCCESSFUL * *\n');
                    console.log('Your total cost is:' + total_cost);

                });
            }
            else {
                console.log('* * PURCHASE UNSUCCESSFUL * *\n');
                console.log(`Insufficient Quantity!\nWe do not have that many ${res[0].product_name}'s in stock!`);
            }

            connection.end();
        });





      });


});







