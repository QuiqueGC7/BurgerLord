-- 1. Primero las tablas sin dependencias (tablas base)
CREATE TABLE Job_Offers (
    Job_Offer_ID INT AUTO_INCREMENT PRIMARY KEY,
    Offer_Job VARCHAR(20),
    Offer_Description VARCHAR(300)
);

CREATE TABLE Customers (
    Customer_ID INT AUTO_INCREMENT PRIMARY KEY,
    Customer_Name VARCHAR(20),
    Customer_SecondName VARCHAR(20),
    Customer_EMail VARCHAR(50),
    Customer_Phone VARCHAR(15),
    Customer_Address VARCHAR(150),
    Customer_Password VARCHAR(20)
);

CREATE TABLE Payment_Methods (
    Payment_ID INT AUTO_INCREMENT PRIMARY KEY,
    Payment_Name VARCHAR(255)
);

CREATE TABLE Order_Types (
    Order_Type_ID INT AUTO_INCREMENT PRIMARY KEY,
    Type_Name VARCHAR(15)
);

CREATE TABLE Roles (
    Role_ID INT AUTO_INCREMENT PRIMARY KEY,
    Role_Name VARCHAR(30)
);

CREATE TABLE Cities (
    City_ID INT AUTO_INCREMENT PRIMARY KEY,
    City_Name VARCHAR(25)
);

CREATE TABLE Categories (
    Product_Type_ID INT AUTO_INCREMENT PRIMARY KEY,
    Category_Name VARCHAR(20)
);

-- 2. Tablas con dependencias de primer nivel
CREATE TABLE Locations (
    Location_ID INT AUTO_INCREMENT PRIMARY KEY,
    Street_Name VARCHAR(25),
    Postal_Code INT,
    City_ID INT
);

CREATE TABLE Products (
    Product_ID INT AUTO_INCREMENT PRIMARY KEY,
    Product_Photo VARCHAR(100),
    Product_Type_ID INT,
    Product_Name VARCHAR(25),
    Product_Description VARCHAR(255),
    Price DECIMAL(10, 2)
);

-- 3. Tablas con dependencias de segundo nivel
CREATE TABLE Shops (
    Shop_ID INT AUTO_INCREMENT PRIMARY KEY,
    Location_ID INT
);

-- MODIFICACIÓN: Tabla Orders ahora incluye Shop_ID para relacionar con Shops
CREATE TABLE Orders (
    Order_ID INT AUTO_INCREMENT PRIMARY KEY,
    Order_Date DATE,
    Customer_ID INT,
    Payment_ID INT,
    Order_Type_ID INT,
    Shop_ID INT  -- NUEVA COLUMNA: Relación N:1 con Shops
);

-- 4. Tablas con dependencias de tercer nivel
CREATE TABLE Candidates (
    Candidate_ID INT AUTO_INCREMENT PRIMARY KEY,
    Candidate_Name VARCHAR(20),
    Candidate_SecondName VARCHAR(20),
    Candidate_EMail VARCHAR(50),
    Candidate_Phone VARCHAR(15),
    Candidate_CV VARCHAR(100),
    Job_Offer_ID INT
);

CREATE TABLE Employees (
    Employee_ID INT AUTO_INCREMENT PRIMARY KEY,
    Employee_Name VARCHAR(25),
    Employee_SecondName VARCHAR(25),
    Role_ID INT,
    Shop_ID INT,
    Employee_EMail VARCHAR(50),
    Employee_Phone VARCHAR(25),
    Employee_Password VARCHAR(20)
);

CREATE TABLE Order_Lines (
    Order_ID INT,
    Product_ID INT,
    Quantity INT
);

-- 5. Añadir todas las restricciones de clave foránea
ALTER TABLE Locations
ADD CONSTRAINT FK_Locations_Cities
FOREIGN KEY (City_ID) REFERENCES Cities(City_ID);

ALTER TABLE Products
ADD CONSTRAINT FK_Products_Categories
FOREIGN KEY (Product_Type_ID) REFERENCES Categories(Product_Type_ID);

