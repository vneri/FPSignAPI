if (FPSign == undefined){
	var FPSign = {};
}
FPSign.APIVersion = '1.2';
FPSign.libVersion = '1.1';
FPSign.loginData = {};
FPSign.Ext = {};
FPSign.baseURL = 'https://app.fp-sign.com/api/v1_2';

FPSign.login = function(username, password){
	return new Promise(function(resolve, reject){
		var payload = 
			{
				"username": decodeURIComponent(username),
				"password": password
			}
        FPSign.Xhr.POST(FPSign.baseURL + '/login', function(data){
          if (data.status < 300){
			FPSign.loginData = JSON.parse(data.body);
			FPSign.loginData.token = [];
			FPSign.loginData.token['bearer'] = FPSign.loginData.value;
			FPSign.loginData.token['tenant'] = FPSign.loginData.user.accounts[0].tenant.id;
          	resolve(data.body);
		  }
          else
            reject(data.body);
        },payload, undefined, 'application/json');
	});
}
FPSign.refresh = function(){
	return new Promise(function(resolve, reject){
		var auth=[];
		if (FPSign.loginData == undefined){
			reject('Not logged in');
		}
        FPSign.Xhr.GET(FPSign.baseURL + '/auth/refresh', function(data){
          if (data.status < 300)
          	resolve(true);
          else
            reject(false);
        }, undefined, FPSign.loginData.token, 'application/json');
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

// profile and general information

FPSign.getTenants = function(name, customerNumber, tenantUserEmail){
	return new Promise(function(resolve, reject){  	
        FPSign.Xhr.GET(FPSign.baseURL + '/tenants', function(data){
          if (data.status < 300)
          	resolve(data.body);
          else
            reject(data.body);
        },undefined, FPSign.loginData.token, 'application/json');
	});
}

FPSign.signatureSettings = {};

FPSign.getSignatureSettings = function(email){
	if (email == undefined){
		email = '';
	}
	return new Promise(function(resolve, reject){  	
        FPSign.Xhr.GET(FPSign.baseURL + '/signaturesettings?email='+email, function(data){
			if (data.status < 300){
				FPSign.signatureSettings = JSON.parse(data.body);
				resolve(FPSign.signatureSettings);
			}
			else
				reject(data.body);
        },undefined, FPSign.loginData.token, 'application/json');
	});
}

FPSign.validateEmail = function(email){
	return new Promise(function(resolve, reject){
		var payload = {};
		payload.value = email;
		payload.isInUse = true;
        FPSign.Xhr.POST(FPSign.baseURL + '/validators/in-use/email', function(data){
			if (data.status < 300){
				resolve(JSON.parse(data.body));
			}
			else
				reject(data.body);
        },payload, FPSign.loginData.token, 'application/json');
	});
}
// get workflow information

FPSign.getWorkflows = function(email){
	return new Promise(function(resolve, reject){
        FPSign.Xhr.GET(FPSign.baseURL + '/workflows?email=' + email, function(data){
          if (data.status < 300)
          	resolve(JSON.parse(data.body));
          else
            reject(data.body);
        },undefined, FPSign.loginData.token, 'application/json');
	});
}

FPSign.getWorkflowsWithDetails = function(email){
	return new Promise(function(resolve, reject){
        FPSign.Xhr.GET(FPSign.baseURL + '/workflows?email=' + email, function(data){
          if (data.status < 300)
          	resolve(FPSign.getWorkflowDetails(data.body.replace('[','').replace(']','')).then(JSON.parse));
          else
            reject(data.body);
        },undefined, FPSign.loginData.token, 'application/json');
	});
}


FPSign.getWorkflowDetails = function(workflowIds){
	return new Promise(function(resolve, reject){  	
        FPSign.Xhr.GET(FPSign.baseURL + '/workflows/'+workflowIds, function(data){
			if (data.status < 300)
				resolve(data.body);
			else
				reject(data.body);
			},undefined, FPSign.loginData.token, 'application/json');
	});
}

FPSign.getWorkflowIntents = function(email){
	return new Promise(function(resolve, reject){  	
        FPSign.Xhr.GET(FPSign.baseURL + '/intents/workflows', function(data){
          if (data.status < 300)
          	resolve(FPSign.getWorkflowIntentDetails(data.body.replace('[','').replace(']','')).then(JSON.parse));
          else
            reject(data.body);
        },undefined, FPSign.loginData.token, 'application/json');
	});
}

FPSign.getWorkflowIntentDetails = function(workflowIntentIds){
	return new Promise(function(resolve, reject){  	
        FPSign.Xhr.GET(FPSign.baseURL + '/intents/workflows/'+ workflowIntentIds, function(data){
          if (data.status < 300)
          	resolve(data.body);
          else
            reject(data.body);
        },undefined, FPSign.loginData.token, 'application/json');
	});
}

// status [pending, completed, rejected]
FPSign.getJobs = function(status, email){
	return new Promise(function(resolve, reject){
        FPSign.Xhr.GET(FPSign.baseURL + '/jobs?status='+status+'&email='+email, function(data){
          if (data.status < 300)
          	resolve(FPSign.getJobsDetails(data.body.replace('[','').replace(']','')).then(JSON.parse));
          else
            reject(data.body);
        },undefined, FPSign.loginData.token, 'application/json');
	});
}

FPSign.getJobsDetails = function(jobIds){
	return new Promise(function(resolve, reject){
        FPSign.Xhr.GET(FPSign.baseURL + '/jobs/'+jobIds, function(data){
          if (data.status < 300)
          	resolve(data.body);
          else
            reject(data.body);
        },undefined, FPSign.loginData.token, 'application/json');
	});
}




FPSign.getWorkflowJobs = function(workflowId){
	return new Promise(function(resolve, reject){
        FPSign.Xhr.GET(FPSign.baseURL + '/workflows/'+workflowId+'/jobs', function(data){
			if (data.status < 300)
				resolve(FPSign.getWorkflowJobsDetails(workflowId, data.body.replace('[','').replace(']','')).then(JSON.parse));
			else
				reject(data.body);
		},undefined, FPSign.loginData.token, 'application/json');
	});
}

FPSign.getWorkflowJobsDetails = function(workflowId, jobIds){
	return new Promise(function(resolve, reject){
        FPSign.Xhr.GET(FPSign.baseURL + '/workflows/'+workflowId+'/jobs/'+jobIds, function(data){
          if (data.status < 300)
          	resolve(data.body);
          else
            reject(data.body);
        },undefined, FPSign.loginData.token, 'application/json');
	});
}

FPSign.getWorkflowRootDocument = function(workflowId){
	return new Promise(function(resolve, reject){
        FPSign.Xhr.GET(FPSign.baseURL + '/workflows/' + workflowId + '/documents/root/content', function(data){
          if (data.status < 300)
          	resolve(JSON.parse(data.body));
          else
            reject(data.body);
        },undefined, FPSign.loginData.token, 'application/json');
	});
}
// create workflow

FPSign.createWorkflowIntent = function(intentComment, documentName, documentContent, delegable, notification){
	return new Promise(function(resolve, reject){
		if ((notification != 'all_participants')&&(notification != 'just_me')){
			notification = 'all_participants';
		}
		var payload = {
			"intentComment": intentComment,
			"shared": true,
			"workflowType": "signature_workflow",
			"document":{
				"name": documentName,
				"content": documentContent
			},
			"delegable": delegable,
			"createIntentType": "api_intent",
			"documentType": "original",
			"notification": notification,
		}
        FPSign.Xhr.POST(FPSign.baseURL + '/intents/workflows', function(data){
          if (data.status < 300)
          	resolve(JSON.parse(data.body));
          else
            reject(data.body);
        },payload, FPSign.loginData.token, 'application/json');
	});
}

FPSign.getWorkflowIntentDetails = function(intentIds){
	return new Promise(function(resolve, reject){
		console.log(intentIds);
        FPSign.Xhr.GET(FPSign.baseURL + '/intents/workflows/'+ intentIds, function(data){
          if (data.status < 300)
          	resolve(data.body);
          else
            reject(data.body);
        },undefined, FPSign.loginData.token, 'application/json');
	});
}

FPSign.getWorkflowIntents = function(email){
	return new Promise(function(resolve, reject){
        FPSign.Xhr.GET(FPSign.baseURL + '/intents/workflows?email='+ email, function(data){
          if (data.status < 300)
          	resolve(FPSign.getWorkflowIntentDetails(data.body.replace('[','').replace(']','')).then(JSON.parse));
          else
            reject(data.body);
        },undefined, FPSign.loginData.token, 'application/json');
	});
}

FPSign.deleteWorkflowIntents = function(email){
	return new Promise(function(resolve, reject){
		FPSign.Xhr.GET(FPSign.baseURL + '/intents/workflows?email='+ email, function(data){
			if (data.status < 300){
				var idList = (data.body.replace('[','').replace(']','')).split(',');
				var subList = idList.slice(0,10);
				var totalResult = [];
				while (subList.length>0){
					FPSign.Xhr.DELETE(FPSign.baseURL + '/intents/workflows/'+ (subList.join(',')), function(data){
						totalResult.push(data);
					});
					idList = idList.slice(11);
					subList = idList.slice(0,10);
				}
				resolve(totalResult);
			}
			else
				reject(data.body);
		},undefined, FPSign.loginData.token, 'application/json');
	});
}

FPSign.cancelAllWorkflows = function(email){
	return new Promise(function(resolve, reject){
		FPSign.getWorkflows(email).then(
			workflowList => {
				workflowList.forEach( singleWorkflow => 
					resolve(FPSign.cancelWorkflow(singleWorkflow))
				)
			}
		).catch(
			errorMessage => reject(errorMessage)
		)
	});
}

FPSign.cancelWorkflow = function(workflowId){
	return new Promise(function(resolve, reject){
		var payload = {
			"description": "Automatic cancellation script was executed"
		};
		console.log('Cancelling ' + workflowId);
		FPSign.Xhr.POST(FPSign.baseURL + '/workflows/'+workflowId+'/intents/cancel', function(data){
			if (data.status < 300){
				resolve(data.body);
			}
			else
				reject(data.body);
		},payload, FPSign.loginData.token, 'application/json');
	});	
}



FPSign.createJob = function(workflowIntentId, message, comment, firstName, lastName, participantEmail, signatureSetting, signaturePresets){
	return new Promise(function(resolve, reject){
		var payload = {
			"message": message,
			"comment":comment,
			"participant":{
				"email": participantEmail
			},
			"signatureSetting": signatureSetting,
			"signaturePresets": signaturePresets
		};
		if (firstName != undefined){
			payload.participant.firstname = firstName;
		}
		if (lastName != undefined){
			payload.participant.lastname = lastName;
		}
		
        FPSign.Xhr.POST(FPSign.baseURL + '/intents/workflows/'+ workflowIntentId +'/jobs', function(data){
          if (data.status < 300)
          	resolve(JSON.parse(data.body));
          else
            reject(JSON.parse(data.body));
        },payload, FPSign.loginData.token, 'application/json');
	});
}

FPSign.getJobIntentDetails = function(workflowIntentId, jobId){
	return new Promise(function(resolve, reject){
        FPSign.Xhr.GET(FPSign.baseURL + '/intents/workflows/'+ workflowIntentId +'/jobs/'+ jobId, function(data){
          if (data.status < 300)
          	resolve(JSON.parse(data.body));
          else
            reject(JSON.parse(data.body));
        },undefined, FPSign.loginData.token, 'application/json');
	});
}

FPSign.getJobIntents = function(workflowIntentId){
	return new Promise(function(resolve, reject){
        FPSign.Xhr.GET(FPSign.baseURL + '/intents/workflows/'+ workflowIntentId +'/jobs/', function(data){
          if (data.status < 300)
          	resolve(JSON.parse(data.body));
          else
            reject(JSON.parse(data.body));
        },undefined, FPSign.loginData.token, 'application/json');
	});
}
 


FPSign.createWorkflow = function(workflowIntentId, workflowComment, originatorEmail, originatorSignatureSetting, notification, delegable, documentName, documentContent, reference){
	return new Promise(function(resolve, reject){
		var payload = {
			"id": workflowIntentId,
			"workflowComment": workflowComment,
			"originatorJob":{
				"originator":{
					"email":originatorEmail
				},
				"signatureSetting": originatorSignatureSetting,
			},
			"workflowType": "signature_workflow",
			"delegable": delegable,
			"document":{
				"name": documentName,
				"content": documentContent
			}		
		};
		if (reference != undefined){
			payload.reference = reference;
        }
		FPSign.Xhr.POST(FPSign.baseURL + '/workflows/intents', function(data){
          if (data.status < 300)
          	resolve(JSON.parse(data.body));
          else
            reject(JSON.parse(data.body));
        },payload, FPSign.loginData.token, 'application/json');
	});
}

// sign a job

FPSign.signJob = function(jobId, comment, visualSignature){
	return new Promise(function(resolve, reject){
		var payload = {};
		if ((comment != undefined)&&(comment.trim()!='')){
			payload.comment = comment;
		}
		if (visualSignature != undefined){
			payload.visualSignature = visualSignature;
		}
        FPSign.Xhr.POST(FPSign.baseURL + '/jobs/'+ jobId +'/intents/sign', function(data){
          if (data.status < 300)
          	resolve(data.body);
          else
            reject(data.body);
        },payload, FPSign.loginData.token, 'application/json');
	});
}

// profile
FPSign.getProfile = function(userId){
	return new Promise(function(resolve, reject){
        FPSign.Xhr.GET(FPSign.baseURL + '/users/'+ userId +'/profile', function(data){
          if (data.status < 300)
          	resolve(JSON.parse(data.body));
          else
            reject(data.body);
        },undefined, FPSign.loginData.token, 'application/json');
	});
}

FPSign.changeProfileCulture = function(userId, culture){
	return new Promise(function(resolve, reject){
		var payloadCulture = culture;
		return FPSign.getProfile(userId).then(
			profile => {
				profile.culture = payloadCulture;
				FPSign.Xhr.PUT(FPSign.baseURL + '/users/'+ userId +'/profile', function(data){
				  if (data.status < 300)
					resolve(JSON.parse(data.body));
				  else
					reject(data.body);
				},profile, FPSign.loginData.token, 'application/json');
			}).catch( 
			result =>
				reject(result)
			)
		;
	});
}

FPSign.changeFirstnameLastnameMobilenumber = function(userId, firstName, lastName, cellPhone){
	return new Promise(function(resolve, reject){
		var firstname = firstName;
		var lastname = lastName;
		var cellphone = cellPhone;
		return FPSign.getProfile(userId).then(
			profile => {
				profile.firstname = firstname;
				profile.lastname = lastname;
				profile.cellphone = cellphone;
				FPSign.Xhr.PUT(FPSign.baseURL + '/users/'+ userId +'/profile', function(data){
				  if (data.status < 300)
					resolve(JSON.parse(data.body));
				  else
					reject(data.body);
				},profile, FPSign.loginData.token, 'application/json');
			}).catch( 
			result =>
				reject(result)
			)
		;
	});
}

FPSign.Xhr={
	GET:function(url, callback, body, auth, contentType){
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
		if (contentType != undefined)
			xmlhttp.setRequestHeader("Content-Type", contentType);
		
		if (auth != undefined){
			if (auth['bearer']!=undefined){
				xmlhttp.setRequestHeader("Authorization", "Bearer " + auth['bearer']);
			} else {
				xmlhttp.setRequestHeader("Authorization", "Basic " + btoa(auth['username'] + ":" + auth['password']));
			}
			if (auth['tenant']!=undefined){
				xmlhttp.setRequestHeader("Tenant", auth['tenant']);
			}
		}
		xmlhttp.send(body);
	},
	GENERIC:function(url, method, callback, body, auth, contentType){
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
		
		xmlhttp.open(method,url,true);
		if (contentType != undefined)
			xmlhttp.setRequestHeader("Content-Type", contentType);
		if (auth != undefined){
			if (auth['bearer']!=undefined){
				xmlhttp.setRequestHeader("Authorization", "Bearer " + auth['bearer']);
			} else {
				xmlhttp.setRequestHeader("Authorization", "Basic " + btoa(auth['username'] + ":" + auth['password']));
			}
			if (auth['tenant']!=undefined){
				xmlhttp.setRequestHeader("Tenant", auth['tenant']);
			}
		}		xmlhttp.send(JSON.stringify(body));
	},
	
	PUT:function(url, callback, body, auth, contentType){
		FPSign.Xhr.GENERIC(url, 'PUT', callback, body, auth, contentType);
	},
		
	POST:function(url, callback, body, auth, contentType){
		FPSign.Xhr.GENERIC(url, 'POST', callback, body, auth, contentType);
	},
	
	DELETE:function(url, callback, body, auth, contentType){
		FPSign.Xhr.GENERIC(url, 'DELETE', callback, body, auth, contentType);
	}
}
