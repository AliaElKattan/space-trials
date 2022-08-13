var Colors = {
	red:0xf25346,
	white:0xd8d0d1,
	brown:0x59332e,
	pink:0xF5986E,
	brownDark:0x23190f,
	blue:0x121d80,
	yellow: 0xffd53d,
};

let touch = 0;
let start = 0;
let level = 1;


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

// document.addEventListener('mousedown', handleMouseDown, false);

// document.addEventListener('mouseup', handleMouseUp, false);

document.addEventListener('keydown', handleKeys, false);

document.addEventListener('touchstart', function(e) {
  touch = 1;

if(down === 0) {
  down = 1;
		airplane.mesh.position.x = 0;
		airplane.mesh.position.y = planeStartY;
		airplane.mesh.position.z = planeStartZ;
		titleCard.style.display = "none";
		cardCrashed.style.display = "none";
}

}, false);

document.addEventListener('touchend', function(e) {
  touch = 0;
}, false);


document.addEventListener('touchmove', handleTouchMove, false);


loop();
}



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

let camStartX = 0, camStartY = 70, camStartZ = 200;

function createScene() {
	HEIGHT = window.innerHeight;
	WIDTH = window.innerWidth;

	scene = new THREE.Scene();

	//scene.fog = new THREE.Fog(0xf7d9aa, 100, 950)

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


function handleKeys(event) {

	if(event.keyCode === 88) {
		down = 1;
		airplane.mesh.position.x = 0;
		airplane.mesh.position.y = planeStartY;
		airplane.mesh.position.z = planeStartZ;
		titleCard.style.display = "none";
		cardCrashed.style.display = "none";
	}
}


//lights

var hemisphereLight, shadowLight;

function createLights() {

//hemisphere light first par sky color, second par ground color, third intensity of light
hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, .9);




//directional light
shadowLight = new THREE.DirectionalLight(0xffffff, 0.9);

shadowLight.position.set(150,350,350);

shadowLight.castShadow = true;

shadowLight.shadow.camera.left = -400;
	shadowLight.shadow.camera.right = 400;
	shadowLight.shadow.camera.top = 400;
	shadowLight.shadow.camera.bottom = -400;
	shadowLight.shadow.camera.near = 1;
	shadowLight.shadow.camera.far = 1000;

// define the visible area of the projected shadow
	shadowLight.shadow.camera.left = -400;
	shadowLight.shadow.camera.right = 400;
	shadowLight.shadow.camera.top = 400;
	shadowLight.shadow.camera.bottom = -400;
	shadowLight.shadow.camera.near = 1;
	shadowLight.shadow.camera.far = 1000;

// define the resolution of the shadow; the higher the better, 
// but also the more expensive and less performant
	shadowLight.shadow.mapSize.width = 2048;
	shadowLight.shadow.mapSize.height = 2048;


ambientLight = new THREE.AmbientLight(0x151752, .4);


scene.add(hemisphereLight);
scene.add(shadowLight);
scene.add(ambientLight);
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
		transparent:true,
		opacity:.9,
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
	planet.mesh.position.y = -600;

	scene.add(planet.mesh);
}

Cloud = function(){
	// Create an empty container that will hold the different parts of the cloud
	this.mesh = new THREE.Object3D();
	
	// create a cube geometry;
	// this shape will be duplicated to create the cloud
	var geom = new THREE.BoxGeometry(20,20,20);
	
	// create a material; a simple white material will do the trick
	var mat = new THREE.MeshPhongMaterial({
		color:Colors.white,  
	});
	
	// duplicate the geometry a random number of times
	var nBlocs = 3+Math.floor(Math.random()*3);
	for (var i=0; i<nBlocs; i++ ){
		
		// create the mesh by cloning the geometry
		var m = new THREE.Mesh(geom, mat); 
		
		// set the position and the rotation of each cube randomly
		m.position.x = i*15;
		m.position.y = Math.random()*10;
		m.position.z = Math.random()*10;
		m.rotation.z = Math.random()*Math.PI*2;
		m.rotation.y = Math.random()*Math.PI*2;
		
		// set the size of the cube randomly
		var s = .1 + Math.random()*.9;
		m.scale.set(s,s,s);
		
		// allow each cube to cast and to receive shadows
		m.castShadow = true;
		m.receiveShadow = true;
		
		// add the cube to the container we first created
		this.mesh.add(m);
	} 
}

Star = function(){
	// create a cube geometry;
	// this shape will be duplicated to create the cloud
	let geom = new THREE.BoxGeometry(10,10,10);
	
	// create a material; a simple white material will do the trick
	 mat = new THREE.MeshPhongMaterial({
		color:Colors.yellow,  
	});
	
	this.mesh = new THREE.Mesh(geom, mat);

}


