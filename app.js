
var ACTIONS_FOLDER = "./actions/";
var ACTIONS_CONFIG_FILE = "actions.json";
var PORT = 8080;

var helpers = require("./helpers");

var actionsCofig = helpers.readJSONFile(ACTIONS_CONFIG_FILE);

actionsCofig.forEach(function(elem){
	elem.action = require(ACTIONS_FOLDER + elem.action).action;
});





var service = require("webs-weeia").http(actionsCofig);

service(PORT);







