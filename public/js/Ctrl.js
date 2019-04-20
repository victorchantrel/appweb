var todoApp = angular.module('todoApp', ['ui.router']);

todoApp.config(function ($stateProvider, $urlRouterProvider) {
	$stateProvider
	.state('login', {
		url: '/login',
		templateUrl:'../login.html'
	})
	.state('signin', {
		url: '/signin',
		templateUrl:'../signin.html'
	})
	.state('task', {
		url: '/task',
		templateUrl:'../task.html'
	})
});

todoApp.controller('myCtrl', function($location) {
	$location.path('/login')
});

todoApp.controller('todoCtrl', ['$scope', '$http', 'todoService', '$location', function($scope, $http, todoService, $location) {
	$scope.tab = [];
	var task = new Object();
	task.checked = false;
	//task.surligned = false;
	task.text = $scope.textTask;

	$scope.addList = function()
	{	var userconnected = todoService.getUserConnected();
		//console.log(userconnected);
		var list = {
			name:$scope.nameList,
			username: userconnected
		};
		console.log(list);
		todoService.addList(list, function(res) {
			if(res) {
				console.log("liste ajoutée");
				$scope.load();
			}
		});
	};

	$scope.deleteList = function()
	{
		var id = $scope.tab[$index]._id;
		todoService.deleteList(id, function(res) {
			if(res)
				console.log("liste supprimée");
				$scope.load();
		});
	}

	$scope.addTask = function($index, text)
	{
		var list = $scope.tab[$index];
		var text = text;
		//$scope.task = "";
		//console.log(text);

		todoService.addTask(list, text, function(res){
            if(res){
                //console.log(res);
                console.log("tâche ajoutée");
                $scope.load();
            }
        });
	};

	/*
	$scope.surligner = function($index)
	{
		for(var i = 0; i<$scope.tab.length; i++)
		{
			$scope.tab[i].surligned = false;
		}
		$scope.tab[$index].surligned = true;
		$scope.updateTask($scope.tab[$index]);
	};
	*/
	$scope.deleteTask = function(list, $index) {
		var list = list;
		//console.log(list);
		
		todoService.deleteTask(list, $index, function(res) {
			if(res){
				console.log("tâche supprimée");
				$scope.load();
			}
		});
	};

	$scope.updateTaskText = function(indexList, indexTask, text) {
		var listid = $scope.tab[indexList]._id;
		var taskid = $scope.tab[indexList].task[indexTask]._id;
		todoService.updateTaskText(listid, taskid, text, function(res) {
			if(res){
				console.log("tâche mise-a-jour");
				$scope.load()
			}
		});
	};

	$scope.updateTaskChecked = function(indexList, indexTask) {
		var listid = $scope.tab[indexList]._id;
		var taskid = $scope.tab[indexList].task[indexTask]._id;
		$scope.tab[indexList].task[indexTask].checked = !$scope.tab[indexList].task[indexTask].checked;
		var checked = $scope.tab[indexList].task[indexTask].checked;
		todoService.updateTaskChecked(listid, taskid, checked, function(res) {
			if(res){
				console.log("tâche mise-a-jour");
				$scope.load();
			}
		});
	};

    $scope.load = function()
    {
    	var userconnected = todoService.getUserConnected();
    	if(userconnected != null){
    		var username = todoService.getUserConnected();
    		todoService.getAll(username, function(res) {
    			$scope.tab = res.data.success;
  				//console.log(res.data.success);
  				//console.log($scope.tab);
  			});
  		}
  		else {
  			$location.path('/login');
  		}
    };

    $scope.load();
    //console.log($scope.tab);
}]);

/*-------------------userController-------------------*/

todoApp.controller('userCtrl',['$scope', '$http', 'todoService', '$location', function($scope, $http, todoService, $location) {

    $scope.login = function() {
    		var user = {
    		username: $scope.username,
    		password: $scope.password
    	};

    	todoService.findUser(user, function(success) {
    		if(success){
    			todoService.setUserConnected(user.username);
    			//console.log(todoService.getUserConnected());
    			console.log("utilisateur trouvé");
    			$location.path('/task');
    		}
    		else{
    			alert("Erreur de connexion")
    		}
    	});
        
    };

    $scope.addUser = function(user) {
    	/*var user = {
    		username: $scope.username,
    		password: $scope.password
    	};*/
    	todoService.addUser(user, function(success) {
    		if(success) {
				console.log("utilisateur ajouté");
				$location.path('/login');
			}
			else {
				console.log("error");
			}
    	});
    };

    $scope.searchForExistingUser = function() {
    	var user = {
    		username: $scope.username,
    		password: $scope.password
    	};
    	todoService.findUserByUsername(user, function(username) {
    		if(username != null) {
    			console.log("utilisateur déjà existant");
    			alert("Nom déjà utilisé, veuillez renseigner un nom différent");
    		}
    		else {
    			$scope.addUser(user);
    		}
       	});
    };

    $scope.goToSignin = function() {
    	$location.path('/signin');
    };

    $scope.goToLogin = function() {
    	todoService.setUserConnected(null);
    	console.log("test");
    	$location.path('/login');
    };

}]);