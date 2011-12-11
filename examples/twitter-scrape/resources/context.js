(function(locals){
    return {
	fetch: function(resource, callback){
	    var url = require("url");
	    var http = require("http");

	    var parsed_url = url.parse(resource);
	    var http_options = {
		host: parsed_url.hostname,
		port: parsed_url.port || 80,
		path: parsed_url.pathname + (parsed_url.search || "") + (parsed_url.hash || ""),
		method: "GET"
	    };

	    var req = http.request(http_options, function(res){
		var body = "";
		res.on("data", function(chunk){
		    body += chunk;
		});
		res.on("end", function(){
		    callback(body);
		});
	    });
	    req.end();
	},
	add: function(a,b){
	    return a+b;
	}
    };
})