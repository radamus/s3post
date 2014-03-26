
var fs = require('fs')
var PORT = 8080;

var s3PostPolicy = [];
var accesKey;
var signature;

var urlMap = [
	{path: "/", action:__dirname + "/html/index.html"},	 
//	{path: "/digest", action: lab1_1},	

	];

var service = require("webs-weeia").http(urlMap);

service(PORT);



var base64 = function(obj) {
	var stringifyObj = JSON.stringify(obj);
	return new Buffer(obj).toString('base64');
}