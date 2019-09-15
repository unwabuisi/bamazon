CREATE DATABASE Bamazon;

USE Bamazon;


CREATE TABLE departments (
    department_id INT AUTO_INCREMENT,
    department_name VARCHAR(255) NOT NULL,
    overhead_costs DOUBLE,
    total_sales DOUBLE,
    PRIMARY KEY (department_id)
);

INSERT INTO departments (department_name, overhead_costs, total_sales)
VALUES ("Electronics",1250000.00,0.00),
("Appliances",14000000.00,0.00),
("Furniture",9000000.00,0.00),
("Home Improvement",4500000.00,0.00);


CREATE TABLE products (
	id INT AUTO_INCREMENT,
    dept_id INT,
	product_name VARCHAR(255) NOT NULL,
	department_name VARCHAR(255),
	price DOUBLE,
    stock_quantity INT,
    product_sales DOUBLE NOT NULL,
	PRIMARY KEY (id),
    FOREIGN KEY (dept_id) REFERENCES departments (department_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity,product_sales,dept_id)
VALUES  ("iPhone Screen Protector", "Electronics", 14.99, 200,0.00,1),
        ("USB Charging Station", "Electronics", 19.99, 150,0.00,1),
        ("Rice Cooker", "Appliances", 129.99, 40,0.00,2),
        ("Air Fryer", "Appliances", 99.99, 90,0.00,2),
        ("TV Stand", "Furniture", 129.99, 60,0.00,3),
        ("Bar Stool", "Furniture", 44.99, 20,0.00,3),
        ("Ottoman", "Furniture", 229.99, 30,0.00,3),
        ("Tower Fan", "Home Improvement", 49.99, 500,0.00,4),
        ("Shower Head", "Home Improvement", 29.99, 250,0.00,4),
        ("Floor Lamp", "Home Improvement", 79.99, 100,0.00,4)
;



