        DROP DATABASE IF EXISTS bamazon;
        CREATE DATABASE bamazon;

        USE bamazon;

        CREATE TABLE departments (
            id         INT NOT NULL AUTO_INCREMENT,
            name       VARCHAR(50) NOT NULL,
            overhead   DECIMAL(12, 2) NOT NULL,
            PRIMARY KEY(id)
        );

        SET @electronics   = "Electronics";
        SET @sportingGoods = "Sporting Goods";
        SET @kitchen       = "Kitchen";
        SET @clothing      = "Clothing";

        INSERT INTO departments (name, overhead)
        VALUES  (@electronics, 10000.00),
                (@sportingGoods, 5000.00),
                (@kitchen, 8000.00),
                (@clothing, 2000.00);
            
        CREATE TABLE products (
            id            INT NOT NULL AUTO_INCREMENT,
            product       VARCHAR(256) NOT NULL,
            department_id INT NOT NULL,
            price         DECIMAL(9, 2) NOT NULL,
            stock         INT NOT NULL,
            sales         DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
            PRIMARY KEY (id),
            CONSTRAINT FK_department_id FOREIGN KEY (department_id) REFERENCES departments(id)
        );

        INSERT INTO products (product, department_id, price, stock)
        VALUES ("Sony WH-1000XM3 Headphones", 1, 298.00, 93),
               ("Bose QuietComfort 35 II Headphones", 1, 299.00, 151),
               ("Sennheiser PXC 550 Headphones", 1, 229.99, 57),
            
               ("Innova Champion Boss", 2, 16.95, 5),
               ("Discmania C-Line PD", 2, 14.75, 17),
               ("Innova Champion Firebird", 2, 17.10, 36),
            
               ("Anova Culinary Sous Vide Precision Cooker Pro", 3, 399.00, 3),
               ("Keurig K-Classic Coffee Maker", 3, 79.99, 277),
            
               ("Adidas Outdoor Terrex Swift R2 GTX", 4, 84.15, 27),
               ("Under Armour Playoff Golf Polo 2.0", 4, 55.93, 0);