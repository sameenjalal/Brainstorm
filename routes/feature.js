var Feature = require("../models/featureModel.js"),
	mongoose = require('mongoose'),
	ObjectId = mongoose.Types.ObjectId;

module.exports = {

	/* creates and stores Idea thru post
	* post params:
	* name
	* desc
	* creator_id
	*/
	create :
		function(new_feat, cb) {
			var response;
			User.findOne({_id: new_feat.creator_id}, function(err, doc) {
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
					var newFeature = new Feature({
						name: new_feat.name,
						desc: new_feat.desc,
						creator: {
							type: new ObjectId(new_feat.creator_id),
							ref: doc
						},
						choices: [],
						decided_choice: null,
						timestamp: Date.now()
					});
					response = {
						status: 'Success',
						data: "Successfully added feature: " + new_feat.name
					};
					newFeature.save(function(err) {
						if( err ) {
							response = {
								status: 'Error',
								data: err
							};
						}
					});
				}
			});
			cb(response)
		},
	
	
	read 
		function(query, type, fields, options, cb){
			var response;
			if(type=="one") {
				Feature.findOne(query, fields, options, function(err, doc) {
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
				Feature.findById(query._id, function(err, doc) {
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
				Feature.find(query, fields, options, function(err, docs) {
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
			// TODO: How does updating the version of the idea this blongs to work?
			Feature.update(conditions, update, options, function(err, numAffected) {
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


	/* creates and stores Idea thru post
	* post params:
	* feature_id
	*/
	destroy :
		function(del_feat, cb){
			var response;
			Feature.findOne({_id: del_feat.feature_id}, function(err, doc) {
				if(err) {
					response = {
						status: "Error",
						data: err
					};
				} else if(doc === null) {
					response = {
						status: "Failure",
						data: "No feature with that id could be found: " + del_feat.feature_id
					};
				} else {
					doc.remove();
					// TODO: Does this delete all references of choices it has?
					response = {
						status: "Success",
						data: "Feature successfully removed"
					};
				}
			});
			cb(response);
		}
};
