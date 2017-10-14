var express =  require('express');
var app     =  express();
var http    =  require('http').Server(app);
var http2 = require('http');
var port    =  process.env.PORT || 1337;
var request = require('request');

var map_key = 'JZo1Uqz4Z9MlLYP5oPwu~VYDNW7mVzdzzBJDpm3A2xA~AvXLaoIboRB7L-3stqKgzYl0J5YRfaRHQWewd86ikXTNgtCCpFm7FJUVkEX7XQFS';

app.use(express.static('destinymap'));

http.listen(port, function(){
	console.log("Server running at http://localhost:%d", port);	
});

function getPosition(location, cb){
	request.get("http://dev.virtualearth.net/REST/v1/Locations?query="+location+"&key="+map_key, function (error, response, body) {
	    if (!error && response.statusCode == 200) {
	        body = JSON.parse(body);
	        var name = body['resourceSets'][0]['resources'][0]['name'];
	        var coordinates = body['resourceSets'][0]['resources'][0]['point']['coordinates'];
	        cb({'name' : name, 'coordinates' : coordinates});
	    }
	    else console.log(error);
	});
}