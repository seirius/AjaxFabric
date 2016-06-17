function AjaxRequest (url, parameters) {
	this.url = url;
	this.parameters = parameters;
	
	this.response;
	this.dataType = "json";
	
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
				
				if (!isFunction(beforeSend)) {
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
				
				if (!isFunction(onSuccess)) {
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
				
				if (!isFunction(alwaysExecute)) {
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

AjaxRequest.prototype.execute = function (onSuccess, beforeSend, alwaysExecute) {
	try {
		if (this.state != this.STATE_INI) {
			console.log("Warning: can't execute a Request already executed or in progress.");
			return;
		}
		
		if (!isString(this.url)) { throw "URL needs to be a String"; }
		
		if (!isObject(this.parameters)) { this.parameters = {}; }
		
		if (isFunction(onSuccess)) { 
			this.onSuccess     = onSuccess; 
		} else if (!isFunction(this.onSuccess)) {
			this.addOnSuccess(function () {});
		}
		
		if (isFunction(beforeSend)) { 
			this.beforeSend    = beforeSend; 
		} else if (!isFunction(this.beforeSend)) {
			this.addBeforeSend(function () {});
		}
		
		if (isFunction(alwaysExecute)) { 
			this.alwaysExecute = alwaysExecute; 
		} else if (!isFunction(this.alwaysExecute)) {
			this.addAlwaysExecute(function () {});
		}
		
		return $.ajax({
			ajaxRequest: this,
			url:         this.url,
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
		var ajaxRequest = this.ajaxRequest;
		ajaxRequest.errorCode    = -2;
		ajaxRequest.errorMessage = error;
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
		var fabric      = ajaxRequest.fabric;
		if (!isUndefined(fabric)) {
			fabric.executeSharedFunctions(ajaxRequest.name);
		}
	} catch(e) {
		console.log("Error in AjaxRequest.handleFabric().\nDetails: " + e);
	}
};
































