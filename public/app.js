//var socket = io('/socket' + window.location.pathname);
//socket.io.uri = '/socket' + window.location.pathname;
console.log(window.location.pathname);

var socket = io('http://localhost:8888', {path: '/socket' + window.location.pathname})
socket.nsp = '/socket' + window.location.pathname;

// module aliases
var Engine = Matter.Engine,
        Render = Matter.Render,
        Runner = Matter.Runner,
        Composites = Matter.Composites,
        Constraint = Matter.Constraint,
        MouseConstraint = Matter.MouseConstraint,
        Mouse = Matter.Mouse,
        World = Matter.World,
        Bodies = Matter.Bodies,
        Body = Matter.Body,
        Vector = Matter.Vector
        Events = Matter.Events;

// create an engine
var engine = Engine.create();

// create a renderer
var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
    	wireframes: false,
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
        Bodies.rectangle(x, y, 15, 25,  { isStatic: false, collisionFilter: { group: -1 } }), //body
        Bodies.circle(x, y-15, 10,  { isStatic: false, collisionFilter: { group: -1 } }),    //head
        Bodies.rectangle(x, y-15, 5, 15,  { isStatic: false, collisionFilter: { group: -1 } }), //arm
        //Bodies.rectangle(x, y+15, 5, 15,  { isStatic: false, collisionFilter: { group: -1 } }), //leg
    ]
    var constraints = [
        Constraint.create({ bodyA: parts[0], pointA: Vector.create(0, -15), bodyB: parts[1], stiffness: 1, length: 0, render: {visible: false}}),
        Constraint.create({ bodyA: parts[0], pointA: Vector.create(0, -5), bodyB: parts[2], pointB: Vector.create(0, 8), stiffness: 1, length: 0, render: {visible: false}}),
        //Constraint.create({ bodyA: parts[0], pointA: Vector.create(0, 15), bodyB: parts[3], pointB: Vector.create(0, 5), stiffness: 1, length: 0, render: {visible: true}}),

    ]

    return {
        constraints,
        parts
    }
})();

var playerTwo = (() => {
    var x = 545;
    var y = 490;

    var parts = [
        Bodies.rectangle(x, y, 15, 30,  { isStatic: false, collisionFilter: { group: -1 } }), //body
        Bodies.circle(x, y-15, 10,  { isStatic: false, collisionFilter: { group: -1 } }),    //head
        Bodies.rectangle(x, y-15, 5, 15,  { isStatic: false, collisionFilter: { group: -1 } }), //arm
        //Bodies.rectangle(x, y+15, 5, 15,  { isStatic: false, collisionFilter: { group: -1 } }), //leg
    ]
    var constraints = [
        Constraint.create({ bodyA: parts[0], pointA: Vector.create(0, -15), bodyB: parts[1], stiffness: 1, length: 0, render: {visible: false}}),
        Constraint.create({ bodyA: parts[0], pointA: Vector.create(0, -5), bodyB: parts[2], pointB: Vector.create(0, 8), stiffness: 1, length: 0, render: {visible: false}}),
        //Constraint.create({ bodyA: parts[0], pointA: Vector.create(0, 15), bodyB: parts[3], pointB: Vector.create(0, 5), stiffness: 1, length: 0, render: {visible: true}}),

    ]

    return {
        constraints,
        parts
    }
})();


var ss = Bodies.rectangle(400, 520, 360, 20);


// add all of the bodies to the world
World.add(engine.world, [ss,
	anchor,
	//player1, 
	//player2, 
	ground, 
	Constraint.create({ bodyA: ss, pointB: Vector.clone(ss.position),stiffness: 1, damping: 0.2,length: 0}),
	Constraint.create({ bodyA: ss, pointA: Vector.create(-150, 0), bodyB: playerOne.parts[0] ,stiffness: 0.1,length: 0, damping: 0.0, render: {visible: false}}),
	Constraint.create({ bodyA: ss, pointA: Vector.create(150, 0), bodyB: playerTwo.parts[0] ,stiffness: 0.1,length: 0, damping: 0.0, render: {visible: false}})
	]);


World.add(engine.world, playerOne.parts);

World.add(engine.world, playerOne.constraints);

World.add(engine.world, playerTwo.parts);

World.add(engine.world, playerTwo.constraints);

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);

const jump = (player) => {
    player = player.parts[0]
	console.log(player.position.y)
	Body.applyForce(player, Vector.clone(player.position), Vector.create(0, -0.01))
	Body.applyForce(ss, Vector.clone(player.position), Vector.create(0, -0.1))
}

var connId = -1;

socket.on('pushConnectionId', (data) => {
    if(connId == -1){
        connId = data.id;
    }
})

socket.on('jump', (data) => {
    console.log('boink received');
    console.log(data)
    if(data.playerId == 1) {
        jump(playerOne);
    }
    else {
        jump(playerTwo);
    }
})


$('body').keypress((e) => {
	if(e.keyCode == 32){
        if(playerOne.parts[0].position.y > 505){
            jump(playerOne)
            socket.emit('jump', { playerId: 1 });
        }

	}
    else{
        if(playerTwo.parts[0].position.y > 505){
            jump(playerTwo)
            socket.emit('jump', { playerId: 2 });
        }
    }
});