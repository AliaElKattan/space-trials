
//add theme colors here
var Colors = {
	red:0xf25346,
	white:0xd8d0d1,
	brown:0x59332e,
	pink:0xF5986E,
	brownDark:0x23190f,
	blue:0x121d80,
	yellow: 0xffff00,
};

let touch = 0;
let start = 0;
let level = 1;

//functions to run on load
window.addEventListener('load', init, false);

function init(event) {

//scene, camera, renderer
createScene();

//lights
createLights();

//objects
createPlane();

createTrash();

createPlanet();
createSky();


document.addEventListener('mousemove', handleMouseMove, false);

document.addEventListener('keydown', handleKeys, false);

document.addEventListener('touchstart', function(e) {
  touch = 1;

//every time x is clicked i hide text divs and restart player positions, replace with more thorough logic dependent on stage of game
if(down === 0) {
  down = 1;
		airplane.mesh.position.x = 0;
		airplane.mesh.position.y = planeStartY;
		airplane.mesh.position.z = planeStartZ;
		titleCard.style.display = "none";
		cardCrashed.style.display = "none";
		level1Card.style.display = "none";
		level2Card.style.display = "none";
		level3Card.style.display = "none";
}

}, false);

document.addEventListener('touchend', function(e) {
  touch = 0;
}, false);


document.addEventListener('touchmove', handleTouchMove, false);



loop();
}


