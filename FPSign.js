var FPSign={};
FPSign.baseURL = 'https://app.fp-sign.com/api/v1_2';
FPSign.login = function(username, password){
	return new Promise(function(resolve, reject){
		var payload = 
			{
				"username": decodeURIComponent(username),
				"password": password
			}
        FPSign.Xhr.POST(FPSign.baseURL + '/login', function(data){
          if (data.status < 300)
          	resolve(data.body);
          else
            reject(data.body);
        },payload, undefined, 'application/json');
	});
}

FPSign.register = function(email, password, firstName, lastName, language, country, resellerId, campaignName, leadSource){
	return new Promise(function(resolve, reject){
		var payload = 
			{
				"email": decodeURIComponent(email),
				"password": password,
				"first_name": firstName,
				"last_name": lastName,
				"language":language,
				"country": country,
				"reseller_id": resellerId,
			}
        if (campaignName != undefined){
          payload["campaign_name"] = campaignName;
        }
      	if (leadSource != undefined){
          payload["lead_source"] = leadSource;
        }
      	
        FPSign.Xhr.POST(FPSign.baseURL + '/registration', function(data){
          if (data.status < 300)
          	resolve(data.body);
          else
            reject(data.body);
        },payload, undefined, 'application/json');
	});
}

FPSign.Xhr={	
	GET:function(url, callback, body, auth){
		var xmlhttp;
		if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
			xmlhttp=new XMLHttpRequest();
		} else {// code for IE6, IE5
			xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
		}		
		
		
		xmlhttp.onreadystatechange=function(){
          if (xmlhttp.readyState==4){
            var response = {};
            response.body = xmlhttp.responseText;
            response.status = xmlhttp.status;
            callback(response);
          }
		}
		
		xmlhttp.open("GET",url,true);
		if (auth != undefined)
			xmlhttp.setRequestHeader("Authorization", "Basic " + btoa(auth['username'] + ":" + auth['password']));
		xmlhttp.send(body);
	},

	POST:function(url, callback, body, auth, contentType){
		var xmlhttp;
		if (window.XMLHttpRequest){// code for IE7+, Firefox, Chrome, Opera, Safari
			xmlhttp=new XMLHttpRequest();
		} else {// code for IE6, IE5
			xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
		}		

		xmlhttp.onreadystatechange=function(){
          if (xmlhttp.readyState==4){
            var response = {};
            response.body = xmlhttp.responseText;
            response.status = xmlhttp.status;
            callback(response);
          }
		}
		
		xmlhttp.open("POST",url,true);
		if (contentType != undefined)
			xmlhttp.setRequestHeader("Content-Type", contentType);
		if (auth != undefined)
			xmlhttp.setRequestHeader("Authorization", "Basic " + btoa(auth['username'] + ":" + auth['password']));
		xmlhttp.send(JSON.stringify(body));
	}
}
