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
var TaskListSchema = Schema ({
	_id: String,
	name: String,
	username:String,
	task :[{
		_id: String,
		text: String,
		checked: Boolean
	}]
});

/*var TaskSchema = Schema(
{
	_id: String,
	text: String,
	checked: Boolean
});*/


var modeleTask = mongoose.model('TaskList', TaskListSchema);

module.exports = 
{
	addList: function(list, callback)
	{
		var listToAdd = new modeleTask ({
			_id: list.id,
			name: list.name,
			username: list.username,
			task :[]
		});
		listToAdd.save(function(error) {
			if(error)
				callback(false);
			else
				callback(true);
		});
	},
/*
	findListById: function(id, callback)
	{
		modeleTask.findById(id, function(error, list) {
			if(error)
				console.log('error');
			else {
				if(list != null)
					callback(true);
			}
		});
	},

*/
	deleteListById: function(id, callback)
	{
		modeleTask.findByIdAndDelete(id, function(error, list) {
			if(error)
				console.log('error');
			else{
				if(list != null)
					callback(true);
			}
		});
	},

	addTask: function(listid, text, callback)
	{
		//console.log(listid);
		var task = {
			_id:uuidv4(),
			text:text,
			checked:false
		};
		modeleTask.findByIdAndUpdate(listid, {$push:{task:task}}, function(error, task){
			if(error){
				callback(false);
			}
			else{
				callback(true);
			}
		});
	},

	findTaskById: function(id, callback)
	{
		modeleTask.findById(id, function(error, task){
			if(error)
				console.log('error');
			else{
				if(task != null)
					callback(true);
			}
		});
	},

	deleteTaskById: function(listid, taskid, callback)
	{
		//modeleTask.findOneAndUpdate({_id:listid, 'task._id':taskid}, function(error, task)
		modeleTask.findOneAndUpdate({_id:listid}, {$pull: {task: {_id:taskid} } }, function(error, task) {
			if(error)
				console.log('error test');
			else{
				if(task != null)
					callback(true);
			}
		});
	},

	updateTaskText: function(listid, taskid, text, callback)
	{
		modeleTask.findOneAndUpdate({_id:listid, 'task._id':taskid},{$set:{'task.$.text':text}}, function(error,task) {
			if(error)
				console.log('error');
			else
				callback(true);
		})
	},

	updateTaskChecked: function(listid, taskid, checked, callback)
	{
		modeleTask.findOneAndUpdate({_id:listid, 'task._id':taskid},{$set:{'task.$.checked':checked}}, function(error,task) {
			if(error)
				console.log('error');
			else
				callback(true);
		})
	},

	getAll: function(username, callback)
	{
		modeleTask.find({username:username},function(error, lists){
			if(error)
				console.log('error load');
			else
				callback(lists);
		});
	}
}