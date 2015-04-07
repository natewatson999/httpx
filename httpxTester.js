/*
Written by Nate Watson and Oluwafunmiwo Judah Sholola
Released under MIT license. 
Version: 0.1.0
*/
var httpx = require("./httpx.js");
var fs = require("fs");
console.dir(httpx.STATUS_CODES);
var config = {};
config.key = fs.readFileSync("./pd69744_privatekey.pem");
config.cert = fs.readFileSync("./pd69744_cert.pem");
var testServer = httpx.createServer(config, function(req, res){
	res.writeHead(200, {'Connection': 'close'}); 
	res.write("Hello World! I provided this page with a single module that takes a single callback function, and works with both HTTP and HTTPS. But I don't get overtime, so screw you world!");
	res.end();
	testServer.close(function(){console.log("goodbye");});
});
testServer.listen();

var options = {};
options.hostname = "encrypted.google.com";
options.path = "/";
options.method = "get";
var googleRequest = httpx.request(options, function(res){
	var answer = "";
	res.on("data", function(d){
		answer += d;
	});
	res.on("end", function(){
		console.log(answer);
	});
}); 
googleRequest.write("text");
googleRequest.end();
console.log("By some miracle, the script didn\'t crash");