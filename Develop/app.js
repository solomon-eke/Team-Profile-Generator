const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");
const util = require("util");

const writeFileAsync = util.promisify(fs.writeFile);

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

let employees = [];

async function promptUser() {
    do {

        var response = await inquirer.prompt(
            [

                {
                    type: 'list',
                    name: 'role',
                    message: 'Would you like to add a manager, engineer, or intern?',
                    choices: [
                        'Manager',
                        'Engineer',
                        'Intern',
                    ]
                },

                {
                    type: 'list',
                    name: 'role',
                    message: 'Would you like to add an engineer or intern?',
                    choices: [
                        'Engineer',
                        'Intern',
                        'Done adding team members'
                    ],
                    when: function (answers) {
                        return answers.addAnotherEmployee;
                    }
                },
                {
                    type: 'input',
                    name: 'name',
                    message: 'What is the name of this team member?'
                },
                {
                    type: 'input',
                    name: 'email',
                    message: "What is the team member's email?"
                },
                {
                    type: 'input',
                    name: 'id',
                    message: "What is the team member's ID?"
                },
                {
                    type: 'input',
                    name: 'officeNumber',
                    message: "What is the team member's office number?",
                    when: function (answers) {
                        return answers.role === 'Manager';
                    }
                },
                {
                    type: 'input',
                    name: 'github',
                    message: "What is the team member's gitlab username?",
                    when: function (answers) {
                        return answers.role === 'Engineer';
                    }
                },
                {
                    type: 'input',
                    name: 'school',
                    message: "What is the team member's school name?",
                    when: function (answers) {
                        return answers.role === 'Intern'
                    }
                },

                {
                    type: 'confirm',
                    name: 'addEmployee',
                    message: 'Would you like to add another team member?'
                }

            ]
        )

        if (response.role === 'Manager') {
            const manager = new Manager(response.name, response.id, response.email, response.officeNumber);
            employees.push(manager)
        }
        else if (response.role === 'Engineer') {
            const engineer = new Engineer(response.name, response.id, response.email, response.github);
            employees.push(engineer);
        }
        else if (response.role === 'Intern') {
            const intern = new Intern(response.name, response.id, response.email, response.school);
            employees.push(intern);
        }
        console.log(employees)

    } while (response.addEmployee);
    render(employees);

};

async function writeToFile() {
    try {

        await promptUser()
        writeFileAsync(
            outputPath,
            render(employees),
            "utf8"
        );

        console.log("Successfully wrote to team.html!");
    } catch (err) {
        console.log(err);
    }
};

writeToFile();
