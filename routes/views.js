/* requires */
var User = require('../models/userModel.js'),
	Idea = require('../models/ideaModel.js'),
	Comment = require('../models/commentModel.js'),
	http = require('http'),
	mongoose = require('mongoose'),
	ObjectId = mongoose.Types.ObjectId;

function loginStatus(req) {
	var session;
	if(req.session.user) {
		session = {
			user: req.session.user,
			logged_in: true
		};
	} else {
		session = {
			logged_in: false
		};
	}
	return session;
}

function internalError(res, err){
	console.log('Error : '+err);
	res.writeHead(500);
	res.end('Internal Server Error!\n\n'+err);
}

function sortChrono(event1, event2){
	if(event1.timestamp < event2.timestamp){
		return -1;
	}else if(event1.timestamp > event2.timestamp){
		return 1;
	}else{
		return 0;
	}
}

/* exported functions */
module.exports = {

	notfound : 
		function(req, res){
			res.writeHead(404);
			res.end('Request not found');
		},

	/* render landing view */
	landingView :
		function(req, res){
			res.render('landing.ejs', {
				session: loginStatus(req)
			})
		},

	signup:
		function(req, res) {
			res.render('signup.ejs', {
				session: loginStatus(req)
			});
		},

	submitComment:
		function(req, res) {
		},


	createIdea:
		function(req, res) {
			res.render('createIdea.ejs', {
				session:loginStatus(req)
			});
		},

	saveIdea:
		function(req, res, sio) {
			console.log(req.body);
			sio.sockets.emit('updatefeed');
		},

	/* renders the idea view for a :ideaID that corrosponds to db ID */
	ideaView :
		function(req, res){
		},

	/* renders the search view for a given query
	*  params:
	*/
	searchView :
		function(req, res){
		},


	/* renders the feed view for most recent activity */
	/* TODO this is bad, currently pullng everything and then sorting */
	feedView :
		function(req, res){
			var session = loginStatus(req);
			if(!session.logged_in) {
				res.redirect("/");
			} else {
				Idea.find({}, function(err, ideas){
					if(err){
						internalServerError(res, err);
					} else{
						var activity = ideas;
						activity.slice(0, 20);
						var session = loginStatus(req);
						res.render('feed.ejs', {
							activity: activity,
							session: session
						});
					}
				});
			}
		},


	/* renders the profile for a :username passed as a param */
	profileView : 
		function(req, res){
		}

};
