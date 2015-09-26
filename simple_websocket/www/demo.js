var socket = new WebSocket('ws://localhost:8080');
socket.onopen = function (e) {
		console.log('connection established', e);
};
socket.onmessage = function (e) {
	console.log('New Message From Server Event:', e);
	console.log('receive:',e.data);
};
function sendMessage(message){
	socket.send(message);
	return 'sent '+message;
}