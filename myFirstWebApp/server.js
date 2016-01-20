/*====== SET UP SERVER ======*/

// N.B. 'require' is a built in Node.js Function that
// imports things from node_modules

// Function that creates a server
var express = require('express');  

// Create server...
var server = express();

// Now configure the server...


/*====== SET UP SERVING FROM public DIRECTORY ======*/

// Module for getting file path information
var path = require('path');

var publicDirPath = path.resolve(__dirname, 'public');

// Function that creates a request handler for serving
// files from a given directory
var serveStatic = require('serve-static');

server.use(serveStatic(publicDirPath));

// but if the file cannot be found in the public dir...


/*====== SETUP HANDLING UNRECOGNIZED REQUEST PATHS ======*/

// Function to handle unrecognized request paths
function unrecognizedPathHandler(req, res) {
  var msg = 'Unrecognized path: ' + req.url;
  console.log(msg);
  res.status(404).send(msg);
}

server.use(unrecognizedPathHandler);


/*====== START SERVER ======*/

var port = 9002;

server.listen(port, function() {
  console.log('Server listening at http://localhost:' + port);
});

