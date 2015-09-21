angular.module('starter.services',[]);
angular.module('starter.services').factory('ChatManager', function () {
    var posts = [
        {
            message: 'hello',
            img: null,
            timestamp: new Date().getTime(),
            handle: 'carlos'
        }
    ];
    return {
        posts: posts,
        add: function(post){
            posts.push(post);
        }
    };
});

angular.module('starter.services').factory('FakeCamera', function () {
    return {
        getPicture: function () {
            return "img/bluemix-logo.png"
        }
    };
});

angular.module('starter.services').factory('WebSocketSvc', function ($rootScope, $window) {
    //var webSocketHost = $window.location.hostname+':6001';
    var webSocketHost = 'ionic.mybluemix.net';
    var webSocketProtocol = 'ws:'
    //var webSocketProtocol = $window.location.protocol === 'http:' ? 'ws:' : 'wss:';
    var cbPostArrived;
    var user;
    var posts = [
        {
            message: 'hello',
            img: null,
            timestamp: new Date().getTime(),
            handle: 'carlos'
        }
    ];
    var ws = new WebSocket(webSocketProtocol+'//'+webSocketHost);
    function init(cb, handle){
        cbPostArrived = cb;
        user= handle;        
    }
    function addLocalPost(post){
        $rootScope.$apply(function() {
            posts.push(post);
            if(cbPostArrived){
                cbPostArrived();
            }
        });
    }
    ws.onopen = function(){  
        console.log("Socket has been opened!");  
    };
    ws.onmessage = function(post){
        var postmessage = JSON.parse(post.data);
        if(postmessage.user !== user){
            addLocalPost(postmessage)
        } 
    }
    return {
        posts: posts,
        add: function(post){
            ws.send(JSON.stringify(post));
            posts.push(post);  
        },
        init: init
    };
});
angular.module('starter.services').factory('SocketIO', function ($rootScope) {
    var webSocketHost = 'ionic.mybluemix.net';
    var socket = io(webSocketHost);

    var cbPostArrived;
    var posts = [];
    function init(cb, handle, avatar){
        cbPostArrived = cb;
        socket.emit('add user', {
            username: handle,
            avatar: avatar
        });     
    }
    function addLocalPost(post){
        $rootScope.$apply(function() {
            posts.push(post);
            if(cbPostArrived){
                cbPostArrived();
            }
        });
    }
    socket.on('login', function (data) {
        console.log("SocketIO Chat welcome,",data);
    });
    socket.on('new message', function (data) {
            addLocalPost(data.message) 
    });
  
    return {
        posts: posts,
        add: function(post){
            posts.push(post);  
            socket.emit('new message', post);
        },
        init: init
    };
  
});

