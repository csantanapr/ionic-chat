angular.module('starter.controllers', [])

.controller('ChatCtrl', function ($scope, $ionicModal, $localStorage, $sessionStorage, Camera, FakeChat, SocketIO, randomAvatar, serverHost) {
	//var ChatManager = FakeChat;
	var ChatManager = SocketIO;
	$scope.isWebView = ionic.Platform.isWebView();
  $scope.$storage = $scope.isWebView ? $localStorage : $sessionStorage;
  $scope.posts = ChatManager.posts;
  
	function addPost(message, img) {
		ChatManager.add({
			message: message ? message : null,
			img: img ? img : null,
			timestamp: new Date().getTime(),
      user: $scope.$storage.handle,
      avatar: $scope.$storage.avatar
		});
	}
  
	$scope.add = function (message) {
		addPost(message);
		$scope.message = null; // pretty things up
	};

	$scope.takePicture = function () {
		Camera.takePicture().then(function (photo) {
			addPost(null, photo);
		});
	};

})

.controller('AppCtrl', function($scope, $ionicModal, $localStorage, $sessionStorage, randomAvatar, serverHost, SocketIO) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});
  //var ChatManager = FakeChat;
	var ChatManager = SocketIO;
  
  $scope.isWebView = ionic.Platform.isWebView();
  $scope.$storage = $scope.isWebView ? $localStorage : $sessionStorage;
  //$scope.$storage.avatar = $scope.$storage.avatar ? $scope.$storage.avatar : 'img/venkman.jpg';
  $scope.serverHost = serverHost;

  $scope.save = function () {
    $scope.$storage.avatar = randomAvatar.getnewAvatar();
		//$scope.add("Joined");
    ChatManager.add({
			message: 'Joined',
			img: null,
			timestamp: new Date().getTime(),
      user: $scope.$storage.handle,
      avatar: $scope.$storage.avatar
		});
		$scope.modal.hide();
	}

	$ionicModal.fromTemplateUrl('templates/account.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function (modal) {
		$scope.modal = modal;
		$scope.modal.show();
	});

});
