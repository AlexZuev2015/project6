var app = require('express')(); 
var http = require('http').Server(app);
var io = require('socket.io')(http);
io.set('origins', 'localhost:3000');

app.get('/', function (req, res){
	res.sendFile(__dirname + '/index.html');
});

var users = [];
	
io.on('connection', function (socket) {
	console.log('User connected', socket.id);
	socket.join('vip', function (error) {
		console.log(socket.rooms);

	})
	socket.on('setUserName', function (data) {
		if (users.indexOf(data) > -1) {
			socket.emit('userExists', '<p class="bg-primary">Пользователь' + 
										'<b>' + data + '</b>' + 
										' уже существует, выбери другое имя!</p>');

		} else {
			users.push(data);
			socket.emit('userSet', {username: data});
		}
	});
	socket.on('message', function (data) {
		io.sockets.emit('newMessage', data);
	});

});

var port = 3000;

http.listen(port, function() {
	console.log('On localhost: ' + port);
});