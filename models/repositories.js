var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

/* 
 * Think about adding these keys:
 *  - hidden
*/
var Repository = new Schema({
    name:       	{ type: String },
    is_public: 		{ type: Boolean },
    owner_username: { type: String },
    owner_email:    { type: String },
    type_node:      { type: String },
    url:        	{ type: String }
});

module.exports = { 
    Repository: mongoose.model('Repository', Repository)
};
