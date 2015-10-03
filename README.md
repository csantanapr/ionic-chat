## Sample Application for Ionic Chat app using NodeJS Socket IO

## Easy to get started 
- Step 1: click this => [![Deploy to Bluemix](https://bluemix.net/deploy/button.png)](https://bluemix.net/deploy?repository=https://hub.jazz.net/git/csantana/ionic)
- Step 2: There is no step 2, go ahead open your web browser on your new domain name https://ionic-john123.mybluemix.net and start sending messages.

### To work locally with the code download source code
   
    $ git clone https://github.com/csantanapr/ionic-chat
    $ npm install
    
### Run the NodeJS Chat Server locally
	
    $ npm start

## Run simple Websockets demo
    
    $ cd simple_websocket
    $ npm install
    $ npm start
    
## Run simple Socketio demo
    
    $ cd simple_socketio
    $ npm install
    $ npm start
    
### Run using Ionic on Mobile Device or Simulator

- Configure the hostname for WebSocket server for Ionic App to connect. 
  - Edit www/js/app.js, change from http://ionic.mybluemix.net to your local ip or remote host on Bluemix after deploying app.
  
    $ ionic platform add android,ios 
    $ ionic run
    

### Software Requirements:
- Minimum
  - [Bluemix Free Account](https://console.ng.bluemix.net/registration)
  - Mobile or Desktop Browser with WebSockets support (http://caniuse.com/#feat=websockets)	
- To run local Server
  - NodeJS: Install via [nvm](https://github.com/creationix/nvm) or [nodejs.org](https://nodejs.org/en/download)
- To run on Mobile Simulator or Device
  - Install Ionic and Cordova CLI
	  - npm install -g ionic cordova
  - Android 
    - Java SDK (setup PATH, test javac on terminal)
    - Android SDK (setup PATH, test android and adb on terminal)
  - XCode and XCode Commad Tools (test xcode-select -p and xcodebuild)
	
#### License: [Apache 2.0](License.txt)
