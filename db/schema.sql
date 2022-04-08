DROP DATABASE IF EXISTS employees;
CREATE DATABASE employees;
USE employees;

-- department
-- id: INTEGER PRIMARY KEY
-- name: VARCHAR(30) to hold department name
CREATE TABLE department (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    department_name VARCHAR(30)
);


-- role
-- id: INTEGER PRIMARY KEY
-- title: VARCHAR(30) to hold role title
-- salary: DECIMAL to hold role salary
-- department_id: INTEGER to hold reference to department role belongs to
CREATE TABLE role (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(30),
    salary DECIMAL(10,2) NOT NULL,
    department_id INTEGER
);

-- employee
-- id: INTEGER PRIMARY KEY
-- first_name: VARCHAR(30) to hold employee first name
-- last_name: VARCHAR(30) to hold employee last name
-- role_id: INTEGER to hold reference to employee role
-- manager_id: INTEGER to hold reference to another employee that is the manager of the current employee (null if the employee has no manager)
CREATE TABLE employee (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INTEGER,
    manager_id INTEGER
);






