var Idea = require("../models/ideaModel.js"),
	User = require("../models/userModel.js"),
	mongoose = require('mongoose'),
	ObjectId = mongoose.Types.ObjectId,
	user_crud = mongoose.require('./user.js');


module.exports = {
	/* <- new_idea = {
	 *      name : STRING, name of idea
	 *      desc : STRING, description of idea
	 *      tags : [STRING], tags of idea
	 *      parent_id : NUMBER, the id of the feature this idea comes from
	 *      creator_id : NUMBER, user id of in session creator
	 *      owners : [STRING]/[NUMBER], names or user IDs of users who will be owners
	 *    }
	 * -> cb(
	 *      e : ERROR, error from mongo
	 *      doc : IDEA, the created idea
	 *    )
	 */
	create :
		function(new_idea, cb){
			user_crud.read(new_idea.creator_id, function(err, doc){
				
		},


	/* <- who = NUMBER, mongoID of document
	 * OR who = {
	 * 	    query : OBJECT_LITERAL, the query object passed to mongoose
	 * 	    fields : OBJECT_LITERAL, the fields object passed to mongoose
	 * 	    options : OBJECT_LITERAL, the optins object passed to mongoose
	 * 	  }
	 * <- uid = NUMBER, the user id of the privilaged user
	 * -> cb(
	 *      e : ERROR, error from mongo
	 *      doc : IDEA, the read idea (sometimes in array form for multi)
	 *    )
	 */
	read :
		function(who, uid, cb){
		},
	
	
	/* <- who = NUMBER, mongoID of document
	 * OR who = {
	 * 	    query : OBJECT_LITERAL, the query object passed to mongoose
	 * 	    fields : OBJECT_LITERAL, the fields object passed to mongoose
	 * 	    options : OBJECT_LITERAL, the optins object passed to mongoose
	 * 	  }
	 * <- updates = OBJECT_LITERAL, an object containing the updated fields of the the document
	 * <- uid = NUMBER, the user id of the privilaged user
	 * -> cb(
	 *      e : ERROR, error from mongo
	 *      doc : IDEA, the updated idea
	 *    )
	 */
	update :
		function(who, updates, uid, cb){
		},


	/* <- who = NUMBER, mongoID of document
	 * OR who = {
	 * 	    query : OBJECT_LITERAL, the query object passed to mongoose
	 * 	    fields : OBJECT_LITERAL, the fields object passed to mongoose
	 * 	    options : OBJECT_LITERAL, the optins object passed to mongoose
	 * 	  }
	 * <- uid = NUMBER, the user id of the privilaged user
	 * -> cb(
	 *      e : ERROR, error from mongo
	 *    )
	 */
	destroy :
		function(who, uid, cb){
		}
};
