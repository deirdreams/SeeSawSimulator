const	app			= require('express'),
		io 			= require('socket.io')(app),
		fs			= require('fs');

app.