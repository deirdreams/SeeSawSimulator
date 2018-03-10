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
	console.log('connection');
	activePlayers++;
	socket.emit('pushConnectionId', {id: activePlayers})
	//send event to everyone
  // socket.emit('news', { hello: 'world' });

  //same event name as client
  socket.on('jump', function (data) {
  	//send to all clients (including sender) - user broadcast.emit to exclude sender
  	socket.broadcast.emit('jumpEvent', {playerId: data.playerId})
    console.log(data);
  });

  socket.on('join', function (data) {
  	console.log("Finding free lobby");
  	joinLobby(findFreeLobby());

	});

  socket.on('create', function (data) {
  	let newGroupId

  });

  socket.on('disconnect', function () {
    io.emit('user disconnected');
    activePlayers--;
  });

});


/* FUNCTIONS */


function findFreeLobby() {
	lobbies.forEach(function(val, key) {
		if (key < 2) {
			lobbiesFull = false;
			return val;
		} else {
			lobbiesFull = true;
			return lobbiesFull;
		}
	});
}

function joinLobby(lobbyId) {
	//lobbies.
}

//Generating 5-digit ids
function makeid() {
	var id = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for (var i = 0; i < 5; i++)
		id += possible.charAt(Math.floor(Math.random() * possible.length));
	
	if (lobbies.includes(id)) {
  		return makeid();
  	} else {
  		return id;
  	}
}