var express = require('express');
var path = require('path');
var uuidv4 = require("uuid/v4");

var bodyParser = require('body-parser');

var dataTaskLayer = require('./repo/dataTaskLayer.js');
var dataUserLayer = require('./repo/dataUserLayer.js');

var app = express();
var port = process.env.PORT || 8095;
var cors = require('cors');

const allowedOrigins = [
  'capacitor://localhost',
  'ionic://localhost',
  'http://localhost',
  'http://localhost:' + port,
  'http://localhost:8100'
];
// Reflect the origin if it's in the allowed list or not defined (cURL, Postman, etc.)
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Origin not allowed by CORS'));
    }
  }
}

// Enable preflight requests for all routes
app.options('*', cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());


//Add headers for Ionic
/*app.use(function(req, res, next){
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8100');

    //Request methods you wish to allow
    res.setHeader("Access-Control-Allow-Methods", "POST");

    //Request headers you wish to allow
    res.setHeader("Access-Control-Allow-Headers", "X-requested-with,content-type");

    next();
});
*/
app.post('/addList', function(req, res) {
	if(!req.body.name || ! req.body.username) {
		res.send({success:false, error: "Champ non rempli ou pb variable globale"});
	}
	else {
		var list = {
			id:uuidv4(),
			name:req.body.name,
			username:req.body.username,
			task:[]
		};
		//console.log(list);
		dataTaskLayer.addList(list, function(success) {
			//console.log(success);
			res.send({success:success});
		});
	}
});


app.post('/deleteList', function(req, res) {
	if(!req.body.id)
		res.send({success:false, error:"Liste manquante"});
	else {
			dataTaskLayer.deleteListById(req.body.id, function(success) {
				res.send({success:success});
			});
	}
});


app.post('/addTask', function(req, res){
	if(!req.body.text || !req.body.listid)
	{
		res.send({success:false, error: "Tache manquante"});
	}
	else
	{
		//console.log(task);
		dataTaskLayer.addTask(req.body.listid, req.body.text, function(success)
		{
			//console.log(success);
			res.send({success: success});
		});
	}		
});



app.post('/deleteTask', function(req, res){
	//console.log(req.body.id);
	//console.log("fff")
	if(!req.body.listid || !req.body.taskid){
		//console.log(req);
		res.send({success:false, error: "ID inexistant"});
	}
	else{
		dataTaskLayer.deleteTaskById(req.body.listid, req.body.taskid, function(success){
			res.send({success: success});
		});
	}
});

app.post('/getAll', function(req, res){
	if(!req.body.username){
		res.send({success:false, error:"username non renseigné"});
	}
	else{
		dataTaskLayer.getAll(req.body.username, function(success) {
		res.send({success: success});
		});
	}
});


app.post('/updateTaskText', function(req, res) {
	if(!req.body.listid || !req.body.taskid || !req.body.text) {
		res.send({success: false, error: "param manquant"});
	}
	else {
		dataTaskLayer.updateTaskText(req.body.listid, req.body.taskid, req.body.text, function(success) {
			res.send({success: success});
		});
	}
});

app.post('/updateTaskChecked', function(req, res) {
	//console.log(req.body.checked);
	if(!req.body.listid || !req.body.taskid) {
		res.send({success: false, error: "param manquant ou checked n'est pas un booléen"});
	}
	else {
		dataTaskLayer.updateTaskChecked(req.body.listid, req.body.taskid, req.body.checked, function(success) {
			res.send({success: success});
		});
	}
});

app.post('/addUser', function(req, res) {
	if(!req.body.username || !req.body.password)
		res.send({success:false, error: "Champ non renseigné"});
	else {
		var user = {
			username: req.body.username,
			password: req.body.password
		};
		dataUserLayer.addUser(user, function(success) {
			res.send({success: success});
		});
	}
});

app.post('/findUser', function(req, res) {
	if(!req.body.username || !req.body.password)
		res.send({success:false, error: "Champ non renseigné"});
	else {
		console.log(req.body);
		var user = {
			username : req.body.username,
			password : req.body.password
		}
		dataUserLayer.findUser(user, function(username) {
			res.send({
				success:(username != null),
				username: username
				});
		});
	}
});

app.post('/findUserByUsername', function(req, res) {
	if(!req.body.username || !req.body.password)
		res.send({success:false, error: "Champ non renseigné"});
	else {
		var user = {
			username : req.body.username,
			password : req.body.password
		}
		dataUserLayer.findUserByUsername(user, function(username) {
			//console.log(username);
			res.send({
				success:(username != null),
				username: username
				});
		});
	}
});

console.log("Le serveur est lancé sur le port 8095");
app.listen(port);
