import * as THREE from "https://unpkg.com/three@0.127.0/build/three.module.js";
import { OrbitControls } from "https://unpkg.com/three@0.127.0/examples/jsm/controls/OrbitControls.js";
//import * as THREE from 'three';
//import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';



//Creating renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// texture loader
const textureLoader = new THREE.TextureLoader();



//load all texture
const starTexture = textureLoader.load("./img/stars.jpg");
const sunTexture = textureLoader.load("./img/sun.jpg");
const mercuryTexture = textureLoader.load("./img/mercury.jpg");
const venusTexture = textureLoader.load("./img/venus.jpg");
const earthTexture = textureLoader.load("./img/earth.jpg");
const marsTexture = textureLoader.load("./img/mars.jpg");
const jupiterTexture = textureLoader.load("./img/jupiter.jpg");
const saturnTexture = textureLoader.load("./img/saturn.jpg");
const uranusTexture = textureLoader.load("./img/uranus.jpg");
const neptuneTexture = textureLoader.load("./img/neptune.jpg");
const plutoTexture = textureLoader.load("./img/pluto.jpg");
const saturnRingTexture = textureLoader.load("./img/saturn ring.png");
const uranusRingTexture = textureLoader.load("./img/uranus ring.png");

// Creating scene
const scene = new THREE.Scene();

//screen bg
//const cubeTextureLoader = new THREE.CubeTextureLoader();
//const cubeTexture = cubeTextureLoader.load([
  //starTexture,
  //starTexture,
  //starTexture,
  //starTexture,
  //starTexture,
//  starTexture,
//]);
//scene.background = cubeTexture;
const spaceTexture = new THREE.TextureLoader().load('space.jpg');
scene.background = spaceTexture;

//Perspective Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(-50, 90, 150);

// Percpective controll
const orbit = new OrbitControls(camera, renderer.domElement);

//sun
const sungeo = new THREE.SphereGeometry(15, 50, 50);
const sunMaterial = new THREE.MeshBasicMaterial({
  map: sunTexture,
});
const sun = new THREE.Mesh(sungeo, sunMaterial);
scene.add(sun);

const sunLight = new THREE.PointLight(0xffffff, 4, 300);
scene.add(sunLight);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

//ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0);
scene.add(ambientLight);


//path for planet
const path_of_planets = [];
function createLineLoopWithMesh(radius, color, width) {
  const material = new THREE.LineBasicMaterial({
    color: color,
    linewidth: width,
  });
  const geometry = new THREE.BufferGeometry();
  const lineLoopPoints = [];

  // Calculate points for the circular path
  const numSegments = 100; // Number of segments to create the circular path
  for (let i = 0; i <= numSegments; i++) {
    const angle = (i / numSegments) * Math.PI * 2;
    const x = radius * Math.cos(angle);
    const z = radius * Math.sin(angle);
    lineLoopPoints.push(x, 0, z);
  }

  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(lineLoopPoints, 3)
  );
  const lineLoop = new THREE.LineLoop(geometry, material);
  scene.add(lineLoop);
  path_of_planets.push(lineLoop);
}



//create planet
const genratePlanet = (size, planetTexture, x, ring,planetName) => {
  const planetGeometry = new THREE.SphereGeometry(size, 50, 50);
  const planetMaterial = new THREE.MeshStandardMaterial({
    map: planetTexture,
  });
  const planet = new THREE.Mesh(planetGeometry, planetMaterial);
  const planetObj = new THREE.Object3D();
  planet.position.set(x, 0, 0);
  if (ring) {
    const ringGeo = new THREE.RingGeometry(
      ring.innerRadius,
      ring.outerRadius,
      32
    );
    const ringMat = new THREE.MeshBasicMaterial({
      map: ring.ringmat,
      side: THREE.DoubleSide,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    planetObj.add(ringMesh);
    ringMesh.position.set(x, 0, 0);
    ringMesh.rotation.x = -0.5 * Math.PI;
  }
  scene.add(planetObj);

  planetObj.add(planet);
  createLineLoopWithMesh(x, 0xffffff, 3);
  return {
    planetObj: planetObj,
    planet: planet,
    planetname: planetName
  };
};
const planetNames = [
  "Mercury",
  "Venus",
  "Earth",
  "Mars",
  "Jupiter",
  "Saturn",
  "Uranus",
  "Neptune",
  "Pluto"
];
const planets = [
  {
    ...genratePlanet(3.2, mercuryTexture, 28,null,planetNames[0]),
    rotaing_speed_around_sun: 0.016,
    self_rotation_speed: 0.004,
  },
  {
    ...genratePlanet(5.8, venusTexture, 44, null, planetNames[1]),
    rotaing_speed_around_sun: 0.0117,
    self_rotation_speed: 0.002,
  },
  {
    ...genratePlanet(6, earthTexture, 62, null, planetNames[2]),
    rotaing_speed_around_sun: 0.01,
    self_rotation_speed: 0.02,
  },
  {
    ...genratePlanet(4, marsTexture, 78, null, planetNames[3]),
    rotaing_speed_around_sun: 0.008,
    self_rotation_speed: 0.018,
  },
  {
    ...genratePlanet(12, jupiterTexture, 100, null, planetNames[4]),
    rotaing_speed_around_sun: 0.00434,
    self_rotation_speed: 0.04,
  },
  {
    ...genratePlanet(10, saturnTexture, 138, {
      innerRadius: 10,
      outerRadius: 20,
      ringmat: saturnRingTexture,
    }, planetNames[5]),
    rotaing_speed_around_sun: 0.00323,
    self_rotation_speed: 0.038,
  },
  {
    ...genratePlanet(7, uranusTexture, 176, {
      innerRadius: 7,
      outerRadius: 12,
      ringmat: uranusRingTexture,
    }, planetNames[6]),
    rotaing_speed_around_sun: 0.00228,
    self_rotation_speed: 0.03,
  },
  {
    ...genratePlanet(7, neptuneTexture, 200, null, planetNames[7]),
    rotaing_speed_around_sun: 0.00192,
    self_rotation_speed: 0.032,
  },
  {
    ...genratePlanet(2.8, plutoTexture, 216, null, planetNames[8]),
    rotaing_speed_around_sun: 0.0007,
    self_rotation_speed: 0.008,
  },
]



//GUI options
var GUI = dat.gui.GUI;
const gui = new GUI();
const options = {
  "Real view": true,
  "Show path": true,
  speed: 1,
};
gui.add(options, "Real view").onChange((e) => {
  ambientLight.intensity = e ? 0 : 0.5;
});
gui.add(options, "Show path").onChange((e) => {
  path_of_planets.forEach((dpath) => {
    dpath.visible = e;
  });
});
const maxSpeed = new URL(window.location.href).searchParams.get("ms")*1
gui.add(options, "speed", 0, maxSpeed?maxSpeed:20);






// animate function
function animate(time) {
  sun.rotateY(options.speed * 0.004);
  planets.forEach(
    ({ planetObj, planet, rotaing_speed_around_sun, self_rotation_speed }) => {
      planetObj.rotateY(options.speed * rotaing_speed_around_sun);
      planet.rotateY(options.speed * self_rotation_speed);
    }
  );
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);


//resize camera view
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
})

function showInfo(planetName) {
  alert(`You clicked on ${planetName}. Here are some facts...`);
  // You can expand this with more detailed info.
}
window.addEventListener('click', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(planets.map(p => p.planet));

  if (intersects.length > 0) {
    const planet = intersects[0].object;
    const planetData = planets.find(p => p.planet === planet);
    showInfo(planetData.planetName); // Use planetName from the planetData
  }
});