ALTER TABLE Shops
ADD CONSTRAINT FK_Shops_Locations
FOREIGN KEY (Location_ID) REFERENCES Locations(Location_ID);

ALTER TABLE Orders
ADD CONSTRAINT FK_Orders_Customers
FOREIGN KEY (Customer_ID) REFERENCES Customers(Customer_ID);

ALTER TABLE Orders
ADD CONSTRAINT FK_Orders_Payment_Methods
FOREIGN KEY (Payment_ID) REFERENCES Payment_Methods(Payment_ID);

ALTER TABLE Orders
ADD CONSTRAINT FK_Orders_Order_Types
FOREIGN KEY (Order_Type_ID) REFERENCES Order_Types(Order_Type_ID);

-- NUEVA RESTRICCIÓN: Relación entre Orders y Shops
ALTER TABLE Orders
ADD CONSTRAINT FK_Orders_Shops
FOREIGN KEY (Shop_ID) REFERENCES Shops(Shop_ID);

ALTER TABLE Candidates
ADD CONSTRAINT FK_Candidates_Job_Offers
FOREIGN KEY (Job_Offer_ID) REFERENCES Job_Offers(Job_Offer_ID);

ALTER TABLE Employees
ADD CONSTRAINT FK_Employees_Roles
FOREIGN KEY (Role_ID) REFERENCES Roles(Role_ID);

ALTER TABLE Employees
ADD CONSTRAINT FK_Employees_Shops
FOREIGN KEY (Shop_ID) REFERENCES Shops(Shop_ID);

ALTER TABLE Order_Lines
ADD CONSTRAINT FK_Order_Lines_Orders
FOREIGN KEY (Order_ID) REFERENCES Orders(Order_ID);

ALTER TABLE Order_Lines
ADD CONSTRAINT FK_Order_Lines_Products
FOREIGN KEY (Product_ID) REFERENCES Products(Product_ID);



-- Inserts



-- 1. Primero insertar en tablas sin dependencias
-- Insert Ciudades
INSERT INTO Cities (City_Name) VALUES
('Austin'), 
('Houston'), 
('Dallas'), 
('San Antonio');

-- Insert Roles
INSERT INTO Roles (Role_Name) VALUES
('Cook'), 
('Cashier'), 
('Cleaner'), 
('Delivery Driver'), 
('Manager');

-- Insert Clientes
INSERT INTO Customers (Customer_Name, Customer_SecondName, Customer_Email, Customer_Phone, Customer_Address, Customer_Password) VALUES
('Andrea', 'Lopez', 'andrealopez@correo.com', '600323451', '123 Elm St, Austin, TX', 'Seña1'),
('Carlos', 'Ramirez', 'carlosr@correo.com', '601122334', '456 Oak St, Dallas, TX', 'Seña2'),
('Lucia', 'Martinez', 'luciam@correo.com', '602233445', '789 Pine St, Houston, TX', 'Seña3'),
('Miguel', 'Torres', 'miguelt@correo.com', '603344556', '321 Maple St, San Antonio, TX', 'Seña4'),
('Sofia', 'Garcia', 'sofiag@correo.com', '604455667', '654 Cedar St, El Paso, TX', 'Seña5'),
('Diego', 'Fernandez', 'dfernandez@correo.com', '605566778', '987 Birch St, Lubbock, TX', 'Seña6'),
('Valeria', 'Santos', 'valerias@correo.com', '606677889', '147 Spruce St, Plano, TX', 'Seña7'),
('Javier', 'Morales', 'jmorales@correo.com', '607788990', '258 Willow St, Irving, TX', 'Seña8'),
('Camila', 'Ortega', 'cortega@correo.com', '608899001', '369 Ash St, Amarillo, TX', 'Seña9'),
('Luis', 'Navarro', 'lnavarro@correo.com', '609900112', '741 Poplar St, Garland, TX', 'Seña10');


-- Insert Métodos de pago
INSERT INTO Payment_Methods (Payment_Name) VALUES
('Credit Card'), 
('Cash'), 
('PayPal');

