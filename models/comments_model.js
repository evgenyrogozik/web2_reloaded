var mongoose = require('mongoose');

var commentSchema = new mongoose.Schema (
	{user_name:{type:String, required:true},
	 message:{type:String, required:true},
	 date_created:{type:[Date], required: true, 'default':1},
	 like:{type:Number, min:0, max:99}
	});

mongoose.model('Comment', commentSchema);