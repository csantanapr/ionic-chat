angular.module('starter.services', []);

angular.module('starter.services').factory('SocketIO', function ($rootScope, $timeout, $ionicScrollDelegate, serverHost) {
    var webSocketHost = serverHost;
    var socket = io(webSocketHost);
    var cbPostArrived;
    var posts = [];
    
    socket.on('connect', function () {
        console.log('connected');
    });
    
    socket.on('new message', function (data) {
        addLocalPost(data.message)
    });
    
    function addLocalPost(post) {
        $rootScope.$apply(function () {
            posts.push(post);
            scrollBottom();
        });
    }
    
    function scrollBottom() {
		  $timeout(function () { $ionicScrollDelegate.scrollBottom(true); }, 300);
	  }
    
    return {
        posts: posts,
        add: function (post) {
            posts.push(post);
            scrollBottom();
            socket.emit('new message', post);
        }
    };

});

angular.module('starter.services').factory('Camera', function ($ionicActionSheet, $cordovaCamera, $q) {
    function showSheet() {
        var deferred = $q.defer();
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
            cancelText: 'Cancel',
            buttonClicked: function (index) {
                ionic.Platform.isWebView() ? takeRealPicture(index, deferred) : takeFakePicture(deferred);
                return true;
            }
        });
        return deferred.promise;
    }

    function takeRealPicture(cameraIndex, deferred) {
        var options = {
            quality: 30,
            sourceType: cameraIndex === 2 ? 2 : 1,
            cameraDirection: cameraIndex,
            destinationType: Camera.DestinationType.DATA_URL,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 700,
            targetHeight: 600,
            saveToPhotoAlbum: false
        };
        $cordovaCamera.getPicture(options).then(function (imageData) {
            var photo = "data:image/jpeg;base64," + imageData;
            deferred.resolve(photo);
        }, function (err) {
            takeFakePicture(deferred);
        });
    }

    function takeFakePicture(deferred) {
        deferred.resolve("img/bluemix-logo.png");
    }


    return {
        takePicture: showSheet
    }
});

angular.module('starter.services').factory('FakeChat', function ($rootScope, $ionicScrollDelegate) {
    var posts = [];
    return {
        posts: posts,
        add: function (post) {
          posts.push(post);
          $timeout(function () { $ionicScrollDelegate.scrollBottom(true); }, 300);
        }
    };
});

angular.module('starter.services').factory('serverHost', function ($window, AppConfig) {
    var finalHost;
    var appServer = AppConfig.appServer;
    var localhostPort = AppConfig.localhostPort;
    var host = $window.location.hostname;
    var port = $window.location.port;
    var protocol = $window.location.protocol
    
    if(port === localhostPort){
        finalHost = protocol + '//' + host + ':'+port;
    } else if (host.indexOf('mybluemix.net') > 0) {
        finalHost = protocol + '//' + host;
    } else {
        finalHost = appServer;
    }
    
    return finalHost;

});
angular.module('starter.services').factory('randomAvatar', function ($window, AppConfig) {
    var avatars = [
      'img/barrett.jpg',
      'img/bluemix-logo.png',
      'img/slimer.jpg',
      'img/spengler.jpg',
      'img/stantz.jpg',
      'img/tully.jpg',
      'img/venkman.jpg',
      'img/winston.jpg'
    ];
    
    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    function getnewAvatar(){
      var i = getRandomInt(0,avatars.length-1);
      return avatars[i];
    }
    
    return {
      getnewAvatar: getnewAvatar
    };

});

