var Feature = require("../models/featureModel.js"),
	mongoose = require('mongoose'),
	ObjectId = mongoose.Types.ObjectId,
	usercrud = require('./user.js'),
	ideacrud = require('./idea.js'),
	commentcurd = require('./comment.js');

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
							var new_feature = new Feature({
								name: new_feat.name,
								desc: new_feat.desc,
								creator: doc._id,
								parent: idea_doc._id,
								timestamp: Date.now()
							});
							new_feature.save(function(err) {
								if( err ) {
									var d = "Fucked up";
									cb(err, d);
								} else {
									cb(err, new_feature);
								}
							});
						}
					});
				}
			});
		},
	
	
	read :
		function(opts, uid, cb){
			if( typeof(opts) === 'object' ) {
				cb(null, "Fuck you");
			} else {
				Feature.findById(opts).populate('parent').run(function(err, idea) {
					var flag = 0;
					if( err || idea === null ) {
						var d = "Something fucked up in read in feature.js";
						cb(err, d);
					} else {
						var owners = idea.owners;
						for( var i = 0 ; i < owners.length ; i++ ) {
							if( uid === owners[i]._id ) {
								flag = 1;
								Feature.findById(opts, function(err, feature) {
									if( err || feature === null ) {
										var d = "Something fucked up in getting feature in read in feature.js";
										cb(err, d);
									} else {
										cb(err, feature);
									}
									break;
								}
							}
						}
						if(flag === 0) {
							cb(null, "Permission Denied!");
						}
					}
				});
			}
		},
	
	
	update :
		function(opts, update_opts, uid, cb){
			if( typeof(opts) === 'object' ) {
				cb(null, "Fuck you");
			} else {
				Feature.findById(opts).populate('parent').run(function(err, idea) {
					var flag = 0;
					if( err || idea === null ) {
						var d = "Something fucked up in update in feature.js";
						cb(err, d);
					} else {
						var owners = idea.owners;
						for( var i = 0 ; i < owners.length ; i++ ) {
							if( uid === owners[i]._id ) {
								flag = 1;
								if(update_opts.idea !== undefined) {
									var new_idea = update_opts.idea;
									delete update_opts.idea;
								}
								Feature.update(opts, update_opts, function(update_err, numAffected){
									if(update_err) {
										var d = "Something went wrong when updating feature";
										cb(update_err, d);
									} else if(new_idea) {
										ideacrud.create(new_idea, function(idea_err, created_idea) {
											if(idea_err) {
												var d = "Something went wrong when trying to create the idea";
												cb(idea_err, d);
											} else {
												Feature.findById(opts, function(feature_err, feature) {
													if(feature_err) {
														var d = "Something went wrong when trying to find the feature";
														cb(feature_err, feature);
													} else {
														feature.choices.push(created_idea._id);
														feature.save(function(save_err) {
															if(save_err) {
																var d = "Something went wrong when trying to save the feature";
																cb(save_err, d);
															} else {
																cb(save_err, feature);
															}
														});
													}
												});
											}
										});
									} else {
										cb(update_err, numAffected);
									}
								});
							}
						}
						if(flag === 0) {
							cb(null, "Permission Denied!");
						}
					}
				});
			}
		},


	destroy :
		function(opts, uid, cb){
			if( typeof(opts) === 'object' ) {
				cb(null, "Fuck you");
			} else {
				Feature.findById(opts).populate('parent').run(function(err, idea) {
					var flag = 0;
					if( err || idea === null ) {
						var d = "Something fucked up in delete in feature.js";
						cb(err, d);
					} else {
						var owners = idea.owners;
						for( var i = 0 ; i < owners.length ; i++ ) {
							if( uid === owners[i]._id ) {
								flag = 1;
								Feature.findById(opts, function(err, feature) {
									if( err || feature === null ) {
										var d = "Something fucked up in getting feature in delete in feature.js";
										cb(err, d);
									} else if(feature.choices.length > 0) {
										var counter = 0;
										var total = feature.choices.length + feature.comments.length;
										var on_deleted = function(err, data) {
											if( err ) {
												var data = "Deleting an idea messed up";
												cb(err, data);
											} else {
												counter++;
												if( counter === total ) {
													feature.remove();
													var d = "Successfully deleted feature and all associated ideas";
													cb(err, d);
												}
											}
										};
										for( var i = 0 ; i < feature.choices.length ; i++ ) {
											var choice_id = feature.choices[i];
											ideacrud.destroy(choice_id, on_deleted);
										}
										for(var j=0; j<feature.comments.length; j++) {
											var comment_id = feature.comments[i];
											commentcrud.destroy(comment_id, on_deleted);
										}
									} else {
										feature.remove();
										var d = "Successfully deleted feature and all associated ideas";
										cb(err, d);
									}
								}
							}
						}
						if(flag === 0) {
							cb(null, "Permission Denied!");
						}
					}
				});
			}
		}
};