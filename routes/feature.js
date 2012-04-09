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
		function(req, cb){
		},
	
	
	update :
		function(req, cb){
		},


	destroy :
		function(req, cb){
		}
};
