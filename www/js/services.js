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
    
    //var webSocketHost = $window.location.host;
    var webSocketHost = 'ionic.mybluemix.net';
    var webSocketProtocol = $window.location.protocol === 'http' ? 'ws:' : 'wss:';
    
    var posts = [
        {
            message: 'hello',
            img: null,
            timestamp: new Date().getTime(),
            handle: 'carlos'
        }
    ];
    
    var ws = new WebSocket(webSocketProtocol+'//'+webSocketHost);
    ws.onopen = function(){  
        console.log("Socket has been opened!");  
    };
    ws.onmessage = function(post){
        $rootScope.$apply(function() {
            posts.push(JSON.parse(post.data));
        });
        
    }
    return {
        posts: posts,
        add: function(post){
            ws.send(JSON.stringify(post));
        }
    };
});

