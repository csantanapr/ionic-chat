// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers','starter.services', 'ngCordova.plugins.camera','angularMoment','ngStorage'])
.constant('AppConfig',{
  // change this url to match your bluemix application route that you selected when you deployed the app
  appServer: 'https://ionic.mybluemix.net',
  // Important do not use localhost when using ios or android hybrid app
  //appServer: 'http://10.0.1.17:6001',
  localhostPort: '6001'
})
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})
.filter('timeAgo', function () {
    return function (date) {
        if (!date) return;
        return moment(date, 'x').fromNow();
    }
});


