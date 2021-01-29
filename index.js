// These are ES6 import statements
// THREE js is the library that creates 3D models in the browser
// https://threejs.org/
import * as THREE from "three";
// These are scripts I import from other files, it is not required but
// seperating code helps to keep you
import {
  createRightMesh,
  createLeftMesh,
  createTopMesh
} from "./src/creator/create-portal.js";
// These are commented out for now, but I know I need them both in the future
// import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// Variables
var camera, scene, renderer, mesh, goal, keys, follow;

var dir = new THREE.Vector3();
var a = new THREE.Vector3();
var b = new THREE.Vector3();
var coronaSafetyDistance = 0.3;
var velocity = 0.0;
var speed = 0.0;

// An array to put meshes in so we can check for collisions later
const otherCollisionBoxes = [];
const treasureCollisionBoxes = [];
const planeWidth = 15;
const planeDepth = 15;
const COLLECTABLE = "COLLECTABLE";

// Calling the functions to run the game
init();
animate();

function init() {
  // Renderer from three js. This will render all the graphics
  // https://threejs.org/docs/#api/en/renderers/WebGLRenderer
  renderer = new THREE.WebGLRenderer({ antialias: true });

  // Perspective Camera, there are multiple cameras
  // https://threejs.org/docs/#api/en/cameras/PerspectiveCamera
  camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.01,
    10
  );

  // Setting the position far enough behind the player to see the whole scene
  camera.position.set(0, 0.3, -1.5);

  // Scene: the object that holds all the meshes
  // https://threejs.org/docs/#api/en/scenes/Scene
  scene = new THREE.Scene();

  // aiming the camera
  camera.lookAt(scene.position);

  createPlane(scene);
  createPlayer();

  // Create Portal Start
  const zPosition = 1.9;
  const xPosition = 3.5;
  const rightMesh = createRightMesh(xPosition, zPosition);
  const leftMesh = createLeftMesh(xPosition, zPosition);
  const topMesh = createTopMesh(xPosition, zPosition);

  // only adding the right and left sides to the collition check... no flying!
  otherCollisionBoxes.push(rightMesh);
  otherCollisionBoxes.push(leftMesh);

  scene.add(rightMesh);
  scene.add(leftMesh);
  scene.add(topMesh);

  goal = new THREE.Object3D();
  follow = new THREE.Object3D();
  goal.position.z = -coronaSafetyDistance;
  goal.add(camera);

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

function createPlayer() {
  // This is the player geometry
  // Will eventually be replaced by a loaded 3D model
  var geometry = new THREE.BoxBufferGeometry(0.2, 0.2, 0.2);
  var material = new THREE.MeshBasicMaterial({ color: 0xffffff });

  mesh = new THREE.Mesh(geometry, material);
  mesh.position.y = 0.1;
  mesh.name = "PLAYER";
  scene.add(mesh);
}

function spawnRandomTreasure() {
  setTimeout(function() {
    createTreasure();
  }, 3000);
}

function createTreasure() {
  // This is the treasure geometry
  // Will eventually be replaced by a loaded 3D model
  var geometry = new THREE.BoxBufferGeometry(0.1, 0.1, 0.01);
  var material = new THREE.MeshBasicMaterial({ color: 0xffff00 });

  let treasureMesh = new THREE.Mesh(geometry, material);
  treasureMesh.position.y = 0.2;
  treasureMesh.position.z = 1.2;
  treasureMesh.rotation.z = -Math.PI / 4;
  treasureMesh.name = COLLECTABLE;
  // console.log(treasureMesh);
  treasureCollisionBoxes.push(treasureMesh);
  scene.add(treasureMesh);
}

function createPlane(scene) {
  const geometry = new THREE.PlaneGeometry(planeWidth, planeDepth, 40);
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
  let playerCollisionBox = new THREE.Box3(
    new THREE.Vector3(),
    new THREE.Vector3()
  );
  playerCollisionBox.setFromObject(mesh);

  speed = 0.0;

  if (keys.w) speed = 0.02;
  else if (keys.s) speed = -0.02;

  velocity += (speed - velocity) * 0.3;
  otherCollisionBoxes.forEach(meshBox => {
    const collisionBox = new THREE.Box3(
      new THREE.Vector3(),
      new THREE.Vector3()
    );
    collisionBox.setFromObject(meshBox);
    if (playerCollisionBox.intersectsBox(collisionBox)) {
      velocity = -1 * velocity;
    }
  });

  if (treasureCollisionBoxes.length > 0) {
    treasureCollisionBoxes.forEach(treasureMeshBox => {
      const treasureCollisionBox = new THREE.Box3(
        new THREE.Vector3(),
        new THREE.Vector3()
      );
      treasureCollisionBox.setFromObject(treasureMeshBox);
      if (playerCollisionBox.intersectsBox(treasureCollisionBox)) {
        const removeMesh = scene.getObjectByProperty(
          "uuid",
          treasureMeshBox.uuid
        );
        treasureCollisionBoxes.pop();
        removeMesh.geometry.dispose();
        removeMesh.material.dispose();
        scene.remove(removeMesh);
      }
    });
  }
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

  camera.lookAt(mesh.position);

  renderer.render(scene, camera);
}
