//var socket = io('/'+window.location.pathname.split('/')[2]);
//socket.io.uri = '/socket' + window.location.pathname;
console.log('/'+window.location.pathname.split('/')[2]);

var socket = io('/'+window.location.pathname.split('/')[2])
//socket.nsp = window.location.pathname.split('/')[2];

// module aliases
var Engine = Matter.Engine,
		Render = Matter.Render,
		Runner = Matter.Runner,
		Composite = Matter.Composite,
		Composites = Matter.Composites,
		Constraint = Matter.Constraint,
		MouseConstraint = Matter.MouseConstraint,
		Mouse = Matter.Mouse,
		World = Matter.World,
		Bodies = Matter.Bodies,
		Body = Matter.Body,
		Vector = Matter.Vector
		Events = Matter.Events,
		Svg = Matter.Svg,
		Vertices = Matter.Vertices;

var mode = document.cookie.indexOf('free') == -1 ? 'easy' : 'free';

// create an engine
var engine = Engine.create();

// create a renderer
var render = Render.create({
	element: document.body,
	engine: engine,
	options: {
		wireframes: false,
		//background: "url('https://www.planwallpaper.com/static/images/recycled_texture_background_by_sandeep_m-d6aeau9_PZ9chud.jpg')"
	}
});

var mouse = Mouse.create(render.canvas),
mouseConstraint = MouseConstraint.create(engine, {
	mouse: mouse,
	constraint: {
		stiffness: 0.2,
		render: {
			visible: true
		}
	}
});


// create two boxes and a ground
//var player1 = Bodies.rectangle(255, 490, 30, 50, {render: {fillStyle: 'blue'}});
var player2 = Bodies.rectangle(545, 490, 30, 40);
var ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });
var anchor = Bodies.rectangle(400, 600, 800, 50.5, { isStatic: true });



var playerOne = (() => {
	var x = 255;
	var y = 490;

	var parts = [
		Bodies.rectangle(x, y-15, 5, 15,  { isStatic: false, collisionFilter: { group: -1 } }),
		Bodies.rectangle(x, y, 15, 25,  { isStatic: false, collisionFilter: { group: -1 } }), //body
		Bodies.circle(x, y-15, 10,  { isStatic: false, collisionFilter: { group: -1 } }),    //head
		Bodies.rectangle(x, y-15, 5, 15,  { isStatic: false, collisionFilter: { group: -1 } }), //arm
	]
	var constraints = [
		Constraint.create({ bodyA: parts[1], pointA: Vector.create(0, -15), bodyB: parts[2], stiffness: 1, length: 0, render: {visible: false}}),
		Constraint.create({ bodyA: parts[1], pointA: Vector.create(0, -5), bodyB: parts[3], pointB: Vector.create(0, 8), stiffness: 1, length: 0, render: {visible: false}}),
		Constraint.create({ bodyA: parts[1], pointA: Vector.create(0, -5), bodyB: parts[0], pointB: Vector.create(0, 8), stiffness: 1, length: 0, render: {visible: false}}),

	]

	return {
		constraints,
		parts
	}
})();

var playerTwo = (() => {
	var x = 540;
	var y = 460;

	var parts = [
		Bodies.rectangle(x, y-15, 5, 15,  { isStatic: false, collisionFilter: { group: -1 } }),
		Bodies.rectangle(x, y, 15, 30,  { isStatic: false, collisionFilter: { group: -1 } }), //body
		Bodies.circle(x, y-15, 10,  { isStatic: false, collisionFilter: { group: -1 } }),    //head
		Bodies.rectangle(x, y-15, 5, 15,  { isStatic: false, collisionFilter: { group: -1 } }), //arm
	]
	var constraints = [
		Constraint.create({ bodyA: parts[1], pointA: Vector.create(0, -15), bodyB: parts[2], stiffness: 1, length: 0, render: {visible: false}}),
		Constraint.create({ bodyA: parts[1], pointA: Vector.create(0, -5), bodyB: parts[3], pointB: Vector.create(0, 8), stiffness: 1, length: 0, render: {visible: false}}),
		Constraint.create({ bodyA: parts[1], pointA: Vector.create(0, -5), bodyB: parts[0], pointB: Vector.create(0, 8), stiffness: 1, length: 0, render: {visible: false}}),

	]

	return {
		constraints,
		parts
	}
})();



var path = "M0 310L30 310L30 260L40 260L40 310L100 310L100 260L110 260L110 310L530 310L530 260L540 260L540 310L600 310L600 260L610 260L610 310L640 310L640 350L0 350L0 310Z";

//var test = Svg.pathToVertices(document.getElementById('path2'));
//var verts = Matter.Vertices.create(test, Body.create({parent: self}));
//var newSS = Bodies.fromVertices(300, 50, [verts]);

//World.add(engine.world, [newSS]);

