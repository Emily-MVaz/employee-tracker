const connection = require("./connection");
const validate = require("./validation");
const inquirer = require("inquirer");
const consoleTable = require("console.table");
const chalk = require("chalk");
const figlet = require("figlet");

// Title and connect
connection.connect((error) => {
  if (error) throw error;
  console.log(
    chalk.magenta.bold(
      `=================================================================`
    )
  );
  console.log(``);
  console.log(chalk.magentaBright.bold(figlet.textSync("Employee Tracker")));
  console.log(``);
  console.log(
    chalk.magenta.bold(
      `=================================================================`
    )
  );
  promptUser();
});

// WHEN I start the application I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
const promptUser = () => {
  inquirer
    .prompt([
      {
        name: "choices",
        type: "list",
        message: "Please choose an option:",
        choices: [
          "View All Departments",
          "View All Roles",
          "View All Employees",
          "Add Department",
          "Add Role",
          "Add Employee",
          "Update Employee Role",
        ],
      },
    ])
    .then((answers) => {
      const { choices } = answers;

      // choose to view all departments
      if (choices === "View All Departments") {
        view;
      }
    });
};

// -------------------View choices-------------------
// WHEN I choose to view all departments I am presented with a formatted table showing department names and department ids
const viewAllDepartments = () => {
  const sql = `SELECT department.id AS id, department.department_name AS department FROM department`;
  connection.promise().query(sql, (error, respomse) => {
    if (error) throw error;
    console.log(
      chalk.magenta.bold(
        `====================================================================================`
      )
    );
    console.log(
      `                            ` +
        chalk.magentaBright.bold(`All Departments:`)
    );
    console.log(
      chalk.magenta.bold(
        `====================================================================================`
      )
    );
    console.table(response);
    console.log(
      chalk.magenta.bold(
        `====================================================================================`
      )
    );
    promptUser();
  });
};

// WHEN I choose to view all roles I am presented with the job title, role id, the department that role belongs to, and the salary for that role
const viewAllRoles = () => {
  console.log(
    chalk.magenta.bold(
      `====================================================================================`
    )
  );
  console.log(
    `                              ` +
      chalk.magentaBright.bold(`Current Employee Roles:`)
  );
  console.log(
    chalk.magenta.bold(
      `====================================================================================`
    )
  );
  const sql = `SELECT role.id, role.title, department.department_name AS department
                        FROM role
                        INNER JOIN department ON role.department_id = department.id`;
  connection.promise().query(sql, (error, response) => {
    if (error) throw error;
    response.forEach((role) => {
      console.log(role.title);
    });
    console.log(
      chalk.magenta.bold(
        `====================================================================================`
      )
    );
    promptUser();
  });
};

// WHEN I choose to view all employees I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
const viewAllEmployees = () => {
  let sql = `SELECT employee.id, 
                        employee.first_name, 
                        employee.last_name, 
                        role.title, 
                        department.department_name AS 'department', 
                        role.salary
                        FROM employee, role, department 
                        WHERE department.id = role.department_id 
                        AND role.id = employee.role_id
                        ORDER BY employee.id ASC`;
  connection.promise().query(sql, (error, response) => {
    if (error) throw error;
    console.log(
      chalk.magenta.bold(
        `====================================================================================`
      )
    );
    console.log(
      `                              ` +
        chalk.magentaBright.bold(`Current Employees:`)
    );
    console.log(
      chalk.magenta.bold(
        `====================================================================================`
      )
    );
    console.table(response);
    console.log(
      chalk.magenta.bold(
        `====================================================================================`
      )
    );
    promptUser();
  });
};

// -------------------Add Choices-------------------
// WHEN I choose to add a department I am prompted to enter the name of the department and that department is added to the database
const addDepartment = () => {
  inquirer
    .prompt([
      {
        name: "newDepartment",
        type: "input",
        message: "Enter your Depaertment's name:",
        validate: validate.validateString,
      },
    ])
    .then((answer) => {
      let sql = `INSERT INTO department (department_name) VALUES (?)`;
      connection.query(sql, answer.newDepartment, (error, response) => {
        if (error) throw error;
        console.log(``);
        console.log(
          chalk.magentaBright(answer.newDepartment + ` Department created!`)
        );
        console.log(``);
        viewAllDepartments();
      });
    });
};

