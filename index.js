const mysql = require("mysql2");
const inquirer = require("inquirer");
const { printTable } = require("console-table-printer");
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'employee_db'
}, console.log(`Connected to the employee_db database.`));

// Function to view all departments
function viewAllDepartments() {
    const query = `
        SELECT * FROM department
    `;
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error querying departments:', err);
            return;
        }
        // Displays the formatted table using console-table-printer
        printTable(results, ['id', 'name']);
    });
}

// Function to view all roles
function viewAllRoles() {
    const query = `
        SELECT role.id AS role_id, role.title, role.salary, department.name AS department_name
        FROM role
        LEFT JOIN department ON role.department_id = department.id
    `;
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error querying roles:', err);
            return;
        }
        // Displays the formatted table using console-table-printer
        printTable(results, ['role_id', 'title', 'salary', 'department_name']);
    });
}

inquirer.prompt({
    type: 'list',
    name: 'EmployeeManager',
    message: 'What would you like to do?',
    choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role']
})
.then(function (results) {
    // Handles the specific choices
    switch (results.EmployeeManager) {
        case 'view all departments':
            viewAllDepartments();
            break;
        case 'view all roles':
            viewAllRoles();
            break;
        default:
            console.log('Not implemented yet for this choice.');
    }
});

// Function to view all employees
function viewAllEmployees() {
    const query = `
        SELECT employee.id AS employee_id, 
               employee.first_name, 
               employee.last_name, 
               role.title AS job_title, 
               department.name AS department_name, 
               role.salary, 
               CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name
        FROM employee
        LEFT JOIN role ON employee.role_id = role.id
        LEFT JOIN department ON role.department_id = department.id
        LEFT JOIN employee AS manager ON employee.manager_id = manager.id
    `;
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error querying employees:', err);
            return;
        }
        // Displays the formatted table using console-table-printer
        printTable(results, ['employee_id', 'first_name', 'last_name', 'job_title', 'department_name', 'salary', 'manager_name']);
    });
}

inquirer.prompt({
    type: 'list',
    name: 'EmployeeManager',
    message: 'What would you like to do?',
    choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role']
})
.then(function (results) {
    // Handles the specific choice "view all employees"
    if (results.EmployeeManager === 'view all employees') {
        // Calls the function to view all employees
        viewAllEmployees();
    } else {
        console.log('Not implemented yet for this choice.');
    }
});

