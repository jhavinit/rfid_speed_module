var net = require('net');
var AWS = require("aws-sdk");
var HOST = '192.168.1.190';
var PORT = 6000;
var client = new net.Socket();

AWS.config.update({
    region: "*",
    endpoint: "*",
    accessKeyId: "*",
    secretAccessKey: "*"
});
var docClient = new AWS.DynamoDB.DocumentClient();
var table = "speed_table";

client.connect(PORT, HOST, function() {
  console.log('CONNECTED TO: ' + HOST + ':' + PORT);
});

function write_into_dynamodb(uid,t1){
var params = {
    TableName:table,
    Item:{
        "uid": uid,
        "timestamp_reader_1": t1,
	"timestamp_reader_2": -1
    }
};
console.log("Adding a new item...");
docClient.put(params, function(err, data) {
    if (err) {
        console.error("Unable to add item. Error JSON:", 
JSON.stringify(err, null, 2));
    } else {
        console.log("Added item:", JSON.stringify(data, null, 2));
    }
});
}

client.on('data', function(data) {
var card_detect_time = Math.floor(Date.now()/1000);
	console.log(' ');
	console.log('Data: ' + data);
let date_ob = new Date();
	// current date
// adjust 0 before single digit date
let date = ("0" + date_ob.getDate()).slice(-2);

// current month
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

// current year
let year = date_ob.getFullYear();

// current hours
let hours = date_ob.getHours();

// current minutes
let minutes = date_ob.getMinutes();

// current seconds
let seconds = date_ob.getSeconds();

// prints date in YYYY-MM-DD format
//console.log(year + "-" + month + "-" + date);

// prints date & time in YYYY-MM-DD HH:MM:SS format
console.log("Date and Time: " + year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds);
  console.log("Card detect total time(s): ",card_detect_time);
  write_into_dynamodb('1',card_detect_time);
  //client.destroy();
});

client.on('close', function() {
  console.log('Connection closed');
});
