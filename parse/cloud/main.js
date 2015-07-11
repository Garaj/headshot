
require('cloud/app.js');

Parse.Cloud.define("spaceapi", function(request, response) {
  	Parse.Cloud.useMasterKey();

	output = {
		"api": "0.13",
		"space": "Garaj",
		"logo": "http:\/\/garaj.co\/img\/logo-blue.png",
		"url": "http:\/\/garaj.co\/",
		"location": {
			"address": "Rumelihisari Mh. 4. Sk No: 27 Sariyer Istanbul",
			"lon": 29.048536,
			"lat": 41.0873833
		},
		"contact": {
			"twitter": "@garajco",
			"email": "garajco@gmail.com"
		},
		"issue_report_channels": [
			"twitter"
		],
		"state": {
			"open": null,
			"message": "Status Unknown!"
		},
		"projects": [
			"http:\/\/github.com\/Garaj"
		],
		"cache": {
			"schedule": "m.02"
		}
	}

	var HeadCount = Parse.Object.extend("HeadCount");
	var query = new Parse.Query(HeadCount);
	query.limit(1);
	query.descending("updatedAt");
	query.find({
	  success: function(results) {
	    console.log("Successfully retrieved " + results.length + " scores.");

	    if (results.length > 0) {
	    	var lastHeadCount = results[0];

			var count = lastHeadCount.get("count");

			console.log(lastHeadCount.updatedAt);

			output.state.open = count > 0;
			output.state.lastchange = Math.floor(lastHeadCount.updatedAt.getTime() / 1000);
			output.state.headcount = count;
			
			if (count > 0) {
				output.state.message = "Open! " + count + " device(s) connected.";
			} else {
				output.state.message = "Closed!";
			}
	    }
		response.success(output);

	  },
	  error: function(error) {
	    console.log("Error: " + error.code + " " + error.message);

		response.error(error);
	  }
	});

});
