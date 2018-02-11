CREATE DATABASE IF NOT EXISTS bamazon_db;

USE bamazon_db;

-- table for Bamazon departments 
CREATE TABLE IF NOT EXISTS departments (
	DepartmentID int(11) NOT NULL AUTO_INCREMENT,
	PRIMARY KEY (DepartmentID),
    DepartmentName varchar(100) NOT NULL,
    OverheadCosts int(11) DEFAULT NULL,
    TotalSales decimal(10,2) DEFAULT '0.00'
    );
    
    
-- data for Bamazon departments
INSERT INTO departments (DepartmentID, DepartmentName, OverheadCosts, TotalSales) 
VALUES
	(1, 'Awesomeness', 1000, 13245.00),
    (2, 'Badassery', 2000, 35246.00),
    (3, 'Sweetness', 1500, 435.00),
    (4, 'Raditude', 1200, 1000.00),
    (5, 'Tubularity', 500, 400.00);
    
-- table for Bamazon products 
CREATE TABLE IF NOT EXISTS products (
	ItemID int(11) NOT NULL AUTO_INCREMENT,
    PRIMARY KEY (ItemID),
    ProductName varchar(100) NOT NULL,
    DepartmentName varchar(100) DEFAULT NULL,
	Price decimal(10,2) DEFAULT NULL,
    StockQuantity int(11) DEFAULT NULL
);

--  data for Bamazon products
INSERT INTO products (ItemID, ProductName, DepartmentName, Price, StockQuantity)
VALUES
	(1, 'Cool', 'Awesomeness', 99.99, 10),
    (2, 'Doogie', 'Awesomeness', 89.99, 100),
    (3, 'Kewl', 'Awesomeness', 19.99, 200),
    (4, 'Dank', 'Badassery', 299.99, 100),
    (5, 'Flossy', 'Badassery', 129.49, 100),
    (6, 'Fly', 'Sweetness', 59.00, 20),
    (7, 'Fresh', 'Sweetness', 89.99, 300),
    (8, 'Kickass', 'Raditude', 389.99, 100),
    (9, 'Bodacious', 'Raditude', 209.99, 50),
    (10, 'Phatness', 'Raditude', 129.00, 500),
    (11, 'Primo', 'Tubularity', 58.99, 40),
    (12, 'Cushty', 'Tubularity', 399.99, 100);