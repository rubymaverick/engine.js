fetch("http://search.twitter.com/search.json?q=foo", function(doc){
    try{
	var tweets = JSON.parse(doc);
	var tweet;
	tweets.results.forEach(function(tweet){
	    Tweet.build({
		handle: tweet.from_user,
		tweet: tweet.text
	    }).save().on('success', function(record){
		console.log("created record: " + record.id);
	    });
	});
    } catch (e) {
	console.log("There was an error parsing the JSON:" + e.name + ": " + e.message);
    }
});