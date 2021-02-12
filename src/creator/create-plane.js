import * as THREE from "three";

export function createPlane() {
  const planeWidth = 15;
  const planeDepth = 15;
  const geometry = new THREE.PlaneGeometry(planeWidth, planeDepth, 40);
  const material = new THREE.MeshBasicMaterial({
    color: 0x34c237,
    side: THREE.DoubleSide
  });
  const plane = new THREE.Mesh(geometry, material);
  plane.rotation.x = -Math.PI / 2;
  return plane;
}