// Define a Sky Object
Sky = function(){
	// Create an empty container
	this.mesh = new THREE.Object3D();
	
	// choose a number of clouds to be scattered in the sky
	this.nStars = 50;
	// To distribute the clouds consistently,
	// we need to place them according to a uniform angle
	var stepAngle = Math.PI*2 / this.nStars;
	
	// create the clouds
	for(var i=0; i<this.nStars; i++){
		var c = new Star();
	 
		// set the rotation and the position of each cloud;
		// for that we use a bit of trigonometry
		// var a = stepAngle*i; // this is the final angle of the cloud
		// var h = 800 + Math.random()*200; // this is the distance between the center of the axis and the cloud itself

		// Trigonometry!!! I hope you remember what you've learned in Math :)
		// in case you don't: 
		// we are simply converting polar coordinates (angle, distance) into Cartesian coordinates (x, y)
		// c.mesh.position.y = Math.sin(a)*h;
		// c.mesh.position.x = Math.cos(a)*h;

		// for a better result, we position the clouds 
		// at random depths inside of the scene
		c.mesh.position.z = -7000-Math.random()*1000;
		c.mesh.position.x = -10000 + Math.random() * 20000;
		c.mesh.position.y = -400 + Math.random() * 5000;

		
		// we also set a random scale for each cloud
		var s = 1+Math.random()*2;
		c.mesh.scale.set(s,s,s);

		// do not forget to add the mesh of each cloud in the scene
		this.mesh.add(c.mesh);  
	}  



}

// Now we instantiate the sky and push its center a bit
// towards the bottom of the screen

var sky;

function createSky(){
	sky = new Sky();
	sky.mesh.position.y = -600;
	scene.add(sky.mesh);
}

var AirPlane = function() {
	
	this.mesh = new THREE.Object3D();
	
	// Create the cabin
	var geomCockpit = new THREE.BoxGeometry(70,30,50,1,1,1);
	// var geomCockpit = new THREE.CylinderGeometry(50,60,20,64);
	var matCockpit = new THREE.MeshPhongMaterial({color:Colors.red, shading:THREE.FlatShading});
	var cockpit = new THREE.Mesh(geomCockpit, matCockpit);
	cockpit.castShadow = true;
	cockpit.receiveShadow = true;
	this.mesh.add(cockpit);
	
	// geomCockpit.vertices[4].y-=10;
	// geomCockpit.vertices[4].z+=20;
	// geomCockpit.vertices[5].y-=10;
	// geomCockpit.vertices[5].z-=20;
	// geomCockpit.vertices[6].y+=30;
	// geomCockpit.vertices[6].z+=20;
	// geomCockpit.vertices[7].y+=30;
	// geomCockpit.vertices[7].z-=20;

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
	// this.propeller.add(blade);
	this.propeller.position.set(50,0,0);
	// this.mesh.add(this.propeller);
};


// var airplane;

let planeStartY = 50;
let planeStartZ = 140;
function createPlane(){ 
	airplane = new AirPlane();
	airplane.mesh.scale.set(.1,.1,.3);
	airplane.mesh.position.y = planeStartY;
	airplane.mesh.position.z = planeStartZ;

	//placeholder, face direction of camera
	// airplane.mesh.rotation.y = -80;


	scene.add(airplane.mesh);
}

Trash = function() {
	
	let square = new THREE.Shape();
	square.moveTo(10,10);
	square.lineTo(10,-10);
	square.lineTo(-10,-10);
	square.lineTo(-10,10);

	let geom_square = new THREE.ShapeGeometry(square);

	let mat_square = new THREE.MeshBasicMaterial({
		color: Colors.brown,
		opacity: 1,
		side: THREE.DoubleSide,
		depthWrite: false
	});

	// let square_mesh = new THREE.Mesh(geom_square, mat_square);

	const loader = new THREE.TextureLoader();
	loader.setCrossOrigin("Anonymous");

	let texture = loader.load('earth.png');
	// let mat_sprite = new THREE.SpriteMaterial({map:texture, transparent : true, opacity : 0.5, color: 0xffffff });


	let mat_sprite = new THREE.SpriteMaterial({map:texture, transparent : false, opacity : 0.5 });

	let sprite = new THREE.Sprite(mat_sprite);
	sprite.scale.set(10,10,10);
	sprite.position.set(50,50,50);
	scene.add(sprite);

	this.mesh = new THREE.Mesh(geom_square, mat_square);
	// scene.add(square_mesh);

	// this.mesh.receiveShadow = true; 
}

let trash;
let ntrash = 100;

