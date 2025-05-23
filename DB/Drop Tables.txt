-- 1. Tablas con dependencias de tercer nivel
DROP TABLE IF EXISTS Order_Lines;
DROP TABLE IF EXISTS Employees;
DROP TABLE IF EXISTS Candidates;

-- 2. Tablas con dependencias de segundo nivel
DROP TABLE IF EXISTS Orders;
DROP TABLE IF EXISTS Shops;

-- 3. Tablas con dependencias de primer nivel
DROP TABLE IF EXISTS Products;
DROP TABLE IF EXISTS Locations;

-- 4. Tablas sin dependencias (tablas base)
DROP TABLE IF EXISTS Categories;
DROP TABLE IF EXISTS Cities;
DROP TABLE IF EXISTS Roles;
DROP TABLE IF EXISTS Order_Types;
DROP TABLE IF EXISTS Payment_Methods;
DROP TABLE IF EXISTS Customers;
DROP TABLE IF EXISTS Job_Offers;
