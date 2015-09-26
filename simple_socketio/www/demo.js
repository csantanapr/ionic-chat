socket.on('connect', function (e) {
		console.log('connection established',e);
});
socket.on('new message', function (data) {
        console.log('New Message From Server data:', data);
				console.log('receive:',data.message);
});
function sendMessage(message){
	socket.emit('new message', message);
	return 'sent '+message;
}
console.log('Welcome Developer, run the function sendMessage("marco")');