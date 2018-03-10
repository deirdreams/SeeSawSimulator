var socket = io('http://0c823424.ngrok.io');

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



var player = (() => {
    var playerOneGroup = Body.nextGroup(true);
    console.log(playerOneGroup);
    var x = 255;
    var y = 490;

    var parts = [
        Bodies.rectangle(x, y, 10, 25,  { isStatic: false, collisionFilter: { group: -1 } }), //body
        Bodies.circle(x, y-10, 7,  { isStatic: false, collisionFilter: { group: -1 } }),    //head
        Bodies.rectangle(x, y-5, 5, 15,  { isStatic: false, collisionFilter: { group: -1 } }), //arm
        Bodies.rectangle(x, y+15, 5, 15,  { isStatic: false, collisionFilter: { group: -1 } }), //leg
    ]
    var constraints = [
        Constraint.create({ bodyA: parts[0], bodyB: parts[1], stiffness: 1, length: 0, render: {visible: false}}),
        Constraint.create({ bodyA: parts[0], bodyB: parts[2], stiffness: 1, length: 0, render: {visible: true}}),
        Constraint.create({ bodyA: parts[0], bodyB: parts[3], stiffness: 1, length: 0, render: {visible: true}}),
    ]

    return {
        constraints,
        parts
    }
})();


var ss = Bodies.rectangle(400, 520, 320, 20);


// add all of the bodies to the world
World.add(engine.world, [ss,
	anchor,
	//player1, 
	player2, 
	ground, 
	Constraint.create({ bodyA: ss, pointB: Vector.clone(ss.position),stiffness: 1, damping: 0.2,length: 0}),
	Constraint.create({ pointA: Vector.create(ss.position.x-200, ss.position.y), bodyB: player.parts[0] ,stiffness: 1,length: 0, damping: 0.2, render: {visible: false}}),
	Constraint.create({ pointA: Vector.create(ss.position.x-200, ss.position.y), bodyB: player2 ,stiffness: 1,length: 0, damping: 0.2, render: {visible: false}})
	]);


World.add(engine.world, player.parts);

World.add(engine.world, player.constraints);

// run the engine
Engine.run(engine);

// run the renderer
Render.run(render);

const jump = (player) => {
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

socket.on('jumpEvent', (data) => {
    console.log('boink received');
    console.log(data)
    if(data.playerId == 1) {
        jump(player1);
    }
    else {
        jump(player2);
    }
})



$('body').keypress((e) => {
	if(e.keyCode == 32){
        if(connId == 1){
            if(player1.position.y > 505){
                jump(player1)
                socket.emit('jump', { playerId: 1 });
            }
        }
        else{
            if(player2.position.y > 505){
                jump(player2)
                socket.emit('jump', { playerId: 2 }); 
            }
        }
		
	}
});