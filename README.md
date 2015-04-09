# node-httpx
node-httpx provides a nodejs library for managing http and https server at the same time. It also provides http and https requests.

This module, httpx , is published under the MIT license. It was written by Nate Watson and Oluwafunmiwo Judah Sholola. 

node-httpx was written in response to this change request: https://github.com/joyent/node/issues/8827

## How to install node-httpx

### Local install

0. Navigate to the directory where the script is needed with "cd *directory*".

1. Run the following command:

```
npm install node-httpx
```

2. Verify the installation.

### Global install

0. Make sure you have the right to make NPM installations. If you don't have them, get them.

1. Run the following command:

```
npm install -g node-httpx
```

2. Verify the installation.

### Verifying The Installation

0. Navigate to the directory node-httpx is installed in.

1. Run the following command:

```
node httpxTester.js
```

2. Read the printout. It should print out a massive webpage. If it does not, perform network diagnostics. If the network is working properly, file a bug on github for httpx.

3. Open a browser on the same machine. Navigate to "https://localhost" or "http://localhost". Both work. Ignore any security errors.

4. The page should load correctly, and the script should end. If one of these things fails to happen, check the network. If the network is working correctly, file a bug on github for httpx.

5. Assuming you have not reached the "file a bug on github" statements, the script is installed correctly. If you have reached one of those, try reinstalling.

## Introduction

```

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
```

## Status Codes

Node-httpx provides http's status codes object:
```
console.dir(httpx.STATUS_CODES);
```

## Specific Requests
In addition to native request objects, node-httpx provides the request and get functions of the http and https modules. 

| Function           | Treat As      | Documentation                                                          |
|--------------------|---------------|------------------------------------------------------------------------|
| httpx.httpRequest  | http.request  | https://nodejs.org/api/http.html#http_http_request_options_callback    |
| httpx.httpGet      | http.get      | https://nodejs.org/api/http.html#http_http_get_options_callback        |
| httpx.httpsRequest | https.request | https://nodejs.org/api/https.html#https_https_request_options_callback |
| httpx.httpsGet     | https.get     | https://nodejs.org/api/https.html#https_https_get_options_callback     |

## httpx.request

## httpx.get

