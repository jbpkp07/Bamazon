# Bamazon

This is a command-line application that runs a javascript program in the Node.js environment. It is a store-front simulator, similar to any online store. 

There are 3 portals:

  * Customer portal
    
  * Manager portal
    
  * Supervisor portal

You can clone this repository via command line (if you have Git installed) by typing:  

`git clone https://github.com/jbpkp07/Bamazon`

If you already have Node.js installed, open your terminal, and browse to where you have cloned this Git repository and type:  

`node index.js` or `npm start`

If there are Node module dependencies that you are missing, please type `npm install` and it will reference the package.json file in this repository to automatically resolve those missing dependencies.

The main entry point for the application is `index.js`, and the other auxillary files are used to provide Node modules that the application depends on.

This application will also automatically seed the database. Please update your MySQL details and credentials here:

 *  `mysql_connection_details.js`
    
 *  `mysql_credentials.js`

**Technologies used:**  Node.js, Javascript, MySQL 5.7, NPM, npm terminal-kit, npm inquirer, npm mysql2, npm cli-table

There is also strict validation for the commands entered, with appropriate error messages if the input is invalid.

I am the sole developer of this application.


## Screenshots:

#### Seeding Database

![1](https://github.com/jbpkp07/Bamazon/blob/master/images/1-seedDatabase.png)

#### Choose Portal

![2](https://github.com/jbpkp07/Bamazon/blob/master/images/2-choosePortal.png)

#### Customer Purchase

![3](https://github.com/jbpkp07/Bamazon/blob/master/images/3-customerPurchase.png)

#### Customer Purchase Validation Examples:

![4](https://github.com/jbpkp07/Bamazon/blob/master/images/4-customerPurchaseValidation.png)
![5](https://github.com/jbpkp07/Bamazon/blob/master/images/5-customerPurchaseValidation.png)
![6](https://github.com/jbpkp07/Bamazon/blob/master/images/6-customerPurchaseValidation.png)
![7](https://github.com/jbpkp07/Bamazon/blob/master/images/7-customerPurchaseValidation.png)
![8](https://github.com/jbpkp07/Bamazon/blob/master/images/8-customerPurchaseValidation.png)

#### Manager View All Products:

![9](https://github.com/jbpkp07/Bamazon/blob/master/images/9-managerViewAllProducts.png)

#### Manager View Low Inventory:

![10](https://github.com/jbpkp07/Bamazon/blob/master/images/10-managerViewLowInventory.png)

#### Manager Add To Inventory:

![11](https://github.com/jbpkp07/Bamazon/blob/master/images/11-managerAddToInventory.png)

#### Manager Add New Product:

![12](https://github.com/jbpkp07/Bamazon/blob/master/images/12-managerAddNewProduct.png)
![13](https://github.com/jbpkp07/Bamazon/blob/master/images/13-managerAddNewProduct.png)
![14](https://github.com/jbpkp07/Bamazon/blob/master/images/14-managerAddNewProduct.png)
![15](https://github.com/jbpkp07/Bamazon/blob/master/images/15-managerAddNewProduct.png)
![16](https://github.com/jbpkp07/Bamazon/blob/master/images/16-managerAddNewProduct.png)
![17](https://github.com/jbpkp07/Bamazon/blob/master/images/17-managerAddNewProduct.png)
![18](https://github.com/jbpkp07/Bamazon/blob/master/images/18-managerAddNewProduct.png)

#### Supervisor Portal:

![19](https://github.com/jbpkp07/Bamazon/blob/master/images/19-supervisorPortal.png)

#### Supervisor Add New Department:

![20](https://github.com/jbpkp07/Bamazon/blob/master/images/20-supervisorAddNewDepartment.png)
![21](https://github.com/jbpkp07/Bamazon/blob/master/images/21-supervisorAddNewDepartment.png)
![22](https://github.com/jbpkp07/Bamazon/blob/master/images/22-supervisorAddNewDepartment.png)

#### Supervisor View Product Sales By Department:

![23](https://github.com/jbpkp07/Bamazon/blob/master/images/23-supervisorViewSalesByDepartment.png)

