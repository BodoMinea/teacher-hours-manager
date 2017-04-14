// config
var login = { 'username': 'password' },
	year = 2017,
  port = 3003;

// required modules
var express = require('express'), // web server
	basicAuth = require('express-basic-auth'), // auth
	app = express(), // setup app
	fs = require('fs'), // filesystem access
	http = require('http').Server(app), // http protocol
	io = require('socket.io')(http), // client-server socket
	file; // global file

app.use(basicAuth({ // prompt server to show auth and process login from array with details set in config
    users: login,
    challenge: true
}))

app.use('/static', express.static('app/public')); // static resources

app.get('/', function(req, res){ // editor page
  res.sendFile(__dirname + '/app/view/editor.html');
  console.log('Editor Display Active '+Date()); // log
});

io.on('connection', function(socket){ // on client message

  socket.on('load', function(msg){
  	file = year;
    fs.readFile('./config/'+year+'.conf', "UTF8", function(err, data) {
    	if (err) { throw err }; // break on file error
    	global_data = JSON.parse(data);
    	io.emit('start', global_data);
	}); 
  });

  socket.on('save', function(msg){
  	fs.truncate('./config/'+file+'.conf', 0, function() {
    fs.writeFile('./config/'+file+'.conf', msg, function (err) {
        if (err) {
            return console.log("Error writing file: " + err); // break on file error
        }
    });
   });
  });

});

http.listen(port, function(){ // log 
  console.log('Server is active. Listening on http://*IP or hostname*:'+port+' ' + Date());
});