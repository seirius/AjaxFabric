function AjaxRequest (url, parameters) {
	this.url = url;
	this.parameters = parameters;
	
	this.response;
	this.dataType = "json";
	this.type = "POST";
	this.async = true;
	
	this.errorCode = 0;
	this.errorMessage;
	
	this.STATE_INI  = "INITIAL";
	this.STATE_PROG = "IN_PROGRESS";
	this.STATE_DONE = "DONE";
	this.state = this.STATE_INI; //INITIAL, IN_PROGRESS, DONE
}

AjaxRequest.prototype.addBeforeSend = function (beforeSend) {
	try {
		this.beforeSend = function () {
			try {
				var ajaxRequest = this.ajaxRequest;
				ajaxRequest.state = ajaxRequest.STATE_PROG;
				
				if ($.type(beforeSend) != "function") {
					throw "beforeSend is not a Function";
				}
				
				beforeSend(ajaxRequest);
			} catch(e) {
				console.log("Error in AjaxRequest.beforeSend().\nDetails: " + e);
			}
		};
		
	} catch(e) {
		console.log("Error in AjaxRequest.addBeforeSend().\nDetails: " + e);
	}
};

AjaxRequest.prototype.addOnSuccess = function (onSuccess) {
	try {
		this.onSuccess = function () {
			try {
				var ajaxRequest = this.ajaxRequest;
				
				if ($.type(onSuccess) != "function") {
					throw "onSuccess is not a Function";
				}
				
				onSuccess(ajaxRequest);
			} catch(e) {
				console.log("Error in AjaxRequest.onSuccess().\nDetails: " + e);
			}
		};
	} catch(e) {
		console.log("Error in AjaxRequest.addOnSuccess().\nDetails: " + e);
	}
};

AjaxRequest.prototype.addAlwaysExecute = function (alwaysExecute) {
	try {
		this.alwaysExecute = function () {
			try {
				var ajaxRequest = this.ajaxRequest;
				ajaxRequest.state = ajaxRequest.STATE_DONE;
				
				if ($.type(alwaysExecute) != "function") {
					throw "alwaysExecute is not a Function";
				}
				
				alwaysExecute(ajaxRequest);
			} catch(e) {
				console.log("Error in AjaxRequest.addAlwaysExecute().\nDetails: " + e);
			}
		};
		
	} catch(e) {
		console.log("Error in AjaxRequest.addAlwaysExecute().\nDetails: " + e);
	}
};

AjaxRequest.prototype.execute = function (options) {
	try {
		if (this.state != this.STATE_INI) {
			console.log("Warning: can't execute a Request already executed or in progress.");
			return;
		}
		
		var settings = $.extend({
			onSuccess: function () {},
			beforeSend: function () {},
			alwaysExecute: function () {}
		}, options);
		
		if ($.type(settings.onSuccess) == "function") {
			this.addOnSuccess(settings.onSuccess);
		}
		if ($.type(settings.beforeSend) == "function") {
			this.addBeforeSend(settings.beforeSend);
		}
		if ($.type(settings.alwaysExecute) == "function") {
			this.addAlwaysExecute(settings.alwaysExecute);
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
		var ajaxRequest = this.ajaxRequest;
		var fabric = ajaxRequest.fabric;
		if ($.type(fabric) != "undefined") {
			fabric.executeSharedFunctions(ajaxRequest.name);
		}
	} catch(e) {
		console.log("Error in AjaxRequest.handleFabric().\nDetails: " + e);
	}
};
































