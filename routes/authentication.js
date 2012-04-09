var User = require('../models/userModel.js'),
	user_crud = require('./user.js'),
	mongoose = require('mongoose'),
	http = require('http'),
	bcrypt = require('bcrypt');

module.exports = {
	login:
		function(req, res) {
			var usrname = req.body.username;
			User.findOne({ "username": usrname}, function (err, doc) {
				if(err) {
					res.redirect('/');
				} else {
					if(doc !== null) {
						bcrypt.compare(req.body.password, doc.password, function(err, match) {
							if(err || match === false) {
								res.redirect('/');
							} else {
								req.session.user = {
									id: doc._id,
									name: doc.username
								};
								res.redirect('/feed');
							}
						});
					} else {
						res.redirect('/');
					}
				}
			});
		},

	logout:
		function(req, res) {
			if(req.session) {
				req.session.destroy(function() {});
			}
			res.redirect('/');
		},

	register:
		function(req, res) {
			user_crud.create(req.body, function(response) {
				if(response.status === "Success") {
					req.session.user = {
						id: response.data._id,
						name: response.data.name
					};
					res.redirect('/feed');
				} else {
					res.redirect('/');
				}
			});
		}
};
