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
const genratePlanet = (size, planetTexture, x, ring, name) => {
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

  planetObj.add(planet);// Add the whole object to the scene
  createLineLoopWithMesh(x, 0xffffff, 3);
  return {
    planetObj: planetObj,
    planet: planet,
    planetName: name // Assign the planet name here
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
const planetInfos = [
  {
    name: "Mercury",
    diameter: "4,880 km",
    distanceFromSun: "57.91 million km",
    description: "Mercury is the smallest planet in our solar system.",
  },
  {
    name: "Venus",
    diameter: "12,104 km",
    distanceFromSun: "108.2 million km",
    description: "Venus is known as Earth's twin because of their similar size.",
  },
  {
    name: "Earth",
    diameter: "12,742 km",
    distanceFromSun: "149.6 million km",
    description: "Earth is the only planet known to support life.",
  },
  {
    name: "Mars",
    diameter: "6,779 km",
    distanceFromSun: "227.9 million km",
    description: "Mars is known as the Red Planet due to its reddish appearance.",
  },
  {
    name: "Jupiter",
    diameter: "139,820 km",
    distanceFromSun: "778.5 million km",
    description: "Jupiter is the largest planet in our solar system.",
  },
  {
    name: "Saturn",
    diameter: "116,460 km",
    distanceFromSun: "1.434 billion km",
    description: "Saturn is famous for its beautiful rings.",
  },
  {
    name: "Uranus",
    diameter: "50,724 km",
    distanceFromSun: "2.871 billion km",
    description: "Uranus has a unique rotation, spinning on its side.",
  },
  {
    name: "Neptune",
    diameter: "49,244 km",
    distanceFromSun: "4.495 billion km",
    description: "Neptune is known for its deep blue color.",
  },
  {
    name: "Pluto",
    diameter: "2,377 km",
    distanceFromSun: "5.906 billion km",
    description: "Pluto is classified as a dwarf planet.",
  },
];

function showInfo(planetName) {
  const planetData = planetInfos.find(info => info.name === planetName);
  
  if (planetData) {
    const message = `
      Name: ${planetData.name}
      Diameter: ${planetData.diameter}
      Distance from Sun: ${planetData.distanceFromSun}
      Description: ${planetData.description}
    `;
    alert(message);
  }
}

  // You can expand this with more detailed info.

window.addEventListener('click', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(planets.map(p => p.planet));

  if (intersects.length > 0) {
    const planet = intersects[0].object;
    const planetData = planets.find(p => p.planet === planet);
    if (planetData) {
      showInfo(planetData.planetName); // Safely retrieve the planet name
    }
  }
});

