angular.module('starter.services', []);
angular.module('starter.services').factory('FakeChat', function ($rootScope) {
    var posts = [];
    var cbPostArrived;
    return {
        posts: posts,
        add: function (post) {
                posts.push(post);
                cbPostArrived();
        },
        init: function (cb, handle, avatar) {
            cbPostArrived = cb;
        }
    };
});

angular.module('starter.services').factory('SocketIO', function ($rootScope) {
    var webSocketHost = 'http://ionic.mybluemix.net';
    var socket = io(webSocketHost);

    socket.on('connect', function () {
        console.log('connected');
    });
    var cbPostArrived;
    var posts = [];
    function init(cb, handle, avatar) {
        cbPostArrived = cb;
        socket.emit('add user', {
            username: handle,
            avatar: avatar
        });
    }
    function addLocalPost(post) {
        $rootScope.$apply(function () {
            posts.push(post);
            cbPostArrived();
        });
    }
    socket.on('login', function (data) {
        console.log("SocketIO Chat welcome,", data);
    });
    socket.on('new message', function (data) {
        addLocalPost(data.message)
    });

    return {
        posts: posts,
        add: function (post) {
            posts.push(post);
            cbPostArrived();
            socket.emit('new message', post);
        },
        init: init
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
            targetWidth: 500,
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

