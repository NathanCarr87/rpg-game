// Import stylesheets
import "./style.css";
import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";

// Write Javascript code!
const appDiv = document.getElementById("app");
appDiv.innerHTML = `<h1>JS Starter</h1>`;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 2.5, 2.5);
camera.lookAt(new THREE.Vector3(0, 0, 0));
const renderer = new THREE.WebGLRenderer();

const geometry = new THREE.PlaneGeometry(5, 20, 32);
const material = new THREE.MeshBasicMaterial({
  color: 0xffff00,
  side: THREE.DoubleSide
});
const plane = new THREE.Mesh(geometry, material);
plane.rotateX(90);
scene.add(plane);

camera.position.z = 5;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// instantiate a loader
const loader = new OBJLoader();

// load a resource
loader.load(
  // resource URL
  "assets/chr_sword.obj",
  // called when resource is loaded
  function(object) {
    console.log("success", object);
    scene.add(object);
  },
  // called when loading is in progresses
  function(xhr) {
    console.log((xhr.loaded / xhr.total) * 100 + "% loaded");
  },
  // called when loading has errors
  function(error) {
    console.log("An error happened");
  }
);

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
