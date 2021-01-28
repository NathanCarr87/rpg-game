// Import stylesheets
import "./style.css";
import * as THREE from "three";
import {
  createRightMesh,
  createLeftMesh,
  createTopMesh
} from "./src/creator/create-portal.js";
// import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

var camera, scene, renderer, mesh, goal, keys, follow;

var time = 0;
var newPosition = new THREE.Vector3();
var matrix = new THREE.Matrix4();

var stop = 1;
var DEGTORAD = 0.01745327;
var temp = new THREE.Vector3();
var dir = new THREE.Vector3();
var a = new THREE.Vector3();
var b = new THREE.Vector3();
var coronaSafetyDistance = 0.3;
var velocity = 0.0;
var speed = 0.0;

init();
animate();

function init() {
  console.log(new THREE.BoxHelper());

  renderer = new THREE.WebGLRenderer({ antialias: true });

  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.01,
    10
  );
  // const controls = new OrbitControls(camera, renderer.domElement);

  camera.position.set(0, 0.3, -1.5);

  scene = new THREE.Scene();
  camera.lookAt(scene.position);

  // Create Portal Start
  const zPosition = 1.9;
  const xPosition = 3.5;
  const rightMesh = createRightMesh(xPosition, zPosition);
  const leftMesh = createLeftMesh(xPosition, zPosition);
  const topMesh = createTopMesh(xPosition, zPosition);

  scene.add(rightMesh);
  scene.add(leftMesh);
  scene.add(topMesh);

  var geometry = new THREE.BoxBufferGeometry(0.2, 0.2, 0.2);
  var material = new THREE.MeshBasicMaterial({ color: 0xffff00 });

  mesh = new THREE.Mesh(geometry, material);
  mesh.position.y = 0.1;

  goal = new THREE.Object3D();
  follow = new THREE.Object3D();
  goal.position.z = -coronaSafetyDistance;
  goal.add(camera);
  scene.add(mesh);

  // var gridHelper = new THREE.GridHelper(40, 40);
  // scene.add(gridHelper);

  test(scene);

  renderer.setClearColor(0x567ebf);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  keys = {
    a: false,
    s: false,
    d: false,
    w: false
  };
  document.body.addEventListener("keydown", function(e) {
    var key = e.code.replace("Key", "").toLowerCase();
    if (keys[key] !== undefined) keys[key] = true;
  });
  document.body.addEventListener("keyup", function(e) {
    var key = e.code.replace("Key", "").toLowerCase();
    if (keys[key] !== undefined) keys[key] = false;
  });
}

function test(scene) {
  const geometry = new THREE.PlaneGeometry(40, 40, 40);
  const material = new THREE.MeshBasicMaterial({
    color: 0x34c237,
    side: THREE.DoubleSide
  });
  const plane = new THREE.Mesh(geometry, material);
  plane.rotation.x = -Math.PI / 2;
  scene.add(plane);
}

function animate() {
  requestAnimationFrame(animate);

  speed = 0.0;

  if (keys.w) speed = 0.02;
  else if (keys.s) speed = -0.02;

  velocity += (speed - velocity) * 0.3;
  mesh.translateZ(velocity);

  if (keys.a) mesh.rotateY(0.05);
  else if (keys.d) mesh.rotateY(-0.05);

  a.lerp(mesh.position, 0.4);
  b.copy(goal.position);

  dir
    .copy(a)
    .sub(b)
    .normalize();
  const dis = a.distanceTo(b) - coronaSafetyDistance;
  goal.position.addScaledVector(dir, dis);
  //temp.setFromMatrixPosition(goal.matrixWorld);

  //camera.position.lerp(temp, 0.2);
  camera.lookAt(mesh.position);

  renderer.render(scene, camera);
}
