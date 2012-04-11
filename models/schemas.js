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
	'parent': {type: ObjectId, ref: 'Feature'},
	'version': Number,
	'owners': [userSchema],
	'features': [{type: ObjectId, ref: 'Feature'}],
	'comments': [{type: ObjectId, ref: 'Comment'}],
	'public': Boolean,
	'timestamp': Date,
});

var featureSchema = new Schema({
	'name': String,
	'desc': String,
	'creator': {type: ObjectId, ref: 'User'},
	'parent': {type: ObjectId, ref: 'Idea'},
	'choices': [{type: ObjectId, ref: 'Idea'}],
	'decided_choice': [{type: ObjectId, ref: 'Idea'}],
	'timestamp': Date,
});

module.exports = {
	user : userSchema,
	idea : ideaSchema,
	feature : featureSchema,
	comment : commentSchema
};
