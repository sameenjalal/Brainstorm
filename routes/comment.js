var Comment = require("../models/commentModel.js"),
	mongoose = require('mongoose'),
	ObjectId = mongoose.Types.ObjectId;

module.exports = {
	
	/* creates and stores a Comment thru a post
	* post params:
	*  user_id : [userSchema]
	*  idea_id : ObjectId
	*  feature_id : ObjectId
	*  rating : Number
	*  text : String
	*/
	create :
		function(new_comment, cb){
			var response;
			User.findOne({_id: new_comment.user_id}, function(err, doc) {
				if( err ) {
					response = {
						status: 'Error',
						data: err
					};
				} else if( doc === null ) {
					response = {
						status: 'Failure',
						data: err
					};
				} else {
					var ideaId, featureId;
					if( new_comment.idea_id !== null ) {
						ideaId = new ObjectId(new_comment.idea_id);
						featureId = null;
					} else {
						ideaId = null;
						featureId = new ObjectId(new_comment.feature_id);
					}

					var newComment = new Comment({
						user: doc,
						idea_id: ideaId,
						feature_id: featureId,
						rating: new_comment.rating,
						text: new_comment.text,
						timestamp: Date.now()
					});
					response = {
						status: 'Success',
						data: "Successfully added comment!"
					};
					newComment.save(function(err) {
						if( err ) {
							response = {
								status: 'Error',
								data: err
							};
						}
					});
				}
			});
			cb(response);
		},
	
	
	read :
		function(query, type, fields, options, cb){
			var response;
			if( type == "one" ) {
				Comment.findOne(query, fields, options, function(err, doc) {
					if( err ) {
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
			} else if( type == "id" ) {
				Comment.findById(query._id, function(err, doc) {
					if( err ) {
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
				Comment.find(query, fields, options, function(err, docs) {
					if( err ) {
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
			Comment.update(conditions, update, options, function(err, numAffected) {
				if( err ) {
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
		function(del_comment, cb){
			var response;
			Comment.findOne({_id: del_comment._id}, function(err, doc) {
				if( err ) {
					response = {
						status: "Error",
						data: err
					};
				} else if( doc === null ) {
					response = {
						status: "Failure",
						data: "No comment with that id could be found: " + del_comment._id
					};
				} else {
					doc.remove();
					response = {
						status: "Success",
						data: "Comment successfully removed"
					};
				}
			});
			cb(response);
		}
};
