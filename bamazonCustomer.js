// requiring packages
var mysql = require('mysql');
var inquirer = require("inquirer");

// connectiong to mySQL DB
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "1995jkue",
  database: "bamazonDB"
});

// getting conncetion to DB
connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId + "\n");
  displayInventory();
});

// display table data
function displayInventory(){
	connection.query("SELECT * FROM products", function(err, res) {
    	if (err) throw err;
    	for( var i=0; i<res.length; i++){
    		
        console.log("                             ");
        	console.log("  | Item id: " + res[i].id + " | Item name: " + res[i].name +" | Item department: "+ res[i].department +" | Price: $"+ res[i].price +" | Remaining Stock: "+ res[i].stock_quantity + " |");
    		console.log("                             ");
        
        }
		askPromt();
	})
};

// prompt to ask user questions
function askPromt(){
	inquirer.prompt([
    {
    	name: "item",
    	type: "input",
    	message: "Which item do you want to purchase? Enter in the id number..."
    },
    {
     name: "amount",
     type: "input",
     message: "Amount you would like to purchase?",
    }

    ]).then(function(answer) {

      var query = "SELECT * FROM products WHERE id = ?";
    	connection.query(query, answer.item, function(err, res) {
        
        // conditional to check the quantity
        if (res[0].stock_quantity <= 0){
          console.log("We are out of stock!  Please pick new product.");
          askPromt();
        }else{

          // display the purchase information
          console.log("You chose item: " + res[0].name + " and requested to buy " + answer.amount + "!");
          console.log(" ");
          console.log("You owe me $" + answer.amount * res[0].price);

          // run connection to update the inventory
          connection.query('UPDATE products SET ? WHERE ?', 
            [{
              stock_quantity: res[0].stock_quantity - answer.amount
            },
            {
              id: res[0].id
            }],
            function(err, res) {
              console.log("Please Shop Again!!!");
              displayInventory();
            }
          );
        }
    	});
      // connection.end();
    });
}