// WHEN I choose to add a role I am prompted to enter the name, salary, and department for the role and that role is added to the database
const addRole = () => {
  const sql = "SELECT * FROM department";
  connection.promise().query(sql, (error, response) => {
    if (error) throw error;
    let deptNamesArray = [];
    response.forEach((department) => {
      deptNamesArray.push(department.department_name);
    });
    deptNamesArray.push("Create Department");
    inquirer
      .prompt([
        {
          name: "departmentName",
          type: "list",
          message: "Which department is this new role in?",
          choices: deptNamesArray,
        },
      ])
      .then((answer) => {
        if (answer.departmentName === "Create Department") {
          this.addDepartment();
        } else {
          addRoleResume(answer);
        }
      });

    const addRoleResume = (departmentData) => {
      inquirer
        .prompt([
          {
            name: "newRole",
            type: "input",
            message: "Enter the name of the new role:",
            validate: validate.validateString,
          },
          {
            name: "salary",
            type: "input",
            message: "What is the salary of this new role?",
            validate: validate.validateSalary,
          },
        ])
        .then((answer) => {
          let createdRole = answer.newRole;
          let departmentId;

          response.forEach((department) => {
            if (departmentData.departmentName === department.department_name) {
              departmentId = department.id;
            }
          });

          let sql = `INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)`;
          let crit = [createdRole, answer.salary, departmentId];

          connection.promise().query(sql, crit, (error) => {
            if (error) throw error;
            console.log(
              chalk.magenta.bold(
                `====================================================================================`
              )
            );
            console.log(chalk.magentaBright(`Role created!`));
            console.log(
              chalk.magenta.bold(
                `====================================================================================`
              )
            );
            viewAllRoles();
          });
        });
    };
  });
};

// WHEN I choose to add an employee I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
const addEmployee = () => {
  inquirer
    .prompt([
      {
        type: "input",
        name: "fistName",
        message: "Please enter the employee's first name:",
        validate: (addFirstName) => {
          if (addFirstName) {
            return true;
          } else {
            console.log("Please enter a first name");
            return false;
          }
        },
      },
      {
        type: "input",
        name: "lastName",
        message: "Please enter the employee's last name:",
        validate: (addLastName) => {
          if (addLastName) {
            return true;
          } else {
            console.log("Please enter a last name");
            return false;
          }
        },
      },
    ])
    .then((answer) => {
      const crit = [answer.fistName, answer.lastName];
      const roleSql = `SELECT role.id, role.title FROM role`;
      connection.promise().query(roleSql, (error, data) => {
        if (error) throw error;
        const roles = data.map(({ id, title }) => ({ name: title, value: id }));
        inquirer
          .prompt([
            {
              type: "list",
              name: "role",
              message: "What is the employee's role?",
              choices: roles,
            },
          ])
          .then((roleChoice) => {
            const role = roleChoice.role;
            crit.push(role);
            const managerSql = `SELECT * FROM employee`;
            connection.promise().query(managerSql, (error, data) => {
              if (error) throw error;
              const managers = data.map(({ id, first_name, last_name }) => ({
                name: first_name + " " + last_name,
                value: id,
              }));
              inquirer
                .prompt([
                  {
                    type: "list",
                    name: "manager",
                    message: "Who is the employee's manager?",
                    choices: managers,
                  },
                ])
                .then((managerChoice) => {
                  const manager = managerChoice.manager;
                  crit.push(manager);
                  const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
                                    VALUES (?, ?, ?, ?)`;
                  connection.query(sql, crit, (error) => {
                    if (error) throw error;
                    console.log("Employee has been added!");
                    viewAllEmployees();
                  });
                });
            });
          });
      });
    });
};

// -------------------Update Choices-------------------
// WHEN I choose to update an employee role I am prompted to select an employee to update and their new role and this information is updated in the database
const updateEmployeeRole = () => {
  let sql = `SELECT employee.id, employee.first_name, employee.last_name, role.id AS "role_id"
                    FROM employee, role, department WHERE department.id = role.department_id AND role.id = employee.role_id`;
  connection.promise().query(sql, (error, response) => {
    if (error) throw error;
    let employeeNamesArray = [];
    response.forEach((employee) => {
      employeeNamesArray.push(`${employee.first_name} ${employee.last_name}`);
    });

    let sql = `SELECT role.id, role.title FROM role`;
    connection.promise().query(sql, (error, response) => {
      if (error) throw error;
      let rolesArray = [];
      response.forEach((role) => {
        rolesArray.push(role.title);
      });

      inquirer
        .prompt([
          {
            name: "chosenEmployee",
            type: "list",
            message: "Which employee has a new role?",
            choices: employeeNamesArray,
          },
          {
            name: "chosenRole",
            type: "list",
            message: "What is their new role?",
            choices: rolesArray,
          },
        ])
        .then((answer) => {
          let newTitleId, employeeId;

          response.forEach((role) => {
            if (answer.chosenRole === role.title) {
              newTitleId = role.id;
            }
          });

          response.forEach((employee) => {
            if (
              answer.chosenEmployee ===
              `${employee.first_name} ${employee.last_name}`
            ) {
              employeeId = employee.id;
            }
          });

          let sqls = `UPDATE employee SET employee.role_id = ? WHERE employee.id = ?`;
          connection.query(sqls, [newTitleId, employeeId], (error) => {
            if (error) throw error;
            console.log(
              chalk.magentaBright.bold(
                `====================================================================================`
              )
            );
            console.log(chalk.magentaBright(`Employee Role Updated`));
            console.log(
              chalk.magentaBright.bold(
                `====================================================================================`
              )
            );
            promptUser();
          });
        });
    });
  });
};
