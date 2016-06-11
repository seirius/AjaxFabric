function AjaxFabric() {
	this.ajaxs = [];
	this.sharedFunctionsList = [];
}

AjaxFabric.prototype.addNewAjaxRequest = function (url, parameters, name) {
	var ajaxRequest;
	
	try {
		ajaxRequest = new AjaxRequest(url, parameters);
		ajaxRequest.name = name;
		ajaxRequest.fabric = this;
		this.ajaxs.push(ajaxRequest);
	} catch(e) {
		console.log("Error in AjaxFabric.addNewAjaxRequest().\nDetails: " + e);
	}
	
	return ajaxRequest;
};

AjaxFabric.prototype.getAjaxRequest = function (name) {
	var ajaxRequest;
	
	try {
		var i = 0;
		var ajaxs = this.ajaxs;
		for (i; i < ajaxs.length; i++) {
			if (ajaxs[i].name == name) {
				ajaxRequest = ajaxs[i];
				i = ajaxs.length;
			}
		}
	} catch(e) {
		console.log("Error in AjaxFabric.getAjaxRequest().\nDetails: " + e);
	}
	
	return ajaxRequest;
};

AjaxFabric.prototype.addSharedFunction = function (sharedFunction, ajaxNames, executeWithErrors) {
	try {
		if (!isFunction(sharedFunction)) {
			throw "sharedFunction is not a functions";
		} else if (!Array.isArray(ajaxNames)) {
			throw "ajaxNames is not an Array";
		} 
		
		var executeWEErrorsAux = false;
		if (isBoolean(executeWithErrors)) {
			executeWEErrorsAux = executeWithErrors;
		}
		
		this.sharedFunctionsList.push({
			sharedFunction:    sharedFunction,
			ajaxNames:         ajaxNames,
			executed:          false,
			executeWithErrors: executeWEErrorsAux
		});
		
	} catch(e) {
		console.log("Error in AjaxFabric.addSharedFunction().\nDetails: " + e);
	}
}

AjaxFabric.prototype.executeSharedFunctions = function (name) {
	try {
		var ajaxFabric = this;
		var sharedFunctionsList = this.sharedFunctionsList;
		
		sharedFunctionsList.forEach(function (value, index) {
			value.ajaxNames.some(function (value2, index2, ajaxNames) {
				if (value2 == name) {
					var ajaxsDone      = ajaxFabric.areDone(ajaxNames);
					var ajaxsHasErrors = ajaxFabric.hasErrors(ajaxNames);
					
					if ( (ajaxsDone && !ajaxsHasErrors) || (ajaxsDone && ajaxsHasErrors && value.executeWithErrors) ) {
						value.sharedFunction(ajaxFabric);
						value.executed = true;
					} else if (ajaxsDone && ajaxsHasErrors) {
						value.executed = true;
					}
					
					return true;
				}
			});
		});
	} catch(e) {
		console.log("Error in AjaxFabric.executeSharedFunctions().\nDetails: " + e);
	}
};

AjaxFabric.prototype.areDone = function (names) {
	try {
		var ajaxFabric = this;
		return names.every(function (name) {
			return ajaxFabric.getAjaxRequest(name).isDone();
		});
	} catch(e) {
		console.log("Error in AjaxFabric.areDone().\nDetails: " + e);
	}
};

AjaxFabric.prototype.hasErrors = function (names) {
	try {
		var ajaxFabric = this;
		return names.some(function (name) {
			return ajaxFabric.getAjaxRequest(name).errorCode != 0;
		});
	} catch(e) {
		console.log("Error in AjaxFabric.hasErrors().\nDetails: " + e);
	}
};

AjaxFabric.prototype.executeAll = function () {
	try {
		var i = 0;
		var length = this.ajaxs.length;
		for (i; i < length; i++) {
			var ajaxRequest = this.ajaxs[i];
			if (!ajaxRequest.isDone() && !ajaxRequest.inProgress()) {
				ajaxRequest.execute();
			}
		}
	} catch(e) {
		console.log("Error in AjaxFabric.executeAll().\nDetails: " + e);
	}
}

AjaxFabric.prototype.executeSome = function (names) {
	try {
		if (!Array.isArray(names)) {
			throw "Names has to be an Array";
		}
		
		var i = 0;
		var length = names.length;
		for (i; i < length; i++) {
			var ajaxRequest = this.getAjaxRequest(names[i]);
			if (!ajaxRequest.isDone() && !ajaxRequest.inProgress()) {
				ajaxRequest.execute();
			}
		}
	} catch(e) {
		console.log("Error in AjaxFabric.executeSome().\nDetails: " + e);
	}
}





