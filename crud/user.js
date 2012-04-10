var User = require('../models/userModel.js'),
	bcrypt = require('bcrypt'),
	mongoose = require('mongoose'),
	ObjectId = mongoose.Types.ObjectId;

module.exports = {
	/* PARAMS
		@POST PARAMS
	*/
	
	create :
		function(new_user, cb){
			var response;
			User.findOne({username: new_user.username}, function(err, doc) {
				if(err) {
					response = {
						status: 'Error',
						data: err
					};
				} else {
					if(doc === null) {
						var salt = bcrypt.genSaltSync(10);
						var newUser = new User({
							'username': new_user.username,
							'password': bcrypt.hashSync(new_user.password, salt),
							'pic': new_user.pic,
							'info': new_user.info,
							'timestamp': Date.now()
						});
						response = {
							status: 'Success',
							data: {
								_id: newUser._id,
								name: newUser.username
							}
						};
						newUser.save(function(err) {
							if(err) {
								response = {
									status: 'Error',
									data: err
								};
							}
						});
					} else {
						response = {
							status: 'Failure',
							data: 'A user with this username already exists'
						};
					}
				}
				cb(response);
			});
		},
	
	
	read :
		function(query, type, fields, options, cb){
			var response;
			if(type=="one") {
				User.findOne(query, fields, options, function(err, doc) {
					if(err) {
						response = {
							status: "Error",
							data: err
						};
					} else {
						response = {
							status: "Success",
							data: doc
						};
					}
				});
			} else if(type=="id") {
				User.findById(query._id, function(err, doc) {
					if(err) {
						response = {
							status: "Error",
							data: err
						};
					} else {
						response = {
							status: "Success",
							data: doc
						};
					}
				});
			} else {
				User.find(query, fields, options, function(err, docs) {
					if(err) {
						response = {
							status: "Error",
							data: err
						};
					} else {
						response = {
							status: "Success",
							data: docs
						};
					}
				});
			}
			cb(response);
		},
	
	
	update :
		function(conditions, update, cb, options){
			var response;
			User.update(conditions, update, options, function(err, numAffected) {
				if(err) {
					response = {
						status: "Error",
						data: err
					};
				} else {
					response = {
						status: "Success",
						data: numAffected
					};
				}
			});
			cb(response);
		},


	destroy :
		function(deleted_user, cb){
			var response;
			User.findOne({username: deleted_user.username}, function(err, doc) {
				if(err) {
					response = {
						status: "Error",
						data: err
					};
				} else if(!doc) {
					response = {
						status: "Failure",
						data: "No user with that username could be found"
					};
				} else {
					doc.remove();
					response = {
						status: "Success",
						data: "User successfully removed"
					};
				}
			});
			cb(response);
		}
};