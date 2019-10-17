var AWS = require("aws-sdk");
AWS.config.update({
  region: "us-east-2",
    endpoint: "dynamodb.us-east-2.amazonaws.com",
    accessKeyId: "AKIAJ2V62TAWOZ6MZE3Q",
    secretAccessKey: "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"
});
var docClient = new AWS.DynamoDB.DocumentClient();
var table = "speed_table";

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
        //console.log("GetItem succeeded:", JSON.stringify(data, null,2));
        if(!(JSON.stringify(data, null, 2).length == 2)){
	  var t1 = data["Item"]["timestamp_reader_1"]; //s
	  var t2 = data["Item"]["timestamp_reader_2"]; //s
	  var distance = 30; //km
	  var speed_limit = 20; //kmph
	  var time_diff = (t2-t1)/3600; //hr
	  console.log("Speed(kmph): ", distance/time_diff);
	  if((distance/time_diff) >= speed_limit){
	  	console.log("Alert! Speed safe limit exceeded");
	  }
	 else{
		console.log("Safe speed limit");
	 }
	}
    }
 });
}
read_from_dynamodb(1);
