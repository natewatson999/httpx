var http = require("http");
var fs = require("fs");
console.dir(http.STATUS_CODES);
var config = {};
var testServer = http.createServer(function(req, res){
	res.write("Hello World! I provided this page with a single module that takes a single callback function, and works with both HTTP, HTTPS, and SPDY. But I don't get overtime, so screw you world!");
	res.end();
	testServer.close(function(){console.log("goodbye")});
}).listen(80);
	//testServer.close(function(){console.log("goodbye")});
console.log("By some miracle, the script didn\'t crash");