
// These two lines are required to initialize Express in Cloud Code.
 express = require('express');
 app = express();

// Global app configuration section
app.set('views', 'cloud/views');  // Specify the folder to find templates
app.set('view engine', 'ejs');    // Set the template engine
app.use(express.bodyParser());    // Middleware for reading request body

// This is an example of hooking up a request handler with a specific request
// path and HTTP verb using the Express routing API.
app.get('/spaceapi', function(req, res) {

  Parse.Cloud.run('spaceapi', { }, {
  success: function(result) {
  	res.json(result);
  },
  error: function(error) {
  	res.json(error);
  }
});
});

// Attach the Express app to Cloud Code.
app.listen();
