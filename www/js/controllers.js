angular.module('starter.controllers', [])

angular.module('starter.controllers').controller('ChatCtrl', function ($scope, $ionicScrollDelegate, $ionicModal, $timeout, Camera, FakeChat, SocketIO) {
	//var ChatManager = FakeChat;
	var ChatManager = SocketIO;
	$scope.isWebView = ionic.Platform.isWebView();
	$scope.handle = localStorage.getItem('handle') || '@csantanapr';
	$scope.avatar = localStorage.getItem('avatar') || "img/venkman.jpg";
	$scope.posts = ChatManager.posts;
	function addPost(message, img) {
		ChatManager.add({
			message: message ? message : null,
			img: img ? img : null,
			timestamp: new Date().getTime(),
			user: localStorage.getItem('handle'),
			avatar: localStorage.getItem('avatar')
		});
	}
	function scrollBottom() {
		$timeout(function () {
			$ionicScrollDelegate.scrollBottom(true);
		}, 300);
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

	$scope.save = function (handle, avatar) {
		localStorage.setItem('handle',handle);
		localStorage.setItem('avatar',avatar);
		$scope.hanle = handle;
		$scope.avatar = avatar;
		ChatManager.init(scrollBottom);
		$scope.add("Joined");
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
