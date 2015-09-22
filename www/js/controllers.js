angular.module('starter.controllers', [])

angular.module('starter.controllers').controller('ChatCtrl', function ($scope, $ionicScrollDelegate, $ionicModal, $timeout, Camera, FakeChat, SocketIO) {
	//var ChatManager = FakeChat;
	var ChatManager = SocketIO;
	$scope.handle = localStorage.handle;
	$scope.avatar = localStorage.avatar || "img/venkman.jpg";
	$scope.posts = ChatManager.posts;
	function addPost(message, img) {
		ChatManager.add({
			message: message ? message : null,
			img: img ? img : null,
			timestamp: new Date().getTime(),
			user: $scope.handle,
			avatar: $scope.avatar
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
		localStorage.handle = $scope.handle = handle;
		localStorage.avatar = $scope.avatar = avatar;
		ChatManager.init(scrollBottom, $scope.handle, avatar);
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
