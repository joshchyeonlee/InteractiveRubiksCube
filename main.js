import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { AxesHelper } from 'three';

var scene, camera, renderer, controls, mouse, raycaster, selectedCubeCoord;

const xAxis = new THREE.Vector3(1,0,0).normalize();
const yAxis = new THREE.Vector3(0,1,0).normalize();
const zAxis = new THREE.Vector3(0,0,1).normalize();

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
    else if (direction === 'z' && cubeArray[i].position.z === selectedCubeCoord.z){
      cubes.push(cubeArray[i]);
    }
  }

  return cubes;
}

function getMatrix(dir, radians){
  if(dir === 'x') return  [[Math.cos(radians), -Math.sin(radians)],[Math.sin(radians), Math.cos(radians)]];
  else if (dir === 'y') return [[Math.cos(radians), Math.sin(radians)],[-Math.sin(radians), Math.cos(radians)]];
  else return [[Math.cos(radians), -Math.sin(radians)],[Math.sin(radians), Math.cos(radians)]];
}

function getNewCoordinates(curr, dir, radians){
  const matrix = getMatrix(dir,radians);
  let x = curr[0] * matrix[0][0] + curr[1] * matrix[0][1];
  let y = curr[0] * matrix[1][0] + curr[1] * matrix[1][1];
  if(x === -0) x = 0;
  if(y === -0) y = 0;

  return[Math.round(x),Math.round(y)];
}

function rotateCube(key) {
  const angle = Math.PI/2;
  var dir, cubes, rot, curr;

  switch(key){
    case 'q': //rotate about x axis cw
      dir = 'x';
      rot = - angle;
      break;
    case 'w': //rotate about y axis cw
      dir = 'y';
      rot = - angle;
      break;
    case 'e': //rotate about z axis cw
      dir = 'z';
      rot = - angle;
      break;
    case 'a': //rotate about x axis ccw
      dir = 'x';
      rot = angle;
      break;
    case 's': //rotate about y axis ccw
      dir = 'y';
      rot = angle;
      break;
    case 'd': //rotate about z axis ccw
      dir = 'z';
      rot = angle;
      break;
  }

  if (dir){
    cubes = getCubePlane(dir);
  } else {
    return;
  }

  for(let i = 0; i < cubes.length; i++){
    if(dir === 'x') {
      cubes[i].rotateOnWorldAxis(xAxis, rot);
      curr = [cubes[i].position.y, cubes[i].position.z];
      const coord = getNewCoordinates(curr, dir, rot);
      cubes[i].position.y = coord[0];
      cubes[i].position.z = coord[1];
    }
    else if (dir === 'y') {
      cubes[i].rotateOnWorldAxis(yAxis, rot);
      curr = [cubes[i].position.x, cubes[i].position.z];
      const coord = getNewCoordinates(curr, dir, rot);
      cubes[i].position.x = coord[0];
      cubes[i].position.z = coord[1];
    }
    else {
      cubes[i].rotateOnWorldAxis(zAxis, rot);
      const curr = [cubes[i].position.x, cubes[i].position.y];
      const coord = getNewCoordinates(curr, dir, rot);
      cubes[i].position.x = coord[0];
      cubes[i].position.y = coord[1];
    }
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
  const a = new AxesHelper(10) //x:red y:green, z:blue
  scene.add(ambientLight, a);

  controls = new OrbitControls(camera, renderer.domElement);

  for(let i = -1; i < 2; i++){
    for(let j = -1; j < 2; j ++){
      for(let k = -1; k < 2; k ++){
        generateCubes(i,j,k);
      }
    }
  };

  window.addEventListener('keypress', (keypress) => {
    console.log(keypress.key);
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
