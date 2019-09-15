const mysql = require('mysql');
const inquirer = require('inquirer');
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


function viewProductSales() {
    var query = 'SELECT department_id, department_name, overhead_costs, total_sales, (total_sales-overhead_costs) AS Total_Profit FROM departments';
    connection.query(query,function(error,result){
        if (error) throw error;
        // console.log(result);
        console.table(result);
        connection.end();
    });
}


function createNewDept() {
    inquirer.prompt(
        [
            {
                type:'input',
                name: 'departmentName',
                message:'What is the name of this new department?'
            },
            {
                type: 'input',
                name: 'overheadCosts',
                message: 'What are the over head costs? (Enter a number between 1 - 9000000)'
            }
        ]).then(answers => {
            var query = `INSERT INTO departments (department_name,overhead_costs,total_sales) VALUES ('${answers.departmentName}', '${answers.overheadCosts}', 0)`;
            connection.query(query,function(err,res){
                if (err) throw err;
                console.log('* * SUCCESS * *');
                console.log(`${answers.departmentName} Department has been created!`);
                connection.end();
            });
        });


}




inquirer.prompt([
    {
        type:'list',
        name: 'menu',
        message: 'What would you like to do?',
        choices: ['View Product Sales by Department','Create New Department']
    }
]).then(answers => {

    switch (answers.menu) {
        case 'View Product Sales by Department':
            viewProductSales();
            break;

        case 'Create New Department':
            createNewDept();
            break;

    }
    // console.log(JSON.stringify(answers, null, '  '));
});

