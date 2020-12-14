
const rootQuestion = [
    {
        type: "list",
        message: "What would you like to do?",
        name: "root",
        choices: [
            "View all employees",
            "View all employees by department",
            "Add an employee",
            "Exit"
        ]
    }
]

const employeeQuestion = [
    {
        type: "input",
        message: "Please enter employees name",
        name: "name"
    },
    {
        type: "list",
        message: "Please chose employee's department",
        name: "department",
        choices: [
            "Designer",
            "Developer",
            "Quality Control"
        ]
    },
    {
        type: "list",
        message: "Please enter employees Manager",
        name: "manager",
        choices: [
            "Rachael Host",
            "Barry Goldberg",
            "Alberto Cortez"
        ]
    },
]


module.exports = { rootQuestion, employeeQuestion }