function createTrash(){

	trash = new Array(ntrash);

	for(let i=0;i<=ntrash;i++) {
		trash[i] = new Trash();
		
		trash[i].mesh.position.y = 50 + (Math.random() * 300);
		trash[i].mesh.position.x = -500 + Math.random() * 1000;
		trash[i].mesh.position.z = 50 + Math.random() * -800;
		// trash[i].mesh.position.z = -80;

		scene.add(trash[i].mesh);
	}

}


//mouse move

var mousePos={x:0, y:0};
let touchPos={x:0, y:0};

function handleMouseMove(event) {
	//horizontal axis
	var tx = -1 + (event.clientX / WIDTH)*2;

	//vertical axis, inverse the formula
	var ty = 1 - (event.clientY / HEIGHT)*2;
	mousePos = {x:tx, y:ty};

}

let touchX, touchY;

function handleTouchMove(event) {
	touchX = event.touches[0].clientX;
  	touchY = event.touches[0].clientY;

  	let tx = -1 + (touchX / WIDTH) *2;
  	let ty = 1 - (touchY / HEIGHT *2 );

  	touchPos={x:tx,y:ty};
}

let down = 0;
let exploded = 0;

// function handleMouseDown(event) {
// 	titleCard = document.getElementById("cardIntro");

// 	let geom = new THREE.DodecahedronGeometry(10,0);
	

// 	// create the material 
// 	let mat = new THREE.MeshPhongMaterial({
// 		color:Colors.brownDark,
// 		opacity:1,
// 		shading:THREE.FlatShading,
// 	});

// 	if(titleCard.style.display === "none") {
// 			down = 1;
// 	}

// 	exploded = 1;

// 	for(let i=0;i<=ntrash;i++) {

// 		// trash[i].mesh.scale.set(.5,.5,.5);

// 		for(let j=0;j<=10;j++) {
// 			let d = new THREE.Mesh(geom,mat);
// 			trash[i].mesh.add(d);
// 			// d.position.x = trash[i].mesh.position.x+Math.random()*10;
// 		}


// 	}

// }

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

function updatePlane() {

	if(touch === 1) movePos = touchPos;
	else movePos = mousePos;

	let targetY = normalize(movePos.y,-.75,.75,25, 175);
	let targetX = normalize(movePos.x,-.75,.75,-100, 100);

	if (down === 1) {
	airplane.mesh.rotation.x = movePos.y * .5;
	airplane.mesh.rotation.y = movePos.x * -.5;

	airplane.mesh.position.z -= speed;
	airplane.mesh.position.y += speed * (Math.tan(airplane.mesh.rotation.x));
	airplane.mesh.position.x -= speed * (Math.tan(airplane.mesh.rotation.y));
}

}

let speed = 2;
function updateCamera(event) {

	camera.position.z = airplane.mesh.position.z + 70;
	camera.position.x = airplane.mesh.position.x;
	camera.position.y = airplane.mesh.position.y;

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

	raycaster.setFromCamera( pointer, camera );

	// raycaster.set(airplane.mesh.position,direction)
	// calculate objects intersecting the picking ray
	const intersects = raycaster.intersectObjects( scene.children );
	let distancetoPlane, distancetoCam, camX, camY, camZ, objX, objY, objZ;

	cardCrashed = document.getElementById("cardCrashed");
	titleCard = document.getElementById("cardIntro");
	livesCounter = document.getElementById("lives");

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

		//distance formula

		distancetoCam = Math.sqrt(Math.pow(objX-camX,2)+Math.pow(objY-camY,2)+Math.pow(objZ-camZ,2));

		distancetoPlane = Math.sqrt(Math.pow(objX-planeX,2)+Math.pow(objY-planeY,2)+Math.pow(objZ-planeZ,2))

		// console.log(distancetoPlane);
		// console.log("test");

		if (distancetoPlane < 30) {
			down = 0;

			console.log("collided!");
			cardCrashed.style.display= "block";
			lives-= 1;

			if(lives === 2) {
				livesCounter.innerHTML = "<h2>LIVES: 2<h2>";
			}

			if(lives === 1) livesCounter.innerHTML = "<h2>LIVES: 1<h2>";

			if(lives === 0) {
				lives = 3;
				livesCounter.innerHTML = "<h2>LIVES: 3<h2>";
			} 

			// intersects[ i ].object.material.color.set( 0xff0000 );
			camera.position.set(camStartX, camStartY, camStartZ);


			//restart position

			airplane.mesh.position.x = 0;
			airplane.mesh.position.y = planeStartY;
			airplane.mesh.position.z = planeStartZ;



		}
	}

	updatePlane();
	updateCamera();

	// render the scene
	renderer.render(scene, camera);

	// call the loop function again
	requestAnimationFrame(loop);	
}


