import * as THREE from "three";

// These constants maybe replaced later on
const portalMaterial = new THREE.MeshBasicMaterial({ color: 0xaabfab });
const portalSide = new THREE.BoxBufferGeometry(0.2, 1, 0.2);
const portalTop = new THREE.BoxBufferGeometry(1, 0.2, 0.2);
const yPosition = 0.5;

export function createRightMesh(x, z) {
  const portalMesh = new THREE.Mesh(portalSide, portalMaterial);
  portalMesh.position.z = z;
  portalMesh.position.y = yPosition;
  portalMesh.position.x = x - 0.3;
  return portalMesh;
}

export function createLeftMesh(x, z) {
  const portalMesh = new THREE.Mesh(portalSide, portalMaterial);
  portalMesh.position.z = z;
  portalMesh.position.y = yPosition;
  portalMesh.position.x = x + 0.3;
  return portalMesh;
}

export function createTopMesh(x, z) {
  const portalMesh = new THREE.Mesh(portalTop, portalMaterial);
  portalMesh.position.z = z;
  portalMesh.position.y = yPosition + 0.5;
  portalMesh.position.x = x;
  return portalMesh;
}
