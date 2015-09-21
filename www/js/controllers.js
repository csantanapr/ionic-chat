angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope) {

})

.controller('SettingsCtrl', function($scope) {

})

.controller('ChatCtrl', function($scope, $ionicScrollDelegate, $ionicActionSheet, $ionicModal, $cordovaCamera, FakeCamera, $timeout, SocketIO) {
 	//$scope.handle = localStorage.handle || 'Anonymous';
	//$scope.posts = ChatManager.posts;
	//$scope.posts = WebSocketSvc.posts;
	//$scope.posts = SocketIO.posts;
	//WebSocketSvc.init(scrollBottom,$scope.handle );
    //SocketIO.init(scrollBottom,$scope.handle );
	
	function addPost(message, img) {
		//ChatManager.add({
		//WebSocketSvc.add({
		SocketIO.add({
			message: message ? message : null,
			img: img ? img : null,
			timestamp: new Date().getTime(),
			user: $scope.handle
		});
		scrollBottom();
	}
	
	function scrollBottom() {
		$timeout(function() {
          $ionicScrollDelegate.scrollBottom(true);
		  console.log('scrolled to bottom');
       }, 300);
	}
	//$scope.posts.$watch(scrollBottom);
	
	$scope.add = function (message) {
		addPost(message);
		$scope.message = null; // pretty things up
	};
	
	$scope.takePicture = function () {
		$ionicActionSheet.show({
			buttons: [
				{
					text: 'Picture'
				}, {
					text: 'Selfie'
				}, {
					text: 'Photo Library'
				}
			],
			//titleText: 'Take a...',
			cancelText: 'Cancel',
			buttonClicked: function (index) {
				ionic.Platform.isWebView() ? takeARealPicture(index) : takeAFakePicture();
				return true;
			}
		});
	
		function takeARealPicture(cameraIndex) {
			var options = {
				quality: 30,
				sourceType: cameraIndex === 2 ? 2 : 1,
				cameraDirection: cameraIndex,
				destinationType: Camera.DestinationType.DATA_URL,
				encodingType: Camera.EncodingType.JPEG,
				//targetWidth: 500,
				//targetHeight: 600,
				saveToPhotoAlbum: false
			};
			$cordovaCamera.getPicture(options).then(function (imageData) {
				var photo = "data:image/jpeg;base64," + imageData;
				addPost(null, photo);
			}, function (err) {
				// error
				console.error(err);
				takeAFakePicture();
			});
		}
	
		function takeAFakePicture() {
			addPost(null, FakeCamera.getPicture());
		}
	};
	
	$scope.save = function (handle) {
		localStorage.handle = $scope.handle = handle;
		$scope.posts = SocketIO.posts;
        SocketIO.init(scrollBottom,$scope.handle );
		$scope.modal.hide();
	}
	
	$ionicModal.fromTemplateUrl('templates/account.html', {
		scope: $scope,
		animation: 'slide-in-up'
	}).then(function (modal) {
		$scope.modal = modal;
		$scope.modal.show();
	});
	
	$scope.openModal = function () {
		$scope.modal.show();
	};
	
});
