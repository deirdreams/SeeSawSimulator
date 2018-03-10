const	app			= require('express')(),
		express		= require('express'),	
		server		= require('http').Server(app),
		io 			= require('socket.io')(server);

var		lobbies		= new Map(),
		lobbiesFull = false,
		amountCalled = 0,
		activePlayers = {};

server.listen(8888);

app.use('/static', express.static('public'))

app.get('/', function (req, res){
	res.sendfile(__dirname + '/landing.html');
})


app.get('/game/*', function (req, res) {
	registerNamespace(req.originalUrl);
	res.sendfile(__dirname + '/index.html');
});


function registerNamespace(url){
	console.log('registerNamespace ' + sanitiseUrl(url))
	activePlayers[sanitiseUrl(url)] = 0;
	var nsp = io.of(sanitiseUrl(url));
	nsp.on('connection', function (socket) {
		console.log('Connected');
		activePlayers[sanitiseUrl(url)]++;
		console.log(activePlayers[sanitiseUrl(url)]);
		if(activePlayers[sanitiseUrl(url)] > 1){
			socket.emit('pushConnectionId', {id: 2})
		}
		socket.on('jump', function (data) {
			socket.broadcast.emit('jump', {playerId: data.playerId})
		console.log(data);
		});

		socket.on('disconnect', function () {
			nsp.emit('user disconnected');
			activePlayers[sanitiseUrl(url)]--;
		});

	});
}

function sanitiseUrl(url) {
	let newUrl = url.split('/');
	return newUrl[2];
}
