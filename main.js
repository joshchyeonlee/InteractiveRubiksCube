import './style.css';
import * as THREE from 'three';
import * as TWEEN from '@tweenjs/tween.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

var scene, camera, renderer, controls, mouse, raycaster, selectedCubeCoord;
const cubeArray = [];

function generateCubes(x,y,z){
  const geometry = new THREE.BoxGeometry(1,1,1);

  const cubeMaterials = [
    new THREE.MeshBasicMaterial({color: 0xff0000, side: THREE.FrontSide, transparent: true }), //red right
    new THREE.MeshBasicMaterial({color: 0xff8200, side: THREE.FrontSide, transparent: true }), //orange left
    new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.FrontSide, transparent: true }), //white top
    new THREE.MeshBasicMaterial({color: 0xffa500, side: THREE.FrontSide, transparent: true }), //yellow bottom
    new THREE.MeshBasicMaterial({color: 0x008000, side: THREE.FrontSide, transparent: true }), //green front
    new THREE.MeshBasicMaterial({color: 0x0000ff, side: THREE.FrontSide, transparent: true }), //blue back
  ];

  const cube = new THREE.Mesh(geometry,cubeMaterials);
  scene.add(cube);
  cube.position.set(x,y,z);
  cubeArray.push(cube);
}

function getCubePlane(direction){

  const cubes = [];
  for(let i = 0; i < cubeArray.length; i++){
    if(direction === 'y' && cubeArray[i].position.y === selectedCubeCoord.y) {
      cubes.push(cubeArray[i]);
    }
    else if (direction === 'x' && cubeArray[i].position.x === selectedCubeCoord.x){
      cubes.push(cubeArray[i]);
    }
  }

  return cubes;
}

// function getCubePlane(plane){
//   const group = 3;
//   const cubes = [];

//   let offset = 1;
//   let skip = 0;
//   let counter = 0;
//   let upper = cubeArray.length;

//   switch(plane){
//     case 'x':
//       upper = 9;
//       break;
//     case 'y':
//       skip = 6;
//       break;
//     case 'z':
//       offset = 3;
//       break;
//   }

//   for(let i = 0; i < upper; i += offset){
//     cubes.push(i);
//     counter++;
//     if(counter >= group) {
//       i += skip;
//       counter = 0;
//     }
//   }

//   return cubes;
// }

function rotateCube(keypress) {
  const angle = Math.PI/2;
  var dir, cubes, rot;

  switch(keypress){
    case 'w':
      dir = 'y';
      rot = angle;
      break;
    case 'a':
      dir = 'x';
      rot = - angle;
      break;
    case 's':
      dir = 'y';
      rot = - angle;
      break;
    case 'd':
      dir = 'x';
      rot = angle;
      break;
  }

  if (dir){
    cubes = getCubePlane(dir);
    console.log(cubes);
  } else {
    return;
  }

  for(let i = 0; i < cubes.length; i++){
    if(dir === `x`) cubes[i].rotation.x += rot;
    else if (dir === 'y') cubes[i].rotation.y += rot;
  }
}

function initialize() {
  scene = new THREE.Scene();
  
  camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  camera.position.set(3,2,3,);

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);  
  });

  renderer = new THREE.WebGLRenderer( { antialias: true} );
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const ambientLight = new THREE.AmbientLight(0xffffff);
  scene.add(ambientLight);

  controls = new OrbitControls(camera, renderer.domElement);

  for(let i = -1; i < 2; i++){
    for(let j = -1; j < 2; j ++){
      for(let k = -1; k < 2; k ++){
        generateCubes(i,j,k);
      }
    }
  };

  window.addEventListener('keypress', (keypress) => {
    rotateCube(keypress.key);
  })

  mouse = new THREE.Vector2();
 
  window.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;
  }, false);
  
  raycaster = new THREE.Raycaster();

  window.addEventListener('click', () => {
    raycaster.setFromCamera(mouse, camera);
    let intersects = raycaster.intersectObjects(scene.children);
    if(intersects.length > 0){
      selectedCubeCoord = intersects[0].object.position;
    }
  })
}

function hoverCube() {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children);

  for(let i = 0; i < intersects.length; i++) {
    const materialArr = intersects[i].object.material;

    for(let j = 0; j < materialArr.length; j++){
      if(i === 0) materialArr[j].opacity = 0.5;
      else materialArr[j].opacity = 1.0;
    }
  }
}

function resetMaterials() {
  for(let i = 0; i < scene.children.length; i++) {
    const arr = scene.children[i].material;
    if(arr){
      for(let j = 0; j < arr.length; j++) {
        arr[j].opacity = 1.0;
      }
    }
  }
}

function animate() {
  requestAnimationFrame(animate);
  resetMaterials();
  controls.update();
  hoverCube();
  renderer.render(scene,camera);
}

initialize();
animate();
