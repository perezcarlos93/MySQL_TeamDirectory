
const rootQuestion = [
    {
        type: "list",
        message: "What would you like to do?",
        name: "root",
        choices: [
            "View all employees",
            "View all employees by department",
            "Add an employee"
        ]
    }
]

const employeeQuestion = [
    {
        type: "input",
        message: "Please enter employees first name",
        name: "firstName"
    },
    {
        type: "input",
        message: "Please enter employees last name",
        name: "lastName"
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
        type: "input",
        message: "Please enter employees Manager",
        name: "manager",
        choices: [
            "Rachael Host",
            "Barry Goldberg",
            "Alberto Cortez"
        ]
    },
]


// function viewAll(){
//     app.get('', (req, res) => {
//         res.json()
//     })
// }

module.exports = { rootQuestion, employeeQuestion }