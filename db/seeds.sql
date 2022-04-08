INSERT INTO department(department_name)
VALUES ("Engineering"), ("Sales"), ("Finance"), ("Legal"), ("Marketing");

INSERT INTO role(title, salary, department_id)
VALUES ("Engineer", 85000, 01), ( "Senior Engineer", 125000,01), ( "CFO", 350000, 03), ( "Chief Counsel", 300000, 04);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES ("Alex", "Gutierrez", 01, 02), ("Alex", "Gutierrez", 01, 02), ("Alex", "Gutierrez", 01, 02), ("Alex", "Gutierrez", 01, 02);