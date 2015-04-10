# node-httpx
node-httpx provides a nodejs library for managing http and https servers at the same time. It also provides http and https requests.

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

0. Make sure you have the right to make global NPM installations. If you don't have it, get it.

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

## httpx.createServer

```
httpx.createServer(config, function(req, res) {

});
```

This follows the same general behavior as https.createServer.

### httpx.createServer config

This is the configuration object for this server. The following members are required:
* key : this is the private key used for dealing with https requests. REQUIRED.
* cert : this is the certificate used for dealing with https requests. REQUIRED.
* httpPort : the port for http traffic. Default: 80.
* httpsPort : the port for https traffic. default: 443.
* address : the address to listen to. default: "::", meaning everything from IPv4 and IPv6.

### httpx.createServer.listen

```
workingServer.listen();
```

This starts the servers. Note that this feature is still being improved.

### httpx.createServer callback

req is the request. res is the response. This callback is identical to what is found in node.http and node.https.

### httpx.createServer.close()

```
workingServer.close(callback);
```

This closes the http and https servers in this instance of an httpx server. Because of the http 1.1 and 2.0 HTTP specifications, this action is very prone to causing crashes. Use it at your own risk, and use it with a callback function.

### httpx.createServer.setTimeout

```
workingServer.setTimeout(time, callback);
```

Calling this function changes this.timeout to time, sets the timeouts of the internal servers to time, and calls the callback function.

## Specific Requests

In addition to native request objects, node-httpx provides the request and get functions of the http and https modules. 

| Function           | Treat As      | Documentation                                                          |
|--------------------|---------------|------------------------------------------------------------------------|
| httpx.httpRequest  | http.request  | https://nodejs.org/api/http.html#http_http_request_options_callback    |
| httpx.httpGet      | http.get      | https://nodejs.org/api/http.html#http_http_get_options_callback        |
| httpx.httpsRequest | https.request | https://nodejs.org/api/https.html#https_https_request_options_callback |
| httpx.httpsGet     | https.get     | https://nodejs.org/api/https.html#https_https_get_options_callback     |

## httpx.request

httpx.request is for running http-style requests via httpx. By default, when a request is initiated, first the module tries to use https.request. If that fails for some reason, plain http.request is used instead with the same configuration. If that fails, an error is thrown.

Example:
```
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
```

### httpx.request.write(payload)

This function is used to write context to a working httpx request object. This should not be used in httpx.get.

### httpx.request.end()

This function states that everything has been sent that will be sent for this request. This should not be used in httpx.get.

### httpx.request config object

* hostname : either a valid domain or IP address of the server being requested. REQUIRED.
* path : the part of the URL that's not the port, hostname, or protocol. REQUIRED.
* method : the HTTP method to be used. Default: "get".
* httpsPort: the port for https requests. Default: 443.
* httpPort: the port for http requests. Default: 80.
Note: any setting that exists in node.http or node.https also exists in these settings. These are just the only ones the code explicitly interacts with.

### httpx.request callback function

```
function (res) {

}
```

Res is an event emmiter that is emmited once per request.

### httpx.requeset.response.err

```
res.on("error", errObject);
```

This is emmited when both https.request and http.request failed with the given configuration. It contains the error object from node.http.

### httpx.requeset.response.data

```
res.on("data", segment);
```

This is emmited when a section of the response arrives properly at the client. Segment is usually a string. 

### httpx.requeset.response.end

```
res.on("end", callback);
```

This is emmited when there is no more data that will come in the response. The callback function is required.

## httpx.get

This is httpx.request, but the request is assumed to be a GET request, the payload is automatically empty, and the transmission ended automatically. The event listeners, configurations, and callbacks are identical.