if(mode == 'easy'){
	var leftLeft = Bodies.rectangle(240, 484, 5, 80,  { isStatic: false });
	var leftRight = Bodies.rectangle(300, 484, 5, 80,  { isStatic: false });
	var bot = Bodies.rectangle(400, 520, 360, 20,  {isStatic: false, collisionFilter: { group: -1 } });
	var rightLeft = Bodies.rectangle(500, 484, 5, 80,  { isStatic: false });
	var rightRight = Bodies.rectangle(560, 484, 5, 80,  { isStatic: false });
	var rightTop = Bodies.rectangle(530, 444, 65, 5,  { isStatic: false });
	var leftTop = Bodies.rectangle(270, 444, 65, 5,  { isStatic: false });

	var ss = Body.create({
	        parts: [leftLeft, leftRight, rightLeft, rightRight, bot, rightTop, leftTop]
	});

	World.add(engine.world, [Constraint.create({ bodyA: ss, pointA: Vector.create(-150, 0), bodyB: playerOne.parts[1] ,stiffness: 0.1,length: 0, damping: 0.0, render: {visible: false}})])
}
else{
	var leftLeft = Bodies.rectangle(240, 504, 5, 20,  { isStatic: false });
	var leftRight = Bodies.rectangle(300, 504, 5, 20,  { isStatic: false });
	var bot = Bodies.rectangle(400, 520, 360, 20,  {isStatic: false, collisionFilter: { group: -1 } });
	var rightLeft = Bodies.rectangle(500, 504, 5, 20,  { isStatic: false });
	var rightRight = Bodies.rectangle(560, 504, 5, 20,  { isStatic: false });

	var ss = Body.create({
	        parts: [leftLeft, leftRight, rightLeft, rightRight, bot,]
	});
}

var triangle = Bodies.polygon(400, 550, 3, 28,  { isStatic: false, collisionFilter: { group: -1 }  })


// add all of the bodies to the world
World.add(engine.world, [ss,
	anchor,
	triangle, 
	//player2, 
	ground, 
	Constraint.create({ bodyA: ss, pointB: Vector.clone(ss.position),stiffness: 1, damping: 0.2,length: 0}),
	]);


World.add(engine.world, playerOne.parts);

World.add(engine.world, playerOne.constraints);


// run the engine
//Engine.run(engine);
var runner = Runner.create();
Runner.start(runner, engine);

// run the renderer
Render.run(render);

const jump = (player) => {
	player = player.parts[1]
	Body.applyForce(player, Vector.create(player.position.x, 560), Vector.create(0, -0.02))
	//Body.applyForce(ss, Vector.clone(player.position), Vector.create(0, -0.1))
}

var connId = 1;

socket.on('pushConnectionId', (data) => {
	connId = data.id;
})

var lastJumpId = 0;

socket.on('jump', (data) => {
	if(data.playerId == 1) {
		jump(playerOne);
	}
	else {
		console.log(data)
		if(data.jumpId == lastJumpId+1){
			jump(playerTwo, data.dir);
			lastJumpId = data.jumpId;
		}
	}
})

var lastMoveId = 0;

socket.on('move', (data) => {
	if(data.playerId == 1) {
		move(playerOne, data.dir);
	}
	else {
		if(data.moveId == lastMoveId+1){
			console.log("move2")
			move(playerTwo, data.dir);
			lastMoveId = data.moveId;
		}
	}
})

var playerTwoAdded = false;

socket.on('connected', (data) => {
	console.log(data)
	if(data.id > 1 && !playerTwoAdded){
		// create an engine
		//Runner.stop(runner);

		World.add(engine.world, playerTwo.constraints);
		World.add(engine.world, playerTwo.parts);
		//World.add(engine.world, [Bodies.rectangle(540, 400, 15, 30,  { isStatic: false, collisionFilter: { group: -1 } })]);
		//Engine.clear(engine);
		setTimeout(() =>{
			if(mode == 'easy'){
				World.add(engine.world, [Constraint.create({ bodyA: ss, pointA: Vector.create(150, -20), bodyB: playerTwo.parts[1] ,stiffness: 0.1,length: 0, damping: 1, render: {visible: false}})]);
			}
		}, 400)
		setTimeout(() =>{
			//engine = Engine.create();
			//Runner.start(runner, engine);
		}, 800)
		playerTwoAdded = true;
	}
})

const move = (player, dir) => {
	player = player.parts[1]
	Body.applyForce(player, Vector.clone(player.position), Vector.create(-dir*0.005, 0))
}

$('body').keypress((e) => {
	if(e.keyCode == 32 || e.keyCode == 119){
		if(playerOne.parts[1].position.y > 0 && connId == 1){
			jump(playerOne)
			socket.emit('jump', { playerId: 1 });
		}

		else if(playerTwo.parts[1].position.y > 0 && connId == 2){
			jump(playerTwo)
			socket.emit('jump', { playerId: 2 });
		}
	}
	if(e.keyCode == 100){
		console.log("move")
		if(connId == 1){
			move(playerOne, -1)
			socket.emit('move', { playerId: 1, dir: -1 });
		}
		else{
			move(playerTwo, -1)
			socket.emit('move', { playerId: 2, dir: -1 });
		}
	}
	if(e.keyCode == 97){
		if(connId == 1){
			move(playerOne, 1)
			socket.emit('move', { playerId: 1, dir: 1 });
		}
		else{
			move(playerTwo, 1)
			socket.emit('move', { playerId: 2, dir: 1 });
		}
	}
});

var closestToGround;
var successfull = 0;
var dead = false;

setInterval(() =>{
	document.getElementById('score').innerText = successfull;
	if(!closestToGround && !dead){
		if(playerOne.parts[1].position.y > 505){
			closestToGround = playerOne.parts[1];
		}
		else if(playerTwo.parts[1].position.y > 505){
			closestToGround = playerTwo.parts[1];
		}
	}
	if(closestToGround){
	   if(closestToGround.id != playerOne.parts[1].id && playerOne.parts[1].position.y > 505){
			closestToGround = playerOne.parts[1];
			successfull++;
		}
		if(closestToGround.id != playerTwo.parts[1].id && playerTwo.parts[1].position.y > 505){
			closestToGround = playerTwo.parts[1];
			successfull++;
		} 
	}

	if(playerOne.parts[1].position.y > 545 || playerTwo.parts[1].position.y > 545){
		dead = true;
		closestToGround = undefined;
	}
}, 100)

