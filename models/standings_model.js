var mongoose = require('mongoose');

var standingsSchema = new mongoose.Schema (
	{user_name:{type:String, required:true},
	 total_wins:{type:Number, min:0, max:99},
	 total_looses:{type:Number, min:0, max:99},
	 win_rate:{type:Number, min:0, max:100},
	});

mongoose.model('standing', standingsSchema);