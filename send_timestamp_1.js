var net = require('net');
var AWS = require("aws-sdk");
var HOST = '192.168.1.190';
var PORT = 6000;
var client = new net.Socket();

AWS.config.update({
  region: "us-east-2",
    endpoint: "dynamodb.us-east-2.amazonaws.com",
    accessKeyId: "AKIAJ2V62TAWOZ6MZE3Q",
    secretAccessKey: "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"
});
var docClient = new AWS.DynamoDB.DocumentClient();
var table = "speed_table";

client.connect(PORT, HOST, function() {
  console.log('CONNECTED TO: ' + HOST + ':' + PORT);
});

function write_into_dynamodb(uid,t){
var params = {
    TableName:table,
    Item:{
        "uid": uid,
        "timestamp_reader_1": t
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
  console.log('DATA: ' + data);
  //convert the data into hex() string
  //read t'
  write_into_dynamodb(1,t);
});

//client.destroy();
client.on('close', function() {
  console.log('Connection closed');
});