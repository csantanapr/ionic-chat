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

angular.module('starter.services').factory('WebSocketSvc', function ($q) {
    var posts = [
        {
            message: 'hello',
            img: null,
            timestamp: new Date().getTime(),
            handle: 'carlos'
        }
    ];
    
    var ws = new WebSocket("ws://localhost:6001");
    ws.onopen = function(){  
        console.log("Socket has been opened!");  
    };
    ws.onmessage = function(post){
        posts.push(JSON.parse(post.data));
    }
    return {
        posts: posts,
        add: function(post){
            ws.send(JSON.stringify(post));
        }
    };
});

