/* enviroment */
var port = process.env.PORT || 4242;
var db_path;

/* requires */
var express = require('express'),
	mongoose = require('mongoose'),
	secret = require('./secret.js'),
	io = require('socket.io'),
	routes = {
		user : require('./routes/user.js'),
		idea : require('./routes/idea.js'),
		feature: require('./routes/feature.js'),
		comment : require('./routes/comment.js'),
		views : require('./routes/views.js'),
		authentication: require('./routes/authentication.js')
	};

/* create server */
var app = express.createServer();
var sio = io.listen(app);

/* socket functions, probably wont need these */
var getWithSoc = function(route, cb){
	app.get(route, function(req, res){
		cb(req, res, sio);
	});
};
var postWithSoc = function(route, cb){
	app.post(route, function(req, res){
		cb(req, res, sio);
	});
};

/* init database */
db = mongoose.connect(db_path);

/* configs */
app.configure(function(){
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.session({secret: "catwoman"}));
	app.use(express.static(__dirname+"/public"));
	app.set('views', __dirname+'/views');
	app.set('view engine', 'ejs');
	app.set('view options', {
		layout : false
	});
});
app.configure('development', function() {
	db_path = "mongodb://localhost/socialpivot";
});
app.configure('production', function() {
	db_path = "mongodb://batman:"+secret.password+"@staff.mongohq.com:10005/socialpivot";
});


/* ROUTES */

/* Login/Logout/Register */
app.post("/login", routes.authentication.login);
app.get("/logout", routes.authentication.logout);
app.post("/register", routes.authentication.register);

/* views */
app.get("/profile/:userId", routes.views.profileView);
app.get("/idea/:ideaID", routes.views.ideaView);
app.get("/search", routes.views.searchView);
app.get("/feed", routes.views.feedView);
app.get("/signup", routes.views.signup);
app.get("/createIdea", routes.views.createIdea);
app.post("/saveIdea", function(req, res) {
	routes.views.saveIdea(req, res, sio)
});
app.post("/submitComment", routes.views.submitComment);

/* Landing page */
app.get('/', routes.views.landingView);

sio.sockets.on('connection', function(socket) {
	console.log("A socket has connected!");
});


/* START UP */

/* start 'er up */
mongoose.connection.on('open', function(){
	console.log('mongoose has opened a connection to '+db_path);
});
app.listen(port);
console.log("server has started on port "+port);