//basics of initaiting a three.js scene
let scene, 
		camera, fieldOfView, aspectRatio, nearPlane, farPlane, HEIGHT, WIDTH,
		renderer, container;

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function onPointerMove( event ) {

	// calculate pointer position in normalized device coordinates
	// (-1 to +1) for both components

	pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
	pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

//variables for camera start position, this isnt that important anymore cause it's fixed to airplane pos
let camStartX = 0, camStartY = 690, camStartZ = 50;

function createScene() {
	HEIGHT = window.innerHeight;
	WIDTH = window.innerWidth;

	scene = new THREE.Scene();

	//camera
	aspectRatio = WIDTH / HEIGHT;
	fieldOfView = 65;
	nearPlane = 1;
	farPlane = 10000;

	camera = new THREE.PerspectiveCamera(
		fieldOfView,
		aspectRatio,
		nearPlane,
		farPlane
		);

//iniating camera start positions
	camera.position.x = camStartX;
	camera.position.y = camStartY;
	camera.position.z = camStartZ;

	//renderer
	renderer = new THREE.WebGLRenderer({
		alpha: true,
		antialias: true, // revisit
	});

	renderer.setSize(WIDTH, HEIGHT);

	renderer.shadowMap.enabled = true;

	// add DOM element renderer to HTML container
	container = document.getElementById('world');
	container.appendChild(renderer.domElement);


	//window resize
	window.addEventListener('resize', handleWindowResize,false);
}

function handleWindowResize() {
	// update height and width of the renderer and the camera
	HEIGHT = window.innerHeight;
	WIDTH = window.innerWidth;
	renderer.setSize(WIDTH, HEIGHT);
	camera.aspect = WIDTH / HEIGHT;
	camera.updateProjectionMatrix();
}




//lights

var hemisphereLight, shadowLight;

function createLights() {

//hemisphere light first par sky color, second par ground color, third intensity of light
hemisphereLight = new THREE.HemisphereLight(0xffffff,0x000000, 1);

//can give the whole scene a tint of a certain color (e.g. light or blue light), if you used add it to scene
// ambientLight = new THREE.AmbientLight(0x151752, 1);
	
scene.add(hemisphereLight);
// scene.add(ambientLight);
}

Planet = function(){
	
	// create the geometry (shape) of the cylinder;
	// the parameters are: 
	var geom = new THREE.SphereGeometry(600,64,32);
	
	// rotate the geometry on the x axis
	geom.applyMatrix(new THREE.Matrix4().makeRotationX(-Math.PI/2));
	
	// create the material 
	var mat = new THREE.MeshPhongMaterial({
		color:Colors.blue,
		// transparent:true,
		opacity:1,
		shading:THREE.FlatShading,
	});

	// To create an object in Three.js, we have to create a mesh 
	// which is a combination of a geometry and some material
	this.mesh = new THREE.Mesh(geom, mat);

	// Allow the sea to receive shadows
	this.mesh.receiveShadow = true; 
}


let planet, planet2;

function createPlanet(){
	planet = new Planet();

	// push it a little bit at the bottom of the scene
	planet.mesh.position.y = 0;
	planet.mesh.position.z = 0;

	scene.add(planet.mesh);
}

//stars are now yellow cubes far in the distance
Star = function(){
	// create a cube geometry;
	// this shape will be duplicated to create the cloud
	let geom = new THREE.BoxGeometry(12,12,12);
	
	// create a material; a simple white material will do the trick
	 mat = new THREE.MeshPhongMaterial({
		color:Colors.yellow,  
		shading:THREE.FlatShading
	});
	
	this.mesh = new THREE.Mesh(geom, mat);

}


// Define a Sky Object
Sky = function(){
	// Create an empty container
	this.mesh = new THREE.Object3D();
	
	// choose a number of clouds to be scattered in the sky
	this.nStars = 500;
	// To distribute the clouds consistently,
	// we need to place them according to a uniform angle
	var stepAngle = Math.PI*2 / this.nStars;
	
	// add stars at random x, y locations within frame, and a range of z locations to create some depth / variation
	for(var i=0; i<this.nStars; i++){
		var c = new Star();

		c.mesh.position.x = -10000 + Math.random() * 20000;

if(i<this.nStars/2) {
	//front and back of planet
		c.mesh.position.y = -7000 + Math.random() * 14000;
		if(i<this.nStars/4) {
		c.mesh.position.z = -7000-Math.random()*1000;
		}
else {
		c.mesh.position.z = 7000+Math.random()*1000;
}
}
// top and down
else {
	c.mesh.position.z = -7000 + Math.random() * 14000;
	if(i<(this.nStars-this.nStars/4)) {
c.mesh.position.y = -7000-Math.random()*1000;
		}
else {
		c.mesh.position.y = 7000+Math.random()*1000;
}

}
		
		var s = 1+Math.random()*2;
		c.mesh.scale.set(s,s,s);

		this.mesh.add(c.mesh);  
	}  



}


var sky;

function createSky(){
	sky = new Sky();
	sky.mesh.position.y = -600;
	scene.add(sky.mesh);
}

var AirPlane = function() {

	//this is taken from The Aviator, so the code below draws a proper plane
	//but i commented out adding all the smaller element to the scene and just left it as adding a standard cube.
	
	this.mesh = new THREE.Object3D();
	
	// Create the cabin
	var geomCockpit = new THREE.BoxGeometry(70,30,50,1,1,1);
	// var geomCockpit = new THREE.CylinderGeometry(50,60,20,64);
	var matCockpit = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
	var cockpit = new THREE.Mesh(geomCockpit, matCockpit);
	cockpit.castShadow = true;
	cockpit.receiveShadow = true;
	this.mesh.add(cockpit);

	var cockpit = new THREE.Mesh(geomCockpit, matCockpit);
	cockpit.castShadow = true;
	cockpit.receiveShadow = true;
	this.mesh.add(cockpit);

	// Create the engine
	var geomEngine = new THREE.BoxGeometry(20,50,50,1,1,1);
	var matEngine = new THREE.MeshPhongMaterial({color:Colors.white, shading:THREE.FlatShading});
	var engine = new THREE.Mesh(geomEngine, matEngine);
	engine.position.x = 40;
	engine.castShadow = true;
	engine.receiveShadow = true;
	// this.mesh.add(engine);
	
	// Create the tail
	var geomTailPlane = new THREE.BoxGeometry(15,20,5,1,1,1);
	var matTailPlane = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
	var tailPlane = new THREE.Mesh(geomTailPlane, matTailPlane);
	tailPlane.position.set(-35,25,0);
	tailPlane.castShadow = true;
	tailPlane.receiveShadow = true;
	// this.mesh.add(tailPlane);
	
	// Create the wing
	var geomSideWing = new THREE.BoxGeometry(40,8,150,1,1,1);
	var matSideWing = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
	var sideWing = new THREE.Mesh(geomSideWing, matSideWing);
	sideWing.castShadow = true;
	sideWing.receiveShadow = true;
	// this.mesh.add(sideWing);
	
	// propeller
	var geomPropeller = new THREE.BoxGeometry(20,10,10,1,1,1);
	var matPropeller = new THREE.MeshPhongMaterial({color:Colors.brown, shading:THREE.FlatShading});
	this.propeller = new THREE.Mesh(geomPropeller, matPropeller);
	this.propeller.castShadow = true;
	this.propeller.receiveShadow = true;
	
	// blades
	var geomBlade = new THREE.BoxGeometry(1,100,20,1,1,1);
	var matBlade = new THREE.MeshPhongMaterial({color:Colors.brownDark, shading:THREE.FlatShading});
	
	var blade = new THREE.Mesh(geomBlade, matBlade);
	blade.position.set(8,0,0);
	blade.castShadow = true;
	blade.receiveShadow = true;
	this.propeller.position.set(50,0,0);
};



//start position of plane
let planeStartY = 650;
let planeStartZ = 0;


function createPlane(){ 
	airplane = new AirPlane();
	airplane.mesh.scale.set(.1,.1,.3);
	airplane.mesh.position.y = planeStartY;
	airplane.mesh.position.z = planeStartZ;


	scene.add(airplane.mesh);
}


//debris
Trash = function() {

	let size = Math.random() * 20;
	let obj = Math.random() * 5;
	let geom;

	// rewrite this (switch case)

	//randomly choosing from a number of three.js shapes
	if(obj < 1) {geom = new THREE.DodecahedronGeometry(size,0);}
	if(obj >= 1 && obj < 2) {geom = new THREE.CylinderGeometry( size, 20, 4, 8 );}
	if(obj >= 2 && obj < 3) {geom = new THREE.TorusGeometry( size, 5, 16, 100 );}
	if(obj >= 3 && obj < 4) {geom = new THREE.IcosahedronGeometry( size, 0);}
	if(obj >= 4 && obj < 5) {geom = new THREE.OctahedronGeometry(size,0);}


	// create the material 
	let mat = new THREE.MeshPhongMaterial({
		//randomize colors! for a more coherent theme can have a list of theme colors to randomly choose from
		color:Math.random() * 0xffffff,
		opacity:1,
		shading:THREE.FlatShading,
	});

	this.mesh = new THREE.Mesh(geom, mat);

	this.mesh.receiveShadow = true; 
}

let trash;
let ntrash;

trash = new Array();

function createTrash(){

	//rewrite

	//createTrash creates a different number of debris item depending on what level we're in
	//these are additively accumulated. so at level 1, there's 50 debris items. when createTrash is called again
	//in level 2, it adds 100 debris items, so there is a total of 150. etc

	//change these numbers depending on how difficult you want each level to be, and how much things escalate

	if(level === 1) ntrash = 50;
	if(level === 2) ntrash = 100;
	if(level === 3) ntrash = 200;

	let prev = trash.length;

	// trash = new Array(ntrash);

	//this is the interval we place debris at. PI * 2 is the circumference of any circle. we want debris all around the circumference
	//so the interval is Math.PI divided by the number of debris items placed

	let stepAngle = Math.PI*2 / ntrash;

	//function for placing itmes around a sphere is radius & sin(angle)

	for(let i=0;i<ntrash;i++) {
		trash[prev+i] = new Trash();

		//a is the angle around the sphere, and it is the product of the interval trash are placed at * the ID number of debris
		//for ex., debris 1 will be at stepAngle, debris 2 at stepAngle * 2, etc.
		let a = stepAngle * i;
		let thisTrash= trash[prev+i].mesh;
		
		thisTrash.position.y = 700 * Math.sin(a);
		thisTrash.position.x = -650 + Math.random() * 1300;

		thisTrash.position.z = 700 * Math.cos(a);

		//random rotation of orientation of debris
		//less important now that updateTrash is added and they're all constantly rotating anyway
		thisTrash.rotation.x = Math.random() * (Math.PI * 2);
		thisTrash.rotation.y = Math.random() * (Math.PI * 2);
		thisTrash.rotation.z = Math.random() * (Math.PI * 2);

		scene.add(thisTrash);
	}

}

function updateTrash() {

//rotating all debris items in place at random x,y,z intervals
	for(let i=0;i<trash.length;i++) {
		//the 0.015 just represents the speed of rotation, and is a result of trial and error of what speed looked fine
		trash[i].mesh.rotation.x += Math.random() * .015;
		trash[i].mesh.rotation.y += Math.random() * .015;
		trash[i].mesh.rotation.z += Math.random() * .015;

	}

}



//mouse move

var mousePos={x:0, y:0};
let touchPos={x:0, y:0};

//scale mouse movement across the screen width and height into a number between 0 and 1
function handleMouseMove(event) {
	//horizontal axis
	var tx = -1 + (event.clientX / WIDTH)*2;

	//vertical axis, inverse the formula
	var ty = 1 - (event.clientY / HEIGHT)*2;
	mousePos = {x:tx, y:ty};

	console.log(mousePos);

}

let touchX, touchY;

//same but for touch movement
function handleTouchMove(event) {
	touchX = event.touches[0].clientX;
  	touchY = event.touches[0].clientY;

  	let tx = -1 + (touchX / WIDTH) *2;
  	let ty = 1 - (touchY / HEIGHT *2 );

  	touchPos={x:tx,y:ty};
}



let down = 0;
let exploded = 0;

//not using this anymore, but was a function for more smaller debris items to come out when a collision occurs. not great!
function explosion(){

	let expX, expY, expZ;

	let trashChildren = 10;

	if(exploded === 1) {
		for(let i=0;i<=ntrash;i++) {
			for (let j=0;j<=trashChildren;j++) {
				
				trash[i].mesh.children[j].position.x+= (-5 + j) * .5;
				trash[i].mesh.children[j].position.y+= (-5 + j) * .5;
				trash[i].mesh.children[j].position.z+= (-5 + j) * .5;
				}
		}
	}
}

let movePos = mousePos;

let h = 650; // placeholder

//as explained in createTrash, this is the size of the step we move in around the planet
let step =  Math.PI*2 / 360;

//the number of these steps we're taking
let stepCount = 1;
let stepCount_cam; // camera

//angle interval * the number of times you move in it, step * stepCount
let stepDistance;
let stepDistance_cam;

function updatePlane() {

	//where player is = step size * number of times you've taken that step
	stepDistance= stepCount * step;

	//same for camera
	stepDistance_cam = stepCount_cam * step;

	stepCount_cam = stepCount - 4; //keep camera a little behind the player

	if(touch === 1) movePos = touchPos;
	else movePos = mousePos;

	let targetY = normalize(movePos.y,-.75,.75,25, 175);
	let targetX = normalize(movePos.x,-.75,.75,-100, 100);

	if (down === 1) {
	airplane.mesh.rotation.y = movePos.x * -.1; //-.5

	//690 is radius of Earth + distance from earth
	//explanation of this math in words is in google doc
	airplane.mesh.position.y = Math.sin(stepDistance + Math.PI/2) * 690;
	airplane.mesh.position.z = Math.cos(stepDistance + Math.PI/2) * 690; 

	airplane.mesh.rotation.x = -1 * stepDistance; 
	
	//camera moves at a slightly bigger orbit (longer distance from earth) to be slightly above the player
	camera.position.y = (Math.sin(stepDistance_cam + Math.PI/2) * 700);
	camera.position.z = (Math.cos(stepDistance_cam + Math.PI/2) * 700);

	camera.rotation.x = -1 * stepDistance;

	//move in direction of the orientation
	airplane.mesh.position.x -= speed * (Math.tan(airplane.mesh.rotation.y));


	console.log(airplane.mesh.position.x);
	// airplane.mesh.position.x += movePos.x; 

	stepCount+=.3;

//when at a particular distance, move to the next level, create more debris, and show the card for that level (e.g., "level 1 done!")
	if (stepDistance >= 2 && level === 1) {
			down = 0;
			level += 1;
			createTrash();
			level1Card.style.display = "block";
	}

	if(stepDistance>=4 && level === 2) {
		down = 0;
		level +=1;
		createTrash();
		level2Card.style.display = "block";
	}

	if(stepDistance>=6 && level === 3) {
		down = 0;
		level +=1;
		level2Card.style.display = "block"
	}
}

}

function handleKeys(event) {

	if(event.keyCode === 88) {
		down = 1;
		airplane.mesh.position.x = 0;
		airplane.mesh.position.y = planeStartY;
		airplane.mesh.position.z = planeStartZ;
		titleCard.style.display = "none";
		cardCrashed.style.display = "none";
		level1Card.style.display = "none";	
		level2Card.style.display = "none";	
		level3Card.style.display = "none";	
	}


	if(event.keyCode === 37) {
		movePos =- .1;
		console.log("left pressed");
	}

	if(event.keyCode === 39) {
		movePos=+ .1;
		console.log("right pressed");
	}

}


let speed = 2;
function updateCamera(event) {

	// camera.position.z = airplane.mesh.position.z + 70;
	// camera.position.x = airplane.mesh.position.x;
	// camera.position.y = airplane.mesh.position.y;

	// camera.position.y = Math.sin(a + Math.PI/2) * 700;
	// camera.position.z = Math.cos(a + Math.PI/2) * 700;
	// camera.position.x = airplane.mesh.position.x;


	// camera.rotation.x = Math.PI;
}


function normalize(v,vmin,vmax,tmin, tmax){

	var nv = Math.max(Math.min(v,vmax), vmin);
	var dv = vmax-vmin;
	var pc = (nv-vmin)/dv;
	var dt = tmax-tmin;
	var tv = tmin + (pc*dt);
	return tv;

}

let titleCard, cardCrashed;
let livesCounter;
let lives = 3;

function loop() {

//handle collisions. raycaster points a laser like thing out and checks if it collided with any object
	raycaster.setFromCamera( pointer, camera );

	// raycaster.set(airplane.mesh.position,direction)
	// calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects( scene.children );
	let distancetoPlane, distancetoCam, camX, camY, camZ, objX, objY, objZ;

	cardCrashed = document.getElementById("cardCrashed");
	titleCard = document.getElementById("cardIntro");
	livesCounter = document.getElementById("lives");
	level1Card = document.getElementById("level1Done");
	level2Card = document.getElementById("level2Done");
	level3Card = document.getElementById("level3Done");

	for ( let i = 0; i < intersects.length; i ++ ) {

		objX = intersects[i].object.position.x;
		objY = intersects[i].object.position.y;
		objZ = intersects[i].object.position.z;

		camX = camera.position.x;
		camY = camera.position.y;
		camZ = camera.position.z;

		
		planeX = airplane.mesh.position.x;
		planeY = airplane.mesh.position.y;
		planeZ = airplane.mesh.position.z;

		//distance formula for collision

		distancetoCam = Math.sqrt(Math.pow(objX-camX,2)+Math.pow(objY-camY,2)+Math.pow(objZ-camZ,2));

		distancetoPlane = Math.sqrt(Math.pow(objX-planeX,2)+Math.pow(objY-planeY,2)+Math.pow(objZ-planeZ,2))


//when collision happens, decrease number of lives (hearts)
		if (distancetoPlane < 30) {
			down = 0;

			console.log("collided!");
			cardCrashed.style.display= "block";
			lives-= 1;

			if(lives === 2) {
				livesCounter.innerHTML = "<h2>&hearts; &hearts;<h2>";
			}

			if(lives === 1) livesCounter.innerHTML = "<h2>&hearts;<h2>";

			if(lives === 0) {
				lives = 3;
				livesCounter.innerHTML = "<h2>&hearts; &hearts; &hearts;<h2>";
			} 

			// intersects[ i ].object.material.color.set( 0xff0000 );
			camera.position.set(camStartX, camStartY, camStartZ);
			camera.rotation.x = 0;


			ii = 3;

		}
	}

	updatePlane();
	updateCamera();
	updateTrash();

	// render the scene
	renderer.render(scene, camera);

	// call the loop function again
	requestAnimationFrame(loop);	
}


