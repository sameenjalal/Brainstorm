var Idea = require("../models/ideaModel.js"),
	User = require("../models/userModel.js"),
	mongoose = require('mongoose'),
	ObjectId = mongoose.Types.ObjectId,
	user_crud = require('./user.js'),
	feature_crud = require('./feature.js');

/* black demon magic below */
function wrapErrors(){
	var err = new Error('One or more errors thrown by '+throwErrors.caller+": ");
	err.errors = []
	for(var i=0; i<arguments.length; i++){
		if(arguments[i]){
			err.message += '\n\t'+arguments[i].message;
			err.errors.push(arguments[i]);
		}
	}
	return err;
}


module.exports = {
	/* <- new_idea = {
	 *      name : STRING, name of idea
	 *      desc : STRING, description of idea
	 *      tags : [STRING], tags of idea
	 *      parent_id : NUMBER, the id of the feature this idea comes from
	 *      creator_id : NUMBER, user id of in session creator
	 *      owners : [STRING]/[NUMBER], names or user IDs of users who will be owners (if parent is true, this can be null)
	 *      public : BOOLEAN, if the repo is public
	 *		prev_id : NUMBER, ID of the prev idea if idea is forked
	 *    }
	 * -> cb(
	 *      e : ERROR, error from mongo
	 *      doc : IDEA, the created idea
	 *    )
	 */
	create :
		//TODO devon, read this over, make sure it works
		function(new_idea, cb){
			user_crud.read({
				query : query.where('name').in(new_idea.owners)
			}, function(owners_err, found_owners){
				if(!parent_id){
					parent_find_cb(null, null);
				}else{
					feature_crud.read(parent_id, parent_find_cb);
				}
				function parent_find_cb(parent_err, found_parent){
					cb(wrapErrors(owners_err, parent_err), {
						name : new_idea.name,
						desc : new_idea.desc,
						tags : (new_idea.tags ? new_idea.tags : []),
						creator : new_idea.creator_id,
						prev : new_idea.prev_id,
						parent : new_idea.parent_id,
						version : (this.prev ? this.prev.version++ : 0),
						owners : (found_parent ? found_parent.parent.owners : new_idea.owners),
						features : [],
						comments : [],
						public : ((found_parent ? found_parent.parent.public : new_idea.public) ? (found_parent ? found_parent.parent.public : new_idea.public) : null),
						timestamp : new Date()
					});
				}
			});
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