-- Insert Tipos de orden
INSERT INTO Order_Types (Type_Name) VALUES
('Online'), 
('In-Store'), 
('Pickup'), 
('Delivery');

-- Insert Ofertas de trabajo
INSERT INTO Job_Offers (Offer_Job, Offer_Description) VALUES
('Cashier', 'Customer service at the register, handling cash and card payments, and daily register closing.'),
('Delivery Driver', 'Responsible for delivering orders safely and on time, following assigned routes.');

-- Insert Categorías
INSERT INTO Categories (Category_Name) VALUES
('Burger'), 
('Fries'), 
('Drinks'), 
('Ice Cream'), 
('Shakes'), 
('Menus');

-- 2. Luego insertar en tablas con dependencias de primer nivel
-- Insert Localizaciones (depende de Cities)
INSERT INTO Locations (Street_Name, Postal_Code, City_ID) VALUES
('Congress Ave', 73301, 1),
('Westheimer Rd', 77056, 2),
('Main St', 75201, 3),
('Broadway St', 78205, 4);

-- Insert Productos (depende de Categories)
INSERT INTO Products (Product_Photo, Product_Name, Product_Description, Price, Product_Type_ID) VALUES
-- Burgers (Category ID: 1)
('./Images/Clásica.png', 'Clasic', 'Delicious hamburger with beef, lettuce, tomato and cheddar cheese.', 5.99, 1),
('./Images/BBQ.png', 'BBQ', 'Juicy hamburger with BBQ sauce, onion rings and crunchy bacon.', 6.99, 1),
('./Images/Picapollo.png', 'Picapollo', 'For chicken lovers: Chicken burger, bacon, cheddar cheese, jalapeños and red chili sauce.', 7.49, 1),
('./Images/PulledPork.png', 'Pulled Pork', 'Tasty hamburger with poached onion, pulled pork, beef patty, cheese and bacon.', 7.99, 1),
('./Images/Gluten.png', 'Gluten Free', 'Easy gluten intolerant people, here comes your burger, with beef, cheddar cheese, tomato, lettuce and caramelized onion.', 6.49, 1),
('./Images/BaconLovers.png', 'Bacon Lovers', 'Extra bacon for the real fans, irresistible!', 6.99, 1),
('./Images/Vegana.png', 'Vegan Pleasure', '100% vegetable option with fresh and tasty ingredients.', 7.49, 1),
('./Images/Maritima.png', 'Maritime', 'The sea comes to your burger, crispy fish fillet, tomato, fresh lettuce and tartar sauce.', 7.99, 1),
('./Images/FriedStatick.png', 'Friedstastic', 'Fried beef burger, red bell bell pepper and feta cheese.', 7.59, 1),
('./Images/Alba.png', 'Chef Alba''s Burger', 'Beef hamburger with tomato jam, caramelized onion, goat log and truffle powder.', 8.49, 1),
('./Images/La soberana.png', 'La Soberana', 'Doble smash patty de res, panceta crujiente y pulled pork glaseado con bourbon BBQ.', 8.99, 1),
('./Images/TacoBurger.png', 'Taco Burger', 'TACOBURGUER WEEEY, Taco style seasoned beef, with cheddar and Monterey Jack cheeses, crispy tortilla and homemade salsa.', 8.49, 1),
('./Images/Pizzabomba.png', 'Pizzabomb', 'Explosion of flavor in pure Italian style, meat seasoned with Italian spices, mozzarella, marinara sauce and spicy oil.', 8.29, 1),
('./Images/Pepperoni.png', 'Pepe Roni', 'With pepperoni, melted mozzarella and a spicy pizza-style touch.', 7.99, 1),

-- Papas Fritas (Category ID: 2)
('./Images/PatatasFritas.png', 'Fries', 'Fries go with everything', 1.49, 2),
('./Images/PatatasDeluxe.png', 'Deluxe fries', 'Deluxe fries, wedge style potatoes', 1.49, 2),
('./Images/PatatasB&Q.png', 'B&Q fries', 'Delicious potatoes with melted cheese and bacon chunks', 1.95, 2),

