var util = require("util");
var moment = require("moment");
var helpers = require("./helpers");
var s3post = require("./s3post");
var PORT = 8080;
var AWS_CONFIG_FILE = "config.json";
var POLICY_FILE = "policy.json";

var awsCofig = helpers.readJSONFile(AWS_CONFIG_FILE);
var policyData = helpers.readJSONFile(POLICY_FILE);
var bucket = "lab4-weeia";
policyData.expiration = moment().add(policyData.expiration).toJSON();
console.log("policyData " + util.inspect(policyData, false, null));

var policy = new s3post.Policy(policyData);
var s3Form = new s3post.S3Form(awsCofig, policy);
var formHiddenFields = s3Form.generateS3FormFields();

console.log(util.inspect(formHiddenFields, false, null));
var target = policy.getConditionValueByKey("bucket");
var urlMap = [
	{path: "/", action:{template: "index.ejs", params:{fields:formHiddenFields, bucket:target} } },	 
	];

var service = require("webs-weeia").http(urlMap);

service(PORT);







