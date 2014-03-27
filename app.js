var helpers = require("./helpers");
var s3post = require("./s3post");
var PORT = 8080;
var AWS_CONFIG_FILE = "config.json";
var POLICY_FILE = "policy.json";

var awsCofig = helpers.readJSONFile(AWS_CONFIG_FILE);
var policyData = helpers.readJSONFile(POLICY_FILE);

var policy = new s3post.Policy(policyData, new Date());

var s3Form = new s3post.S3Form(awsCofig, policy);
var formHiddenFields = s3Form.generateS3FormFields();
console.log(formHiddenFields);

var urlMap = [
	{path: "/", action:{template: "index.ejs", params:formHiddenFields}},	 
//	{path: "/digest", action: lab1_1},	
	];

var service = require("webs-weeia").http(urlMap);

//service(PORT);







