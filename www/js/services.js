angular.module('starter.services',[]);
angular.module('starter.services').factory('ChatManager', [function () {
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
        add: function(message){
            posts.push(message);
        }
    };
}]);

angular.module('starter.services').factory('FakeCamera', [function () {
    return {
        getPicture: function () {
            return "img/bluemix-logo.png"
        }
    }
}]);

