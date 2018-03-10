const	app			= require('express')(),
		express		= require('express'),	
		server		= require('http').Server(app),
		io 			= require('socket.io')(server);

var		lobbies		= new Map(),
		lobbiesFull = false,
		activePlayers = 0;

server.listen(8888);

app.use('/static', express.static('public'))

app.get('/', function (req, res) {
	res.sendfile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
	console.log('Connected');
	socket.emit('startConnection');

	socket.on('joinLobby', (data) => {
		socket.join(data.lobbyID);
		console.log('Lobby ' + data.lobbyID + ' joined!');
	})


	// socket.emit('pushConnectionId', {id: activePlayers})


	//change to handle lobbies
	socket.on('jump', function (data) {
		//send to all clients (including sender) - user broadcast.emit to exclude sender
		socket.broadcast.emit('jumpEvent', {playerId: data.playerId})
	console.log(data);
	});


	socket.on('disconnect', function () {
		io.emit('user disconnected');
		activePlayers--;
	});

});
