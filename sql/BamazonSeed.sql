        DROP DATABASE IF EXISTS bamazon;
        CREATE DATABASE bamazon;

        USE bamazon;

        CREATE TABLE products (
            id         INT NOT NULL AUTO_INCREMENT,
            product    VARCHAR(256) NOT NULL,
            department VARCHAR(50) NOT NULL,
            price      DECIMAL(9, 2) NOT NULL,
            stock      INT NOT NULL,
            PRIMARY KEY(id)
        );

        SET @electronics   = "Electronics";
        SET @sportingGoods = "Sporting Goods";
        SET @kitchen       = "Kitchen";
        SET @clothing      = "Clothing";

        INSERT INTO products (product, department, price, stock)
        VALUES ("Sony WH-1000XM3 Headphones", @electronics, 298.00, 93),
               ("Bose QuietComfort 35 II Headphones", @electronics, 299.00, 151),
               ("Sennheiser PXC 550 Headphones", @electronics, 229.99, 57),
            
               ("Innova Champion Boss", @sportingGoods, 16.95, 5),
               ("Discmania C-Line PD", @sportingGoods, 14.75, 17),
               ("Innova Champion Firebird", @sportingGoods, 17.10, 36),
            
               ("Anova Culinary Sous Vide Precision Cooker Pro", @kitchen, 399.00, 3),
               ("Keurig K-Classic Coffee Maker", @kitchen, 79.99, 277),
            
               ("Adidas Outdoor Terrex Swift R2 GTX", @clothing, 84.15, 27),
               ("Under Armour Playoff Golf Polo 2.0", @clothing, 55.93, 0);