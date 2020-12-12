const connection = require("./connection/connection");
const inquirer = require("inquirer");
const { rootQuestion, employeeQuestion } = require("./library/questions")

// connection.connect(function(err) {
//     if (err) throw err;
//     // run the start function after the connection is made to prompt the user
//     start();
// });



// Top level inquirer questions 
function runApp(){
    inquirer.prompt(    
    {
        type: "list",
        message: "What would you like to do?",
        name: "root",
        choices: [
            "View all employees",
            "View all employees by department",
            "Add an employee"
        ]
    })
    .then( (answers) => {
        switch (answers.root) {
        case "View all employees":
        viewAll();
        break;
        // case "View all employees by department":
        // viewDepartments();
        // break;
        // case "Add an employee":
        // addEmployee();
        // break;
        }
    }
).catch((err) => console.log(err))}


// Displays all employees
function viewAll(){
    var query = 'SELECT * FROM employees_DB.employee' 
    connection.query(query, (err, res) => {
        if (err) throw err
        var employeeArray = [];
        for(i = 0; i < res.length; i++){
            employeeArray.push(JSON.stringify(res[i]))
        }


        inquirer.prompt(
            {
                type: "list",
                message: "Please select an employee",
                name: "employee",
                choices: employeeArray
            }
        ).then( (answers) => {
            console.log("Employee: " + (answers.employee) + " || Department: " + (answers.department) + " || Manager: " + (answers.manager));
            
        }).catch( (err) => {if (err) console.log(err) })
    })
    runApp();
};


runApp();