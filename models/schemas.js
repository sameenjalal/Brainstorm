var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var userSchema = new Schema({
	'username': String,
	'password': String,
	'fullname': String,
	'email': String,
	'position': String,
	'pic': String,
	'timestamp': Date
});

var commentSchema = new Schema({
	'user' : [userSchema],
	'idea_id' : ObjectId,
	'feature_id' : ObjectId,
	'rating' : Number,
	'text' : String,
	'timestamp' : Date
});

var ideaSchema = new Schema({
	'name': String,
	'desc': String,
	'tags': [],
	'creator': {type: ObjectId, ref: 'User'},
	'prev': {type: ObjectId, ref: 'Idea'},
	'version': Number,
	'owner': [userSchema],
	'features': [featureSchema],
	'comments': [commentSchema],
	'timestamp': Date,
});

var featureSchema = new Schema({
	'name': String,
	'desc': String,
	'creator': {type: ObjectId, ref: 'User'},
	'choices': [{
		'creator': {type: ObjectId, ref: 'User'},
		'desc': String,
		'timestamp': Date
	}],
	'decided_choice': {
		'creator': {type: ObjectId, ref: 'User'},
		'desc': String,
		'timestamp': Date
	},
	'timestamp': Date,
});

module.exports = {
	user : userSchema,
	idea : ideaSchema,
	feature : featureSchema,
	comment : commentSchema
};
