INSERT INTO department (name)
VALUES ('sales'),
       ('enginering'),
       ('finance'),
       ('legal');

INSERT INTO role (title, department_id, salary)
VALUES ('Sales lead', 1, 100000),
       ('Salesperson', 1, 80000 ),
       ('Lead engineer', 2, 150000 );

INSERT INTO employee (first_name, last_name, role_id)
VALUES ('John', 'Doe', 1),
       ('Mike', 'Chan', 2),
       ('Ashley', 'Rodriguez', 3);

UPDATE employee set manager_id = 1 where id = 2;