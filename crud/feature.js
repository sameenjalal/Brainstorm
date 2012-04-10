var Feature = require("../models/featureModel.js"),
	mongoose = require('mongoose'),
	ObjectId = mongoose.Types.ObjectId,
	usercrud = require('./user.js');
	ideacrud = require('./user.js');

module.exports = {

	/* creates and stores Idea thru post
	* post params, new_feat:
	** name
	** desc
	** creator_id
	** idea_id
	** choices
	*/
	create :
		function(new_feat, cb) {
			usercrud.read(new_feat.creator_id, function(err, doc) {
				if( err || doc === null ) {
					var data = "This user cannot be found";
					cb(err, data);
				} else {
					ideacrud.read(new_feat.idea_id, new_feat.creator_id, function(idea_err, idea_doc) {
						if( idea_err || idea_doc === null ) {
							var data = "This user cannot be found";
							cb(idea_err, data);
						} else {
							var counter = 0;
							var new_choices_array = [];
							var new_feature = new Feature({
								name: new_feat.name,
								desc: new_feat.desc,
								creator: doc._id,
								parent: idea_doc._id,
								timestamp: Date.now()
							});

							var on_created_idea = function(err, data) {
								if( err ) {
									var data = "Something fucked up";
									cb(err, data);
								} else {
									counter++;
									new_choices_array.push(data);

									if( counter === new_feat.choices.length ) {
										new_feature.choices = new_choices_array;
										new_feature.save(function(err) {
											if( err ) {
												var d = "Fucked up";
												cb(err, d);
											} else {
												cb(err, new_feature);
											}
										});
									}
								}
							};

							for( var i = 0 ; i < new_feat.choices.length ; i++ ) {
								var choice = new_feat.choices[i];
								var opts = {
									name: choice.name,
									desc: choice.desc,
									creator: doc._id,
									owners: idea_doc.owners,
									parent: new_feature._id
								};
								ideacrud.create(opts, on_created_idea);
							}
						}
					});
				}
			});
		},
	
	
	read 
		function(query, type, fields, options, cb){
			var response;
			if( type == "one" ) {
				Feature.findOne(query, fields, options, function(err, doc) {
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
				Feature.findById(query._id, function(err, doc) {
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
				Feature.find(query, fields, options, function(err, docs) {
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
			// TODO: How does updating the version of the idea this belongs to work?
			Feature.update(conditions, update, options, function(err, numAffected) {
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
		function(del_feat, cb){
			var response;
			Feature.findOne({_id: del_feat._id}, function(err, doc) {
				if( err ) {
					response = {
						status: "Error",
						data: err
					};
				} else if( doc === null ) {
					response = {
						status: "Failure",
						data: "No feature with that id could be found: " + del_feat._id
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
