const connection = require("./connection/connection");
const inquirer = require("inquirer");
const { rootQuestion, employeeQuestion } = require("./library/questions")

// Top level inquirer questions app
function runApp(){
    inquirer.prompt(rootQuestion)    
    .then( (answers) => {
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
        case "Exit":
        exit();
        break
        }
    }
).catch((err) => console.log(err))}


// Displays all employees
function viewAll(){
    let query = 'SELECT * FROM employees_DB.employee' 
    connection.query(query, (err, res) => {
        if (err) throw err
        var employeeArray = [];
        for(i = 0; i < res.length; i++){
            employeeArray.push(JSON.stringify(res[i].fullName))
        }

        inquirer.prompt(
            {
                type: "list",
                message: "Please select an employee",
                name: "employee",
                choices: employeeArray
            }
        ).then( (answers) => {
            console.log(answers.employee)
            let query = 'SELECT * FROM employees_db.employee WHERE fullName=?'
            connection.query(query, [answers.employee], (err, res) => {
                if (err) throw err
                console.log(res)
                console.log("Employee: " + (JSON.stringify(res.firstName)) + " || Department: " + (res.department) + " || Manager: " + (res.manager));
            })

            runApp();
            
        })
        // .catch( (err) => {if (err) console.log(err) })
        
    })
};

// Adds a new employee
function addEmployee(){
    inquirer.prompt(employeeQuestion)
    .then((answers) => {
        let query = `INSERT INTO employee (fullName, department, manager)
        VALUES (?, ?, ?)`;
        connection.query(query, [answers.name, answers.department, answers.manager], function(err, res){
            if (err) throw err
            console.log("Employee details added " + res)
        })
        runApp();
    })
}


function viewByDepartment(){

    inquirer.prompt(
        {
            type: "list",
            message: "Please select a department to view",
            name: "department",
            choices: [
                "Designer",
                "Developer",
                "Quality Control"
            ]
        }
    ).then((answers) => {
        let query = "SELECT * FROM employee WHERE department = ?"
        connection.query(query, [answers.department], (err, res) => {
            if (err) throw err;

            if(res){
                console.log(res)
            } else if(res === []){ 
                console.log("No employees in this department")
            }
        })
    runApp()
    })

};

function exit(){
    inquirer.prompt(
        {
            type: "confirm",
            message: "Are you sure you'd like to exit?",
            name: "exit"
        }
    ).then((answers) => {
        if(answers.exit){
            console.log("\x1b[42m", "Thank you for using the employee directory! Goodbye")
        }else {
            runApp();
        }
    })
}

runApp();