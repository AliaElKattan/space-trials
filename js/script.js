

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
		levelCard.style.display = "none";
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
hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, 1);

//directional light
// shadowLight = new THREE.DirectionalLight(0xffffff, 0.9);

// shadowLight.position.set(150,350,350);

// shadowLight.castShadow = true;

// shadowLight.shadow.camera.left = -400;
// 	shadowLight.shadow.camera.right = 400;
// 	shadowLight.shadow.camera.top = 400;
// 	shadowLight.shadow.camera.bottom = -400;
// 	shadowLight.shadow.camera.near = 1;
// 	shadowLight.shadow.camera.far = 1000;

// // define the visible area of the projected shadow
// 	shadowLight.shadow.camera.left = -400;
// 	shadowLight.shadow.camera.right = 400;
// 	shadowLight.shadow.camera.top = 400;
// 	shadowLight.shadow.camera.bottom = -400;
// 	shadowLight.shadow.camera.near = 1;
// 	shadowLight.shadow.camera.far = 1000;

// // define the resolution of the shadow; the higher the better, 
// // but also the more expensive and less performant
// 	shadowLight.shadow.mapSize.width = 2048;
// 	shadowLight.shadow.mapSize.height = 2048;


ambientLight = new THREE.AmbientLight(0x151752, 1);

	
scene.add(hemisphereLight);
// scene.add(shadowLight);
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
	this.nStars = 500;
	// To distribute the clouds consistently,
	// we need to place them according to a uniform angle
	var stepAngle = Math.PI*2 / this.nStars;
	
	// create the clouds
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

// let planeStartY = 50;
// let planeStartZ = 140;

let planeStartY = 650;
let planeStartZ = 0;


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

	let size = Math.random() * 20;
	let obj = Math.random() * 5;
	let geom;

	// rewrite this 

	if(obj < 1) {geom = new THREE.DodecahedronGeometry(size,0);}
	if(obj >= 1 && obj < 2) {geom = new THREE.CylinderGeometry( size, 20, 4, 8 );}
	if(obj >= 2 && obj < 3) {geom = new THREE.TorusGeometry( size, 5, 16, 100 );}
	if(obj >= 3 && obj < 4) {geom = new THREE.IcosahedronGeometry( size, 0);}
	if(obj >= 4 && obj < 5) {geom = new THREE.OctahedronGeometry(size,0);}


	// create the material 
	let mat = new THREE.MeshPhongMaterial({
		color:Math.random() * 0xffffff,
		opacity:1,
		shading:THREE.FlatShading,
	});

	// geom.vertices[1].x += Math.random() * 40;

	// To create an object in Three.js, we have to create a mesh 
	// which is a combination of a geometry and some material
	this.mesh = new THREE.Mesh(geom, mat);

	this.mesh.receiveShadow = true; 
}

let trash;
let ntrash;

trash = new Array();

function createTrash(){

	//rewrite

	if(level === 1) ntrash = 50;
	if(level === 2) ntrash = 100;
	if(level === 3) ntrash = 200;

	let prev = trash.length;

	// trash = new Array(ntrash);

	let stepAngle = Math.PI*2 / ntrash;

	for(let i=0;i<ntrash;i++) {
		trash[prev+i] = new Trash();
		let a = stepAngle * i;
		let thisTrash= trash[prev+i].mesh;
		
		thisTrash.position.y = 700 * Math.sin(a);
		thisTrash.position.x = -650 + Math.random() * 1300;

		thisTrash.position.z = 700 * Math.cos(a);

		thisTrash.rotation.x = Math.random() * (Math.PI * 2);
		thisTrash.rotation.y = Math.random() * (Math.PI * 2);
		thisTrash.rotation.z = Math.random() * (Math.PI * 2);

		scene.add(thisTrash);
	}

}

function updateTrash() {

	for(let i=0;i<trash.length;i++) {
		trash[i].mesh.rotation.x += Math.random() * .01;
		trash[i].mesh.rotation.y += Math.random() * .01;
		trash[i].mesh.rotation.z += Math.random() * .01;

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

let h = 650; // placeholder


let step =  Math.PI*2 / 360;
let ii = 2;
let iii; // camera
let a;
let ac;

function updatePlane() {

	a= ii* step;
	ac = iii * step;
	iii = ii - 4;

	if(touch === 1) movePos = touchPos;
	else movePos = mousePos;

	let targetY = normalize(movePos.y,-.75,.75,25, 175);
	let targetX = normalize(movePos.x,-.75,.75,-100, 100);

	if (down === 1) {
	airplane.mesh.rotation.y = movePos.x * -.1; //-.5

	airplane.mesh.position.y = Math.sin(a + Math.PI/2) * 690;
	airplane.mesh.position.z = Math.cos(a + Math.PI/2) * 690; //690

	airplane.mesh.rotation.x = -1 * a; 
	

	camera.position.y = (Math.sin(ac + Math.PI/2) * 700);
	camera.position.z = (Math.cos(ac + Math.PI/2) * 700);
	// camera.position.x = airplane.mesh.position.x;

	camera.rotation.x = -1 * a;

	airplane.mesh.position.x -= speed * (Math.tan(airplane.mesh.rotation.y));
	airplane.mesh.position.x += movePos.x; 

	ii+=.3;
	// iii += .3;

	// console.log("ii: ", ii, " ,a: ", a);

	if (a >= 2 && level === 1) {
			down = 0;
			level += 1;
			createTrash();
			levelCard.style.display = "block";
	}

	if(a>=4 && level === 2) {
		down = 0;
		level +=1;
		createTrash();
		levelCard.style.display = "block";
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
		levelCard.style.display = "none";	
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

let titleCard, cardCrashed, levelCard;
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
	levelCard = document.getElementById("levelDone");

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
			camera.rotation.x = 0;


			//restart position

			// airplane.mesh.position.x = 0;
			// airplane.mesh.position.y = planeStartY;
			// airplane.mesh.position.z = planeStartZ;
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


