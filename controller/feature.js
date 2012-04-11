var Feature = require("../models/featureModel.js"),
	mongoose = require('mongoose'),
	ObjectId = mongoose.Types.ObjectId,
	usercrud = require('./user.js'),
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
					if( err || idea === null ) {
						var d = "Something fucked up in update in feature.js";
						cb(err, d);
					} else {
						var owners = idea.owners;
						for( var i = 0 ; i < owners.length ; i++ ) {
							if( uid === owners[i]._id ) {
								Feature.findById(opts, function(err, feature) {
									if( err || feature === null ) {
										var d = "Something fucked up in getting feature in update in feature.js";
										cb(err, d);
									} else {
										// TODO: Finish this stupid part
										feature.remove();
										var d = "Successfully update feature";
										cb(err, d);
									}
								}
							}
						}
						cb(null, "Permission Denied!");
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
									} else {
										feature.remove();
										var d = "Successfully deleted feature";
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
