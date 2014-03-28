var util = require("util");
var moment = require("moment");
var helpers = require("./helpers");

var Policy = function(policyData){
	this.policy = policyData;	
	this.policy.expiration = moment().add(policyData.expiration).toJSON();
	console.log("policyData " + util.inspect(policyData, false, null));	
}

Policy.prototype.generateEncodedPolicyDocument = function(){
	return helpers.encode(this.policy, 'base64');		
}

Policy.prototype.getConditions = function(){
	return this.policy.conditions;
}

Policy.prototype.generateSignature = function(secretAccessKey){
	return helpers.hmac("sha1", secretAccessKey, this.generateEncodedPolicyDocument(), 'base64');	
}

Policy.prototype.getConditionValueByKey = function(key){
	var condition = [];
	this.policy.conditions.forEach(function(elem) {		
		if(Object.keys(elem)[0] === key)
			condition = elem[Object.keys(elem)[0]];
	});
	return condition;
}

var S3Form = function(awsCofig, policy){
	this.awsCofig = awsCofig;
	if(policy instanceof Policy)
		this.policy = policy;
	else{
		console.log("policy instanceof Policy");
		throw new Error("policy instanceof Policy");
	}
	
}

S3Form.prototype.generateS3FormFields = function() {
	var conditions =this.policy.getConditions();
	var policyDocument = this.policy.generateEncodedPolicyDocument();
	var signature = this.policy.generateSignature(this.awsCofig.secretAccessKey);
	var formFields = [];

	conditions.forEach(function(elem){
		if(Array.isArray(elem)){
			if(elem[1] === "$key")
				formFields.push(hiddenField("key", elem[2] + "${filename}"));			
		}else {

			var key = Object.keys(elem)[0];
			var value = elem[key];
			if(key !== "bucket")
			 	formFields.push(hiddenField(key, value));
		}	
	});
	formFields.push(hiddenField("AWSAccessKeyId", this.awsCofig.accessKeyId));	
	formFields.push(hiddenField("policy", policyDocument));
	formFields.push(hiddenField("signature", signature));

	return formFields;
	
}



var hiddenField = function(fieldName, value) {
	return {name: fieldName, value : value};
}

exports.Policy = Policy; // usage: policy = new Policy(policyData);
exports.S3Form = S3Form; // usage: s3Form = new S3Form(awsConfig, policy);


