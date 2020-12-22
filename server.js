const connection = require("./connection/connection");
const inquirer = require("inquirer");
const Table = require("cli-table");
const {
  rootQuestion,
  employeeQuestion,
  managerQuestion,
} = require("./library/questions");

// Top level inquirer questions app
function runApp() {
  inquirer
    .prompt(rootQuestion)
    .then((answers) => {
      switch (answers.root) {
        case "View all employees":
          viewAll();
          break;
        case "View all employees by department":
          viewByDepartment();
          break;
        case "Add an employee":
          addEmployee();
          break;
        case "Remove an employee":
          deleteEmployee();
          break;
        case "Add a Manager":
          addManager();
          break;
        case "Exit":
          exit();
          break;
      }
    })
    .catch((err) => console.log(err));
}

// Displays all employees
function viewAll() {
  let query = "SELECT * FROM employees_DB.employee";
  connection.query(query, (err, res) => {
    if (err) throw err;

    const table = new Table({
      head: ["id", "Name", "Department", "Manager"],
      colWidths: [10, 20, 20, 20],
    });

    for (i = 0; i < res.length; i++) {
      table.push([
        res[i].id,
        res[i].fullName,
        res[i].department,
        res[i].manager,
      ]);
    }

    console.log("");
    console.log(table.toString());
  });

  console.log("-------------------------------------------");

  runApp();
}

// Adds a new employee
function addEmployee() {
  inquirer
    .prompt(employeeQuestion)
    .then((answers) => {
      let postQuery = `INSERT INTO employee (fullName, department, manager)
        VALUES (?, ?, ?)`;
      connection.query(
        postQuery,
        [answers.name, answers.department, answers.manager],

        function (err, res) {
          if (err) throw err;
          if (res) {
            console.log("");
            console.log(`Employee added: ${res} `);
            // displayNewEmployee(res);
          }
        }
      );

      runApp();
    })
    .catch((error) => console.log(error));
}

function deleteEmployee() {
  try {
    const question = {
      type: "list",
      message: "Please select an employee to remove",
      name: "employee",
      choices: [],
    };

    connection.query(`SELECT * FROM employees_DB.employee`, (err, res) => {
      if (err) throw err;

      function pushToArray(query) {
        for (i = 0; i < query.length; i++) {
          question.choices.push(query[i].fullName);
        }
      }
      pushToArray(res);

      inquirer
        .prompt(question)
        .then((answers) => {
          let query = `DELETE FROM employees_DB.employee WHERE fullName=?`;
          connection.query(query, [answers.employee], (err, res) => {
            if (err) throw err;

            console.log("");
            console.log(`${answers.employee} successfully removed`);
          });
        })
        .catch((err) => console.log(err));
    });
  } catch (err) {
    console.log(err);
  }
  runApp();
}

// Adds a new Manager
function addManager() {
  inquirer
    .prompt(managerQuestion)
    .then((answers) => {
      employeeQuestion[2].choices.push(answers.managerName);

      runApp();
    })
    .catch((error) => console.log(error));
}

function viewByDepartment() {
  inquirer
    .prompt({
      type: "list",
      message: "Please select a department to view",
      name: "department",
      choices: ["Designer", "Developer", "Quality Control", "Return"],
    })
    .then((answers) => {
      let query = "SELECT * FROM employee WHERE department = ?";
      connection.query(query, [answers.department], (err, res) => {
        if (err) throw err;

        if (answers.department === "Return") {
          runApp();
        } else if (res) {
          const table = new Table({
            head: ["id", "Name", "Manager"],
            colWidths: [10, 20, 20],
          });

          for (i = 0; i < res.length; i++) {
            table.push([res[i].id, res[i].fullName, res[i].manager]);
          }
          console.log("");
          console.log(table.toString());
        } else console.log("No employees in this department");
      });
      runApp();
    });
}

function exit() {
  inquirer
    .prompt({
      type: "confirm",
      message: "Are you sure you'd like to exit?",
      name: "exit",
    })
    .then((answers) => {
      if (answers.exit) {
        console.log(
          "\x1b[42m",
          "Thank you for using the employee directory! Goodbye"
        );
      } else {
        runApp();
      }
    });
}

// DO NOT DELETE. FUNCTION IS IN DEVELOPMENT
// Function is meant to run in conjunction with
// the add employee function to display the newly
// added employee into a cli-table

// =============================================================================
function displayNewEmployee(res) {
  let getQuery = `Select * FROM employee WHERE id=?`;
  connection.query(getQuery, [res.insertID], function (res2, err2) {
    if (err2) throw err2;

    if (res2) {
      const table = new Table({
        head: ["id", "Name", "Department", "Manager"],
        colWidths: [10, 20, 20, 20],
      });

      for (i = 0; i < res.length; i++) {
        table.push([
          res2[i].id,
          res2[i].fullName,
          res2[i].department,
          res2[i].manager,
        ]);
      }

      console.log(table.toString());
    }
  });
}
// =============================================================================

runApp();
