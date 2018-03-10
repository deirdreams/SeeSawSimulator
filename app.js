const	app			= require('express')(),
		express		= require('express'),	
		server		= require('http').Server(app),
		io 			= require('socket.io')(server);

var		lobbies		= new Map(),
		lobbiesFull = false,
		amountCalled = 0,
		activePlayers = 0;

server.listen(8888);

app.use('/static', express.static('public'))

app.get('/', function (req, res){
	res.sendfile(__dirname + '/landing.html');
})


app.get('/game/*', function (req, res) {
	console.log(req.originalUrl);
	res.sendfile(__dirname + '/index.html');
});

app.get('/socket/*', function(req, res){
	console.log("socket connected");
	console.log(sanitiseUrl(req.originalUrl));
	var nsp = io.of(sanitiseUrl(req.originalUrl));
	nsp.on('connection', function (socket) {
		console.log('Connected');
		activePlayers++;
		socket.broadcast.emit('pushConnectionId', {id: activePlayers})

		socket.on('jump', function (data) {
			socket.broadcast.emit('jump', {playerId: data.playerId})
		console.log(data);
		});

		socket.on('disconnect', function () {
			nsp.emit('user disconnected');
			activePlayers--;
		});

	});
})

function sanitiseUrl(url) {
	let newUrl = url.split('/');
	return '/socket/game/' + newUrl[3];
}
