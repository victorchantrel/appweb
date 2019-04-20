var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//for generate GUID
var uuidv4 = require("uuid/v4");

mongoose.connect('mongodb://localhost/todo',{useNewUrlParser: true}, function (err) {
    if(err){
        throw err;
    }else{
        console.log('mongo connected');
    }
});

var UserSchema = Schema(
{
	username: String,
	password: String
});

var modeleUser = mongoose.model('users', UserSchema);

module.exports =
{
	addUser: function(user, callback) 
	{
		var userToAdd = new modeleUser({
			username: user.username,
			password: user.password
		});
		userToAdd.save(function(error) {
			if(error)
				console.log("error aU");
			else {
				if(user==null)
					callback(false);
				else
					callback(true);
			}
		});
	},

	findUser: function(user, callback) 
	{
		//console.log(user);
		modeleUser.findOne(user, function(error, user) {
			//console.log(user);
			if(error)
				console.log("error fU");
			else{
				if(user==null){
					callback(null);
				}
				else{
					callback(user.username);
				}

			}

		});
	},

	findUserByUsername: function(user, callback)
	{
		modeleUser.findOne({'username':user.username}, function(error, user) {
			if(error)
				console.log("error fUBU");
			else {
				//console.log(user.username);
				if(user==null) {
					callback(null);//on a pas trouvé d'utilisateur identique
				}
				else
					callback(user.username);
			}
		})
	},


};