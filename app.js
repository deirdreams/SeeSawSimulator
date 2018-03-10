const	app			= require('express'),
		server		= require('http').Server(app),
		io 			= require('socket.io')(server);

var		lobbies		= [],
		numPlayers	= 0;

server.listen(80);

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
	//send event to everyone
  // socket.emit('news', { hello: 'world' });

  //same event name as client
  socket.on('jump', function (data) {
  	//send to all clients (including sender) - user broadcast.emit to exclude sender
  	socket.emit('jumpEvent', "Player jumped")
    console.log(data);
  });

  socket.on('disconnect', function () {
    io.emit('user disconnected');
  });
});


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