angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope) {

})

.controller('SettingsCtrl', function($scope) {

})

.controller('ChatCtrl', function($scope, $ionicScrollDelegate, $ionicModal, $timeout, Camera, SocketIO) {
 	$scope.handle = localStorage.handle;
	$scope.avatar = localStorage.avatar || "img/venkman.jpg";
	$scope.posts = SocketIO.posts;
	function addPost(message, img) {
		//ChatManager.add({
		SocketIO.add({
			message: message ? message : null,
			img: img ? img : null,
			timestamp: new Date().getTime(),
			user: $scope.handle,
			avatar: $scope.avatar
		});
		//scrollBottom();
	}
	
	function scrollBottom() {
		$timeout(function() {
          $ionicScrollDelegate.scrollBottom(true);
		  console.log('scrolled to bottom');
       }, 300);
	}
	
	$scope.add = function (message) {
		addPost(message);
		$scope.message = null; // pretty things up
	};
	
	$scope.takePicture = function () {
		Camera.takePicture().then(function(photo){
			addPost(null, photo);
		});
	};
	
	$scope.save = function (handle,avatar) {
		localStorage.handle = $scope.handle = handle;
		localStorage.avatar = $scope.avatar = avatar;
        SocketIO.init(scrollBottom,$scope.handle, avatar);
		$scope.add("hello");
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
