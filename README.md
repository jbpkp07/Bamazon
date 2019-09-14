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


