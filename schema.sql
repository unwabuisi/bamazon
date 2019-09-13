CREATE DATABASE Bamazon;

USE Bamazon;

CREATE TABLE products (
	id INT AUTO_INCREMENT,
	product_name VARCHAR(255) NOT NULL,
	department_name VARCHAR(255),
	price DOUBLE(7,2),
    stock_quantity INT,
	PRIMARY KEY (id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES  ("iPhone Screen Protector", "Electronics", 14.99, 200),
        ("USB Charging Station", "Electronics", 19.99, 150),
        ("Rice Cooker", "Appliances", 129.99, 40),
        ("Air Fryer", "Appliances", 99.99, 90),
        ("TV Stand", "Furniture", 129.99, 60),
        ("Bar Stool", "Furniture", 44.99, 20),
        ("Ottoman", "Furniture", 229.99, 30),
        ("Tower Fan", "Home Improvement", 49.99, 500),
        ("Shower Head", "Home Improvement", 29.99, 250),
        ("Floor Lamp", "Home Improvement", 79.99, 100)
;


CREATE TABLE departments (
    department_id INT AUTO_INCREMENT,
    department_name VARCHAR(255) NOT NULL,
    overhead_costs INT,
    total_sales INT
    PRIMARY KEY (department_id)
);

ALTER TABLE products
ADD product_sales INT;
UPDATE products SET product_sales = 0;