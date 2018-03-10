const	app			= require('express')(),
		express		= require('express'),	
		server		= require('http').Server(app),
		io 			= require('socket.io')(server);

var		lobbies		= new Map(),
		lobbiesFull = false,
		activePlayers = 0;

server.listen(8888);

app.use('/static', express.static('public'))


app.get('/*', function (req, res) {
	console.log(req.originalUrl);
	res.sendfile(__dirname + '/index.html');
	var nsp = io.of(req.originalUrl);
	nsp.on('connection', function (socket) {
		console.log('Connected');
		socket.emit('startConnection');
		activePlayers++;
		socket.emit('pushConnectionId', {id: activePlayers})

		socket.on('jump', function (data) {
			socket.broadcast.emit('jump', {playerId: data.playerId})
		console.log(data);
		});

		socket.on('disconnect', function () {
			nsp.emit('user disconnected');
			activePlayers--;
		});

	});
});
