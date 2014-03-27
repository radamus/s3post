var helpers = require("./helpers");
var util = require("util");

var Policy = function(policyData){
	this.policy = policyData;		
}

Policy.prototype.getEncodedPolicyDocument = function(){
	return helpers.encode(this.policy, 'base64');		
}

Policy.prototype.getConditions = function(){
	return this.policy.conditions;
}

Policy.prototype.getSignature = function(secretAccessKey){
	return helpers.hmac("sha1", secretAccessKey, this.getEncodedPolicyDocument(), 'base64');	
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
	this.policy = policy;
}
S3Form.prototype.generateS3FormFields = function() {
	var conditions =this.policy.getConditions();
	var policyDocument = this.policy.getEncodedPolicyDocument();
	var signature = this.policy.getSignature(this.awsCofig.secretAccessKey);
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
	//return  '<input type="hidden" name="' + fieldName + '" value="' + value + '"/>';
	return {name: fieldName, value : value};
}

exports.Policy = Policy;
exports.S3Form = S3Form;
