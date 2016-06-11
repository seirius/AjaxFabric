$(document).ready(function () {
	$("button").click(function () {
		var ajaxFabric = new AjaxFabric();
		var A = ajaxFabric.addNewAjaxRequest("/AjaxFabric/test/server-response-2.txt", "", "A");
		var B = ajaxFabric.addNewAjaxRequest("/AjaxFabric/test/server-response-2.txt", "", "B");
		var C = ajaxFabric.addNewAjaxRequest("/AjaxFabric/test/server-response-2.txt", "", "C");
		var D = ajaxFabric.addNewAjaxRequest("/AjaxFabric/test/server-response-2.txt", "", "D");
		var E = ajaxFabric.addNewAjaxRequest("/AjaxFabric/test/server-response-2.txt", "", "E");
		var F = ajaxFabric.addNewAjaxRequest("/AjaxFabric/test/server-response-2.txt", "", "F");
		var G = ajaxFabric.addNewAjaxRequest("/AjaxFabric/test/server-response-2.txt", "", "G");
		
		var log = function (ajaxRequest) {
			console.log(ajaxRequest.name + ": DONE");
		};
		
		AjaxRequest.prototype.dataType = "text";
		
		A.addOnSuccess(log);
		B.addOnSuccess(log);
		C.addOnSuccess(log);
		D.addOnSuccess(log);
		E.addOnSuccess(log);
		F.addOnSuccess(log);
		G.addOnSuccess(log);
		
		ajaxFabric.addSharedFunction(function () {
			console.log("A + B");
			
			ajaxFabric.addSharedFunction(function () {
				console.log("C + D + E");
				
				ajaxFabric.addSharedFunction(function () {
					console.log("(A + B + C + D + E) + F + G");
				}, ["F", "G"]);
				
				ajaxFabric.executeSome(["F", "G"]);
			}, ["C", "D", "E"]);
			
			ajaxFabric.executeSome(["D", "E"]);
		}, ["A", "B"]);
		
		ajaxFabric.executeSome(["A", "B", "C"]);
	});
});