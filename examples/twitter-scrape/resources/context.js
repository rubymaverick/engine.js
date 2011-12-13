    var Sequelize = require('sequelize');
    var sequelize = new Sequelize(locals.db,locals.user,locals.pass);

    var Tweet = sequelize.define('Tweet',{
	id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
	handle: { type: Sequelize.STRING },
	tweet: { type: Sequelize.STRING }
    });

    Tweet.sync();


(function(locals){

    return {
	Tweet: Tweet,
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