-- Bebidas (Category ID: 3)
('./Images/FantaLimon.png', 'Lemon Fanta', 'A fresh lemon fanta', 2.49, 3),
('./Images/FantaN.png', 'Orange Fanta', 'A fresh orange fanta', 2.49, 3),
('./Images/CocaCola.png', 'CocaCola', 'A fresh CocaCola', 2.49, 3),
('./Images/Lipton.png', 'Lipton', 'A good lemon tea is never a bad thing.', 2.49, 3),

-- Helados (Category ID: 4)
('./Images/HeladoChocolate.png', 'Chocolate Ice Cream', 'Just a clasic.', 3.49, 4),
('./Images/GelatoFresa.png', 'Strawberry Ice Cream', 'It''s pink and tastes like strawberry!', 3.49, 4),
('./Images/GelatoVainilla.png', 'Vanilla Ice Cream', 'It doesn''t matter if it''s simple if it''s delicious.', 3.49, 4),

-- Batidos (Category ID: 5)
('./Images/BatidoChocolate.png', 'Chocolate Milkshake', 'Creamy, cold and perfect with any burger, CHOCOLATEEE FLAVOUR!', 3.49, 5),
('./Images/BatidoFresa.png', 'Strawberry milkshake', 'Creamy, cold and perfect with any burger, CHOCOLATEEE flavor! It''s pink and tastes like strawberry!', 3.49, 5),
('./Images/BatidoVainilla.png', 'Vanilla Milkshake', 'Creamy, cold and perfect with any burger, CHOCOLATEEE flavor! It''s not minecraft vanilla but it''s good too!', 3.49, 5),

-- Menús (Category ID: 6)
('./Images/MenuClásico.png', 'Clasic Menu', 'Classic Burger + Fries + Choice of beverage', 8.20, 6),
('./Images/Alba_Menu.png', 'Chef''s election menu', 'Chef Alba''s Burger + Deluxe fries + Chocolate Milkshake', 10.45, 6),
('./Images/HotMENU.png', 'The Hot Menu', 'Picapollo Burger + B&Q Fries + Shake of your choice', 9.50, 6),
('./Images/MenuLaMar.png', 'Menú LaMar', 'Maritime Burger + Fries of your choice + Beverage, Ice Cream or Milkshake of your choice', 9.50, 6),
('./Images/FriLordMenu.png', 'Frilord Menu', 'Friting Burger + Potato Fries + Drink, Ice Cream or Milkshake of your choice', 9.50, 6);

-- 3. Luego insertar en tablas con dependencias de segundo nivel
-- Insert Tiendas (depende de Locations)
INSERT INTO Shops (Location_ID) VALUES
(1), 
(2), 
(3), 
(4);

-- 4. Finalmente insertar en tablas con dependencias de tercer nivel
-- Insert Empleados (depende de Roles y Shops)
INSERT INTO Employees (Employee_Name, Employee_SecondName, Role_ID, Shop_ID, Employee_EMail, Employee_Phone, Employee_Password) VALUES
('Carlos', 'Pérez', 1, 1, 'carlosperez@empresa.com', '600123451', 'Contra1'),
('Lucía', 'Martínez', 1, 1, 'luciamartinez@empresa.com', '600123452', 'Contra2'),
('Alberto', 'Olleta', 1, 1, 'albertoolleta@empresa.com', '600123453', 'Contra3');

-- Insert Candidatos (depende de Job_Offers)
INSERT INTO Candidates (Candidate_Name, Candidate_SecondName, Candidate_EMail, Candidate_Phone, Candidate_CV, Job_Offer_ID) VALUES
('Lucia', 'Herrera', 'luciaherrera@empresa.com', '600223451', 'cv/lucia_herrera.pdf', 1),
('Joaquin', 'Bravo', 'joaquinbravo@empresa.com', '600223452', 'cv/joaquin_bravo.pdf', 2);