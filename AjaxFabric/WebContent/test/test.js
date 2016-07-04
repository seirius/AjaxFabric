$(document).ready(function () {
    var button = $("body").find("button");
    
    button.click(function () {
        new AjaxRequest({
            url: "template.html",
            selector: "#testDiv",
            templates: {
                text: "Hello world!"
            },
            dataType: "html",
            onSuccess: function (ajaxRequest) {
                $("body").append(ajaxRequest.response);
            },
            mustache: true
        });
    });
});