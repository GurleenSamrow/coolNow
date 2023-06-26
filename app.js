// app.js

// set up ======================================================================
// get all the tools we need
var express  = require(__dirname + '/node_modules/express');
var path 	 = require('path');
var flash    = require(__dirname + '/node_modules/connect-flash');
var bodyParser   = require(__dirname + '/node_modules/body-parser');
var cookieParser = require(__dirname + '/node_modules/cookie-parser');
var session      = require(__dirname + '/node_modules/express-session');
//var validator = require(__dirname + '/node_modules/express-validator');
var request = require(__dirname + '/node_modules/request');
//var debug = require(__dirname + '/node_modules/debug');
var http = require('http');
var helper = require('./helper.js');
var multer = require('multer');
const cF            = require('./helpers/cF');

var app      = express();

console.log("port1 "+process.env.PORT);
var port     = process.env.PORT || 8081;
console.log("port "+port);

app.use(cF.httpResponseApi);
// set up our express application
app.use(bodyParser.json()); // get information from html forms
app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs'); // set up ejs for templating


app.use('/img',express.static(path.join(__dirname, 'public/img')));
app.use('/js',express.static(path.join(__dirname, 'public/js')));
app.use('/css',express.static(path.join(__dirname, 'public/css')));
app.use('/fonts',express.static(path.join(__dirname, 'public/fonts')));
app.use('/uploads',express.static(path.join(__dirname, 'public/uploads')));
app.use('/font-awesome',express.static(path.join(__dirname, 'public/font-awesome')));

global.SITE_NAME = 'Cool Now! App' 

//global.SITE_PATH = 'http://localhost:8081/'
//global.SITE_URL = 'http://localhost:8081/';
//global.BASE_URL = 'F:/node_projects/coolnow/';

global.SITE_PATH = 'http://18.191.254.193/'
global.SITE_URL = 'http://18.191.254.193:3000/'
global.BASE_URL = '/home/ubuntu/ubercooll/';

// required for passport
//app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(cookieParser());
app.use(session({ secret: 'ilovescotchscotchyscotchscotch', cookie: { maxAge: 60 * 60 * 1000 }, resave: true, saveUninitialized: true }))

app.use(flash()); // use connect-flash for flash messages stored in session

app.use(multer({
    dest: path.join(__dirname, "upload/"),
    rename: function (fieldname, filename) {
        return filename.replace(/\W+/g, '-').toLowerCase() + Date.now()
    }
}).any());

//app.use(validator()); //required for Express-Validator

// routes ======================================================================

require('./routes/userRoutes.js')(app);
require('./routes/technicianRoutes.js')(app);
require('./routes/dashboardRoutes.js')(app);

// launch ======================================================================
app.listen(port);
console.log('The magic happens on port ' + port);

// Define & Initialize mongo db connection...
var mongoose = require(__dirname + '/node_modules/mongoose');
mongoose.connect('mongodb://127.0.0.1/coolnow',{
	useNewUrlParser: true, 
    useUnifiedTopology: true
});

var db = mongoose.connection;
db.on('error', function(error){
	console.log(error)
  console.log('Failed to connect to database....exiting...!\r\n');
  process.exit(-1);  
});
db.once('open', function(){
  console.log('Connected to database!\r\n');
});
app.use(express.static(path.join(__dirname, 'public'), {
	etag: true
}));
var User = helper.getModel('user');
var Chat = helper.getModel('chat');

var server = http.createServer(app);
const io = require(__dirname + '/node_modules/socket.io')(server)

io.on("connection", (socket) => {
	console.log("socket Connected: " + socket.userId);

	socket.on("disconnect", () => {
		console.log("Disconnected: " + socket.userId);
	});

	socket.on("joinRoom", ({ chatroomId }) => {
		socket.join(chatroomId);
		console.log("A user joined chatroom: " + chatroomId);
	});

	socket.on("leaveRoom", ({ chatroomId }) => {
		socket.leave(chatroomId);
		console.log("A user left chatroom: " + chatroomId);
	});

	socket.on("chatroomMessage", async ({ chatroomId, message }) => {
		if (message.trim().length > 0) {
			// const user = await User.findOne({ _id: socket.userId });
			// const newMessage = new Message({
				// chatroom: chatroomId,
				// user: socket.userId,
				// message,
			// });
			io.to(chatroomId).emit("newMessage", {
				message,
				name: user.name,
				userId: socket.userId,
			});
			//await newMessage.save();
		}
	});
});

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}