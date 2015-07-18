
// These two lines are required to initialize Express in Cloud Code.
 express = require('express');
 app = express();

// Global app configuration section
// app.set('views', 'cloud/views');  // Specify the folder to find templates
// app.set('view engine', 'ejs');    // Set the template engine
// app.use(express.bodyParser());    // Middleware for reading request body
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  res.header("Content-Type", "application/json; charset=utf-8");
  
  res.header("Cache-Control", "public, max-age=180");
  next();
});
// This is an example of hooking up a request handler with a specific request
// path and HTTP verb using the Express routing API.
app.get('/spaceapi', function(req, res) {

  Parse.Cloud.useMasterKey();

  var HeadCount = Parse.Object.extend("HeadCount");
  var query = new Parse.Query(HeadCount);
  query.limit(1);
  query.descending("updatedAt");
  query.find({
  	success: function(results) {

  	  lastChangeDate = null;
  	  if (results.length > 0) {
  	  	lastChangeDate = results[0].updatedAt;
  	  }

  	  res.header("Last-Modified", lastChangeDate.toUTCString());
  	  if (req.fresh) {
        console.log("Cache hit");
        res.status(304).end();
  	  } else {

        console.log("Making a new request");

  		  Parse.Cloud.run('spaceapi', { }, {
  		  	success: function(result) {
  		      res.json(result);
  		  	},
  		  	error: function(error) {
  		      res.json(error);
  		    }
  		  });
  	  }
  	},
  	error: function(error) {
  		console.log("Error: " + error.code + " " + error.message);
      res.sendStatus(500);
	  }
	});
});

// Attach the Express app to Cloud Code.
app.listen();
