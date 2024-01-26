const mysql = require('mysql2');
const inquirer = require("inquirer");
const { printTable } = require("console-table-printer");
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'employee_db'
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to the employee_db database.');
});

// Function to view all departments
function viewAllDepartments() {
  const query = `SELECT * FROM department`;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error querying departments:', err);
      return;
    }
    printTable(results, ['id', 'name']);
    promptUser();
  });
}

// Function to view all roles
function viewAllRoles() {
  const query = `SELECT role.id AS role_id, role.title, role.salary, department.name AS department_name FROM role LEFT JOIN department ON role.department_id = department.id`;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error querying roles:', err);
      return;
    }
    printTable(results, ['role_id', 'title', 'salary', 'department_name']);
    promptUser();
  });
}

// Function to view all employees
function viewAllEmployees() {
  const query = `SELECT employee.id AS employee_id, employee.first_name, employee.last_name, role.title AS job_title, department.name AS department_name, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department ON role.department_id = department.id LEFT JOIN employee AS manager ON employee.manager_id = manager.id`;
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error querying employees:', err);
      return;
    }
    printTable(results, ['employee_id', 'first_name', 'last_name', 'job_title', 'department_name', 'salary', 'manager_name']);
    promptUser();
  });
}

// Function to add a department
function addDepartment() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'departmentName',
      message: 'Enter the name of the department:'
    }
  ])
  .then(function (answers) {
    const query = 'INSERT INTO department (name) VALUES (?)';
    db.query(query, [answers.departmentName], (err, result) => {
      if (err) {
        console.error('Error adding department:', err);
        return;
      }
      console.log('Department added successfully!');
      promptUser();
    });
  });
}

// Function to add a role
function addRole() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'roleName',
      message: 'Enter the name of the role:'
    },
    {
      type: 'input',
      name: 'roleSalary',
      message: 'Enter the salary for the role:'
    },
    {
      type: 'input',
      name: 'roleDepartment',
      message: 'Enter the department for the role:'
    }
  ])
  .then(function (answers) {
    const query = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, (SELECT id FROM department WHERE name = ?))';
    db.query(query, [answers.roleName, answers.roleSalary, answers.roleDepartment], (err, result) => {
      if (err) {
        console.error('Error adding role:', err);
        return;
      }
      console.log('Role added successfully!');
      promptUser();
    });
  });
}

// Function to add an employee
function addEmployee() {
  inquirer.prompt([
    {
      type: 'input',
      name: 'employeeFirstName',
      message: 'Enter the employee\'s first name:'
    },
    {
      type: 'input',
      name: 'employeeLastName',
      message: 'Enter the employee\'s last name:'
    },
    {
      type: 'input',
      name: 'employeeRole',
      message: 'Enter the role for the employee:'
    },
    {
      type: 'input',
      name: 'employeeManager',
      message: 'Enter the manager for the employee:'
    }
  ])
  .then(function (answers) {
    const query = 'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, (SELECT id FROM role WHERE title = ?), (SELECT id FROM employee WHERE CONCAT(first_name, " ", last_name) = ?))';
    db.query(query, [answers.employeeFirstName, answers.employeeLastName, answers.employeeRole, answers.employeeManager], (err, result) => {
      if (err) {
        console.error('Error adding employee:', err);
        return;
      }
      console.log('Employee added successfully!');
      promptUser();
    });
  });
}

// Function to update an employee's role
function updateEmployeeRole() {
  const employeesQuery = 'SELECT id, CONCAT(first_name, " ", last_name) AS employee_name FROM employee';
  db.query(employeesQuery, (err, employees) => {
    if (err) {
      console.error('Error querying employees:', err);
      return;
    }

    const rolesQuery = 'SELECT id, title FROM role';
    db.query(rolesQuery, (err, roles) => {
      if (err) {
        console.error('Error querying roles:', err);
        return;
      }

      inquirer.prompt([
        {
          type: 'list',
          name: 'employeeId',
          message: 'Select an employee to update:',
          choices: employees.map(employee => ({ name: employee.employee_name, value: employee.id }))
        },
        {
          type: 'list',
          name: 'newRoleId',
          message: 'Select the new role for the employee:',
          choices: roles.map(role => ({ name: role.title, value: role.id }))
        }
      ])
      .then(function (answers) {
        const updateQuery = 'UPDATE employee SET role_id = ? WHERE id = ?';
        db.query(updateQuery, [answers.newRoleId, answers.employeeId], (err, result) => {
          if (err) {
            console.error('Error updating employee role:', err);
            return;
          }
          console.log('Employee role updated successfully!');
          promptUser();
        });
      });
    });
  });
}

// Prompt user for the next action
function promptUser() {
  inquirer.prompt({
    type: 'list',
    name: 'EmployeeManager',
    message: 'What would you like to do next?',
    choices: ['view all departments', 'view all roles', 'view all employees', 'add a department', 'add a role', 'add an employee', 'update an employee role', 'exit']
  })
  .then(function (results) {
    switch (results.EmployeeManager) {
      case 'view all departments':
        viewAllDepartments();
        break;
      case 'view all roles':
        viewAllRoles();
        break;
      case 'view all employees':
        viewAllEmployees();
        break;
      case 'add a department':
        addDepartment();
        break;
      case 'add a role':
        addRole();
        break;
      case 'add an employee':
        addEmployee();
        break;
      case 'update an employee role':
        updateEmployeeRole();
        break;
      case 'exit':
        console.log('Exiting...');
        db.end(); // Close the database connection
        break;
      default:
        console.log('Not implemented yet for this choice.');
    }
  });
}

// Initial prompt
promptUser();
