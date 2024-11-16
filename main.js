import * as THREE from 'three';
import { randFloat, randInt } from 'three/src/math/MathUtils';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
let controls;
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const geometry2 = new THREE.SphereGeometry(0.1);
const geometry3 = new THREE.SphereGeometry(0.25);

var material2 = new THREE.ShaderMaterial({
  uniforms: {
    color1: {
      value: new THREE.Color("red")
    },
    color2: {
      value: new THREE.Color("green")
    }
  },
  vertexShader: `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 color1;
    uniform vec3 color2;
  
    varying vec2 vUv;
    
    void main() {
      
      gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
    }
  `,
  wireframe: true
});
var material3 = new THREE.ShaderMaterial({
  uniforms: {
    color1: {
      value: new THREE.Color("red")
    },
    color2: {
      value: new THREE.Color("green")
    }
  },
  vertexShader: `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }
  `,
  fragmentShader: `
    uniform vec3 color1;
    uniform vec3 color2;
  
    varying vec2 vUv;
    
    void main() {
    vec4 cool;
      if (vUv.x > 0.2 && vUv.x < 0.3 && vUv.y > 0.2)
      {
        cool = vec4(mix(color1, color2, 0.0), 1.0);

}
      else
{
        cool = vec4(mix(color1, color2, 1.0), 1.0);

}
        gl_FragColor = cool;
    }
  `,
  wireframe: false
});

const material =  [ new THREE.MeshBasicMaterial( { color: 0x00ff00 } ),  new THREE.MeshBasicMaterial( { color: 0xff0000 } ), new THREE.MeshBasicMaterial( { color: 0x0000ff } )] ;
const bg = new THREE.Mesh(new THREE.SphereGeometry(10), material2);
bg.position.set(0,0,-15);
bg.rotateOnAxis(new THREE.Vector3(1,0,0), -80);
scene.add(bg)
const anchor = new THREE.Mesh( geometry2, material [0]);
scene.add( anchor );
const head = new THREE.Mesh( new THREE.SphereGeometry(1.4), material2 );
scene.add( head );
const eyer = new THREE.Mesh( new THREE.SphereGeometry(0.25), material3 );
eyer.translateOnAxis(new THREE.Vector3(0.5,0,0.75), 1);
scene.add( eyer );
const eyel = new THREE.Mesh( new THREE.SphereGeometry(0.25), material3 );
eyel.translateOnAxis(new THREE.Vector3(-0.5,0,0.75), 1);
scene.add( eyel );
for (var i =0; i < 11; i++)
{
    const t =new THREE.MeshBasicMaterial( { color: Math.random() * 0xffffff } )
    const cube = new THREE.Mesh( geometry3, t );
    const dist =randFloat(0, 360)
    cube.rotateOnAxis(new THREE.Vector3(0,1,0), i * (36));
    cube.translateOnAxis(new THREE.Vector3(1,0,0), 1);
    scene.add( cube );
    anchor.attach(cube);
}
anchor.translateOnAxis(new THREE.Vector3(0,1,0), 1);
    
// const cube = new THREE.Mesh( geometry2, material [1] );
// scene.add( cube );

camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

init();
function init()
{
    // controls

				controls = new OrbitControls( camera, renderer.domElement );
				controls.listenToKeyEvents( window ); // optional

				//controls.addEventListener( 'change', render ); // call this only in static scenes (i.e., if there is no animation loop)

				controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
				controls.dampingFactor = 0.05;

				controls.screenSpacePanning = false;

				controls.minDistance = 4;
				controls.maxDistance = 6;

				controls.maxPolarAngle = Math.PI / 2;

}

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

document.addEventListener( 'mousemove', onDocumentMouseMove, false );

function onDocumentMouseMove( event ) {

    mouseX = ( event.clientX - windowHalfX );
    mouseY = ( event.clientY - windowHalfY );

}

var target = new THREE.Vector3();

var mouseX = 0, mouseY = 0;

var initalEyer = new THREE.Vector3();
initalEyer.copy(eyer.position);
var initalEyel = new THREE.Vector3();
initalEyel.copy(eyel.position);


    // eyer.position.set(0,0,0);
var clock = new THREE.Clock(true);
var i = 0;
function animate() {
    controls.update();
    anchor.rotation.y += 0.01;
    bg.rotation.y += 0.001;


    target.x += ( mouseX - target.x ) * .08;
    target.y += ( - mouseY - target.y ) * .08;
    target.z = 100; // assuming the camera is located at ( 0, 0, z );

    // if (clock.getElapsedTime() % 1.1 > 1)
    
    if (i % 4 == 0)
    {
      eyer.position.setX(initalEyer.x);
      eyer.position.setY(initalEyer.y);
      eyer.position.add(new THREE.Vector3(randFloat(-0.1, 0.1),randFloat(-0.1, 0.1),0));
      eyel.position.setX(initalEyel.x);
      eyel.position.setY(initalEyel.y);
      eyel.position.add(new THREE.Vector3(randFloat(-0.1, 0.1),randFloat(-0.1, 0.1),0));
    }
    
    eyer.lookAt( target );
    eyel.lookAt(target);


	renderer.render( scene, camera );
  i++;
}
renderer.setAnimationLoop( animate );