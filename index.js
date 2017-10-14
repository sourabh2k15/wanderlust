var express =  require('express');
var app     =  express();
var http    =  require('http').Server(app);
var port    =  process.env.PORT || 1337;

app.use(express.static('destinymap'));

http.listen(port, function(){
	console.log("Server running at http://localhost:%d", port);	
});
