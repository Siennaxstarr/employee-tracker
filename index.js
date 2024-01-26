const mysql = require("mysql2");
const inquirer = require("inquirer");
const { printTable } = require("console-table-printer")
const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username,
        user: 'root',
        // TODO: Add MySQL password here
        password: 'root',
        database: 'employee_db'
    },
    console.log(`Connected to the employee_db database.`)
);

inquirer.prompt(

    {
        type: 'list',
        name: 'EmployeeManager',
        message: 'WHat would you like to do?',
        choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', ' add an employee', 'update an employee role']
    },
)
.then(function (results) {
    console.log(results);
});
