var helpers = require("./helpers");

var Policy = function(policyData, expiration){
	this.policy = {};	
	this.policy.expiration = expiration;
	if(Array.isArray(policyData)) {
		this.policy.conditions = policyData.slice(0);
	}
	else {
		throw new Error("policy data must be an array");
	}	
}

Policy.prototype.getEncodedPolicyDocument = function(){
	var utf8Encoded = helpers.encode(this.policy, 'utf-8');	
	return helpers.encode(utf8Encoded, 'base64');
}

Policy.prototype.getConditions = function(){
	return this.policy.conditions;
}

Policy.prototype.getSignature = function(secretAccessKey){
	return helpers.hmac("sha1", secretAccessKey, this.getEncodedPolicyDocument(), 'base64');	
}


var generateS3FormFields = function(awsCofig, policy) {
	var conditions = policy.getConditions();
	var policyDocument = policy.getEncodedPolicyDocument();
	var signature = policy.getSignature(awsCofig.secretAccessKey);
	var formFields = [];

	formFields.push(hiddenField("AWSAccessKeyId", awsCofig.accessKeyId));
	conditions.forEach(function(elem){
		if(Array.isArray(elem)){
			if(elem[1] === "$key")
				formFields.push(hiddenField("key", elem[2] + "${filename}"));			
		}else {
				var key = Object.keys(elem)[0];
				var value = elem[key];
			 formFields.push(hiddenField(key, value));
		}	
	});
		
	formFields.push(hiddenField("policy", policyDocument));
	formFields.push(hiddenField("signature", signature));

	var fields = formFields.join("\n");
	return fields;
	
}



var hiddenField = function(fieldName, value) {
	return  '<input type="hidden" name="' + fieldName + '" value="' + value + '"/>';
}

exports.Policy = Policy;
exports.generateS3FormFields = generateS3FormFields;
