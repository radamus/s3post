var util = require("util");
var helpers = require("../helpers");
var Policy = require("../s3post").Policy;
var S3Form = require("../s3post").S3Form;
var AWS_CONFIG_FILE = "config.json";
var POLICY_FILE = "policy.json";
var INDEX_TEMPLATE = "index.ejs";


var task = function(request, callback){
	//load configuration
	var awsCofig = helpers.readJSONFile(AWS_CONFIG_FILE);
	var policyData = helpers.readJSONFile(POLICY_FILE);

	//prepare policy
	var policy = new Policy(policyData);

	//define form fields for S3 POST
	var s3Form = new S3Form(awsCofig, policy);
	var formHiddenFields = s3Form.generateS3FormFields();	

	console.log(util.inspect(formHiddenFields, false, null));

	var target = policy.getConditionValueByKey("bucket");

	callback(null, {template: INDEX_TEMPLATE, params:{fields:formHiddenFields, bucket:target}});
}

exports.action = task;
