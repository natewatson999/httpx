/*
Written by Nate Watson and Oluwafunmiwo Judah Sholola
Released under MIT license. 
Version: 0.1.7
*/
var http  = require("http"); 
var https = require("https");
var events = require("events");
function createServer(config, procedure){
		this.internalConfig = {};
		this.internalConfig.host = "INADDR_ANY";
		if (config.host) {
			this.internalConfig.host = config.host;
		}
		this.internalConfig.httpsPort = 443;
		if (config.httpsPort) {
			this.internalConfig.httpsPort = config.httpsPort;
		}
		this.internalConfig.httpPort = 80;
		if (config.httpPort) {
			this.internalConfig.httpPort = config.httpPort;
		}
		this.internalConfig.workingAddress = "::";
		if (config.address) {
			this.internalConfig.workingAddress = config.address;
		}
		this.internalConfig.httpServer = http.createServer(procedure);
		this.internalConfig.httpsServer = https.createServer(config, procedure);
		this.internalConfig.httpServer.timeout = 0;
		this.internalConfig.httpsServer.timeout = 0;
		this.timeout = 0;
	}
createServer.prototype.listen = function(){
	this.internalConfig.httpServer.listen(this.internalConfig.httpPort, this.internalConfig.workingAddress);
	this.internalConfig.httpsServer.listen(this.internalConfig.httpsPort, this.internalConfig.workingAddress);
};
createServer.prototype.close = function(callback){
	/*This function causes a crash if you use the keep-alive http parameter. But that's not a bug in this method. That's a bug in the HTTP and HTTPS modules, not this, so it won't be fixed. Also, it's your own damn fault for using keep-alive. ASSHOLE!*/
	var killServer = function( server, procedure) {
		if (!server) {
			procedure();
			return;
		}
		//console.dir(server);
		server.close(procedure);
		return;
	};
	killServer(this.internalConfig.httpsServer, killServer(this.internalConfig.httpServer, callback));
	return;
};
createServer.prototype.setTimeout = function(time, callback){
	this.timeout = time;
	this.internalConfig.httpServer.setTimeout(time, function(){
		this.internalConfig.httpsServer.setTimeout(time, callback);
	});
};
var httpx = {};
function requestFunction(config, callback) {
	this.enableSecurity = true;
	this.amOpen = true;
	this.emitter = new events.EventEmitter();
	this.httpsRequest = https.request(config, callback);
	this.httpRequest = {};
	this.fallback = function(cause) {
		this.enableSecurity = false;
		this.httpRequest = http.request(config, callback);
		this.fallbackFail = false;
		var fallbackPointer = this;
		this.httpRequest.on("data", function(data) {
			fallbackPointer.emitter.emit("data", data);
		});
		this.httpRequest.on("end", function() {
			fallbackPointer.emitter.emit("end");
		});
		this.httpRequest.on("error", function(error) {
			if (fallbacPointer.fallbackFail == false) {
				fallbacPointer.fallbackFail = false;
				fallbackPointer.emitter.emit("error", error);
			}
		});
		this.httpRequest.on("socket", function(backupSocket){
			backupSocket.setTimeout(10000);
			if (fallbackPointer.fallbackFail == false) {
				fallbackPointer.emitter.emit("timeout");
			}
		});
	};
	this.switched = false;
	var pointer = this;
	this.httpsRequest.on("socket", function(socket){
		socket.setTimeout(10000);
		socket.on("timeout", function(){
			if(false == pointer.switched) {
				pointer.switched = true;
				pointer.fallback("timeout");
			}
		});
	});
	this.httpsRequest.on("error", function(err) {
		if(false == pointer.switched) {
			pointer.switched = true;
			pointer.fallback(err);
		}
	});
	this.httpsRequest.on("data", function(data){
		pointer.emitter.emit("data", data);
	});
	this.httpsRequest.on("end", function(){
		pointer.emitter.emit("end");
	});
	callback(this.emitter);
};
requestFunction.prototype.end = function(){
	if (!(this.amOpen)) {
		throw err;
	}
	if (this.enableSecurity) {
		this.httpsRequest.end();
		return;
	}
	this.httpRequest.end();
	return;
};
requestFunction.prototype.write = function(section){
	if (!(this.amOpen)) {
		throw err;
	}
	if (this.enableSecurity) {
		this.httpsRequest.write(section);
		return;
	}
	this.httpRequest.write(section);
	return;
};
httpx.request = function(config, callback){ return new requestFunction(config, callback);};
httpx.createServer = function(config, procedure){ return new createServer(config, procedure);};
httpx.METHODS = http.METHODS;
httpx.STATUS_CODES = http.STATUS_CODES;
httpx.httpRequest = http.request;
httpx.httpGet = http.get;
httpx.httpsRequest = https.request;
httpx.httpsGet = https.get;
httpx.get = function(getOptions, getBack) {
	var req = httpx.request(getOptions, getBack);
	req.end();
	return req;
};
module.exports = exports = httpx;
