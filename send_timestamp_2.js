var net = require('net');
var AWS = require("aws-sdk");
var HOST = '127.0.0.1';
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

function write_into_dynamodb(uid,t1){
var params = {
    TableName:table,
    Item:{
        "uid": uid,
        "timestamp_reader_1": t1,
        "timestamp_reader_2": Date.now()
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

function read_from_dynamodb(uid){
var params = {
    TableName: table,
    Key:{
        "uid": uid
        }
};
docClient.get(params, function(err, data) {
    if (err) {
        console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        if(!(JSON.stringify(data, null, 2).length == 2)){
          write_into_dynamodb('1',data["Item"]["timestamp_reader_1"]);
        }
    }
 });
}

client.on('data', function(data) {
  console.log('DATA: ' + data);
  read_from_dynamodb('1');
  client.destroy();
});

client.on('close', function() {
  console.log('Connection closed');
});
