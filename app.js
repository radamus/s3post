var PORT = 8080;

var urlMap = [
	{path: "/", action:__dirname + "/html/index.html"},	 
//	{path: "/digest", action: lab1_1},	

	];

var service = require("webs-weeia").http(urlMap);

service(PORT);

