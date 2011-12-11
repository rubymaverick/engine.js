fetch("http://search.twitter.com/search.json?q=foo", function(doc){
    try{
	var tweets = JSON.parse(doc);
	tweets.results.forEach(function(tweet){
	    console.log(tweet.from_user + " :: " + tweet.text);
	});
    } catch (e) {
	console.log("There was an error parsing the JSON:" + e.name + ": " + e.message);
    }
});

"foo";