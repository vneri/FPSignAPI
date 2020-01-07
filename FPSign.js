// provides UI droplets for FP Sign and API calls


var FPSign={};
FPSign.baseURL = 'https://app.fp-sign.com/api/v1_2';
FPSign.login = function(username, password){
	return new Promise(function(resolve, reject){
		var payload = 
			{
				"username": username,
				"password": password
			}
		Xhr.POST(FPSign.baseURL + '/login', function(data){
			resolve(data);
		},payload, undefined, 'application/json');
	});
}

FPSign.register = function(email, password, firstName, lastName, language, country, resellerId, campaignName, leadSource){
	return new Promise(function(resolve, reject){
		var payload = 
			{
				"email": email,
				"password": password,
				"first_name": firstName,
				"last_name": lastName,
				"language":language,
				"country": country,
				"reseller_id": resellerId,
				"campaign_name": campaignName,
				"lead_source": leadSource
			}
		Xhr.POST(FPSign.baseURL + '/registration', function(data){
			resolve(data);
		},payload, undefined, 'application/json');
	});
}

FPSign.createForm =  function(formType, id, cssClasses){
	var formHTML = '';
	if(! (cssClasses && cssClasses['text']) ){
		var cssClasses = [];
		cssClasses['text'] = 'FPSignFormTextInput';
	}
	switch(formType){
		case 'register':
			formHTML =
			'<form><input type="text" class="'+cssClasses['text']+'" /><input type="text" class="'+cssClasses['text']+'" /></form>';
		break;
		case 'login':
			formHTML =
			'<form><input type="text" class="'+cssClasses['text']+'" /><input type="text" class="'+cssClasses['text']+'" /></form>';
		break;
	}
	if (formHTML != "")
		document.getElementById(id).innerHTML = formHTML;
		
}
