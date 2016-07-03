function AjaxRequest (arg1, parameters) {
	var settings = $.extend({
		url: "",
		selector: "",
		parameters: {},
		templates: {},
		response: "",
		dataType: "json",
		type: "POST",
		async: true,
		errorCode: 0,
		errorMessage: "",
		name: "",
		mustache: false,
		execute: true,
		onSuccess: function () {},
		beforeSend: function () {},
		alwaysExecute: function () {}
	}, arg1);
	
	this.url = settings.url;
	this.selector = settings.selector;
	this.parameters = settings.parameters;
	this.templates = settings.templates;
	this.response;
	this.dataType = settings.dataType;
	this.type = settings.type;
	this.async = settings.async;
	this.errorCode = settings.errorCode;
	this.errorMessage = settings.errorMessage;
	this.mustache = settings.mustache;
	this.name = settings.name;
	
	this.STATE_INI  = "INITIAL";
	this.STATE_PROG = "IN_PROGRESS";
	this.STATE_DONE = "DONE";
	this.state = this.STATE_INI; //INITIAL, IN_PROGRESS, DONE
	this.fabric;
	
	this.addBeforeSend(settings.beforeSend);
	this.addOnSuccess(settings.onSuccess);
	this.addAlwaysExecute(settings.alwaysExecute);
	
	if (settings.execute) {
		this.execute();
	}
	
	return this;
}

AjaxRequest.prototype.addBeforeSend = function (beforeSend) {
	try {
		var ajaxRequest = this;
		this.beforeSend = function () {
			try {
				ajaxRequest.state = ajaxRequest.STATE_PROG;
				
				if ($.type(beforeSend) != "function") {
					throw "beforeSend is not a Function";
				}
				
				beforeSend(ajaxRequest);
			} catch(e) {
				console.log("Error in AjaxRequest.beforeSend().\nDetails: " + e);
			}
		};
		
		return ajaxRequest;
	} catch(e) {
		console.log("Error in AjaxRequest.addBeforeSend().\nDetails: " + e);
	}
};

AjaxRequest.prototype.addOnSuccess = function (onSuccess) {
	try {
		var ajaxRequest = this;
		this.onSuccess = function () {
			try {
				if ($.type(onSuccess) != "function") {
					throw "onSuccess is not a Function";
				}
				
				onSuccess(ajaxRequest);
				
			} catch(e) {
				console.log("Error in AjaxRequest.onSuccess().\nDetails: " + e);
			}
		};
		
		return ajaxRequest;
	} catch(e) {
		console.log("Error in AjaxRequest.addOnSuccess().\nDetails: " + e);
	}
};

AjaxRequest.prototype.addAlwaysExecute = function (alwaysExecute) {
	try {
		var ajaxRequest = this;
		
		this.alwaysExecute = function () {
			try {
				ajaxRequest.state = ajaxRequest.STATE_DONE;
				
				if (ajaxRequest.mustache) {
					ajaxRequest.response = $("<div>").append($.parseHTML(ajaxRequest.response));
					if (ajaxRequest.selector.length > 0) {
						ajaxRequest.response = ajaxRequest.response.find(ajaxRequest.selector).html();
					} else {
						ajaxRequest.response = ajaxRequest.response.html();
					}
					ajaxRequest.response = Mustache.render(ajaxRequest.response, ajaxRequest.templates);
				}
				
				if ($.type(alwaysExecute) != "function") {
					throw "alwaysExecute is not a Function";
				}
				
				alwaysExecute(ajaxRequest);
				
			} catch(e) {
				console.log("Error in AjaxRequest.addAlwaysExecute().\nDetails: " + e);
			}
		};
		
		return ajaxRequest;
	} catch(e) {
		console.log("Error in AjaxRequest.addAlwaysExecute().\nDetails: " + e);
	}
};

AjaxRequest.prototype.execute = function () {
	try {
		if (this.state != this.STATE_INI) {
			console.log("Warning: can't execute a Request already executed or in progress.");
			return;
		}
		
		return $.ajax({
			ajaxRequest: this,
			url:         this.url,
			type:        this.type,
			async:       this.async,
			dataType:    this.dataType,
			data:        this.parameters,
			beforeSend:  this.beforeSend,
			success: [
				         this.loadData,
				         this.treatErrors,
				         this.onSuccess,
				         this.alwaysExecute,
				         this.handleFabric
			          ],
			error: [
				         this.treatJQErrors,
				         this.alwaysExecute,
				         this.handleFabric
			       ]
		});
	} catch(e) {
		console.log("Error in AjaxRequest.execute().\nDetails: " + e);
	}
};

AjaxRequest.prototype.treatJQErrors = function (error) {
	try {
		if (error.status != 200) {
			var ajaxRequest = this.ajaxRequest;
			ajaxRequest.errorCode    = -2;
			ajaxRequest.errorMessage = error;
		}
	} catch(e) {
		console.log("Error in AjaxRequest.treatJQErrors().\nDetails: " + e);
	}
};

AjaxRequest.prototype.treatErrors = function () {
	try {
		//Do your stuff here
	} catch(e) {
		console.log("Error in AjaxRequest.treatErrors().\nDetails: " + e);
	}
};

AjaxRequest.prototype.getUrl = function () {
	return this.url;
};

AjaxRequest.prototype.loadData = function (response) {
	try {
		this.ajaxRequest.response = response;
	} catch(e) {
		console.log("Error in AjaxRequest.loadData().\nDetails: " + e);
	}
};

AjaxRequest.prototype.isDone = function () {
	try {
		return this.state == this.STATE_DONE;
	} catch(e) {
		console.log("Error in AjaxRequest.isDone().\nDetails: " + e);
	}
};

AjaxRequest.prototype.inProgress = function () {
	try {
		return this.state == this.STATE_PROG;
	} catch(e) {
		console.log("Error in AjaxRequest.inProgress().\nDetails: " + e);
	}
};

AjaxRequest.prototype.isInit = function () {
	try {
		return this.state == this.STATE_INI;
	} catch(e) {
		console.log("Error in AjaxRequest.isInit().\nDetails: " + e);
	}
};

AjaxRequest.prototype.handleFabric = function () {
	try {
		var ajaxRequest;
		if ($.type(this.ajaxRequest) == "undefined") {
			ajaxRequest = this;
		} else {
			ajaxRequest = this.ajaxRequest;
		}
		
		var fabric = ajaxRequest.fabric;
		if ($.type(fabric) != "undefined") {
			fabric.executeSharedFunctions(ajaxRequest.name);
		}
	} catch(e) {
		console.log("Error in AjaxRequest.handleFabric().\nDetails: " + e);
	}
};
































