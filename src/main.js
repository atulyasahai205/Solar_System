import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import "./style.css";
import { GUI } from "dat.gui";

//CREATING OF SCENE
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  3000
);
camera.position.set(-70, 120, 400);

//CREATING OF RENDER
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("app").appendChild(renderer.domElement);

//CREATING ORBIT CONTROL
const orbitcontrol = new OrbitControls(camera, renderer.domElement);
orbitcontrol.enableDamping = true;
orbitcontrol.dampingFactor = 0.03;

//CREATING TEXTURE
const planet_texture = new THREE.TextureLoader();

const sunTexture = planet_texture.load("./sun.jpg");
const starTexture = planet_texture.load("./stars.jpg");
const mercuryTexture = planet_texture.load("./mercury.jpg");
const venusTexture = planet_texture.load("./venus.jpg");
const earthTexture = planet_texture.load("./earth.jpg");
const marsTexture = planet_texture.load("./mars.jpg");
const jupiterTexture = planet_texture.load("./jupiter.jpg");
const saturnTexture = planet_texture.load("./saturn.jpg");
const saturnRingsTexture = planet_texture.load("./saturn_rings.jpg");
const uranusTexture = planet_texture.load("./uranus.jpg");
const uranusRingeTexture = planet_texture.load("./UranusRing.jpg");
const neptuneTexture = planet_texture.load("./neptune.jpg");

//CREATING OF SUN
const sunGeometry = new THREE.IcosahedronGeometry(50, 12);
const sunMaterial = new THREE.MeshStandardMaterial({
  map: sunTexture,
});
const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sunMesh);

//SUN LIGHT
const Light = new THREE.PointLight(0x000000, 8, 100);
scene.add(Light);

//Ambient light
const ambientlighht = new THREE.AmbientLight(0xffffff, 3);
scene.add(ambientlighht);

//CREATING OF PATH
const pathOfPlanets = [];

const createOrbit = (
  radius,
  color = 0xffffff,
  segments = 100,
  track = true
) => {
  const point = [];

  for (let i = 0; i <= segments; i++) {
    const theta = (i / segments) * Math.PI * 2;
    point.push(
      new THREE.Vector3(Math.cos(theta) * radius, 0, Math.sin(theta) * radius)
    );
  }
  const orbitGeometry = new THREE.BufferGeometry().setFromPoints(point);
  const orbitMaterial = new THREE.LineBasicMaterial({ color: color });
  const orbitMesh = new THREE.LineLoop(orbitGeometry, orbitMaterial);

  scene.add(orbitMesh);

  if (track) {
    pathOfPlanets.push(orbitMesh);
  }

  return orbitMesh;
};

//CREATING OF PLANET
const createPlanet = (radius, planetTexture, int, ring) => {
  const planetGeo = new THREE.SphereGeometry(radius, 50, 50);
  const planetMat = new THREE.MeshStandardMaterial({ map: planetTexture });
  const planetMesh = new THREE.Mesh(planetGeo, planetMat);

  const planetObj = new THREE.Object3D();

  planetMesh.position.set(int, 0, 0);

  //CREATING OF RING
  if (ring) {
    const ringGeo = new THREE.RingGeometry(
      ring.innerRadius,
      ring.outerRadius,
      40
    );
    const ringMat = new THREE.MeshBasicMaterial({
      map: ring.ringMat,
      side: THREE.DoubleSide,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    planetObj.add(ringMesh);
    ringMesh.position.set(int, 0, 0);
    ringMesh.rotation.x = -0.5 * Math.PI;
  }
  scene.add(planetObj);
  planetObj.add(planetMesh);

  createOrbit(int, 0xffffff, 300, true);

  return {
    planetObj: planetObj,
    planetMesh: planetMesh,
  };
};

//PLANET CREATION
const planets = [
  {
    pName: "Mercury",
    ...createPlanet(7.5, mercuryTexture, 75),
    rotatingAroundSun: 0.0028,
    planetRotation: 0.004,
  },

  {
    pName: "Venus",
    ...createPlanet(10, venusTexture, 98),
    rotatingAroundSun: 0.0018,
    planetRotation: 0.011,
  },

  {
    pName: "Earth",
    ...createPlanet(13, earthTexture, 132),
    rotatingAroundSun: 0.0032,
    planetRotation: 0.008,
  },

  {
    pName: "Mars",
    ...createPlanet(9.7, marsTexture, 163),
    rotatingAroundSun: 0.0024,
    planetRotation: 0.008,
  },

  {
    pName: "Jupiter",
    ...createPlanet(15.5, jupiterTexture, 205),
    rotatingAroundSun: 0.0038,
    planetRotation: 0.006,
  },

  {
    pName: "Saturn",
    ...createPlanet(11, saturnTexture, 250, {
      innerRadius: 9,
      outerRadius: 18,
      ringMat: saturnRingsTexture,
    }),
    rotatingAroundSun: 0.0028,
    planetRotation: 0.0013,
  },

  {
    pName: "Uranus",
    ...createPlanet(7.5, uranusTexture, 288, {
      innerRadius: 7,
      outerRadius: 12,
      ringMat: uranusRingeTexture,
    }),
    rotatingAroundSun: 0.003,
    planetRotation: 0.006,
  },

  {
    pName: "Neptune",
    ...createPlanet(6.5, neptuneTexture, 325),
    rotatingAroundSun: 0.0021,
    planetRotation: 0.007,
  },
];

//SLIDERS THROUGH DAT.GUI
const gui = new GUI();

planets.forEach((planet) => {
  const folder = gui.addFolder(planet.pName);
  folder
    .add(planet, "rotatingAroundSun", 0.0005, 0.04, 0.001)
    .name("Orbit Speed");
  folder
    .add(planet, "planetRotation", 0.0001, 0.1, 0.0001)
    .name("Planet Speed");
});

//Dark Mode
const setting = {
  DarkMode: true,
};

gui
  .add(setting, "DarkMode")
  .name("Dark Mode")
  .onChange((isdarkMode) => {
    if (isdarkMode) {
      scene.background = new THREE.Color(0x000000);
      document.body.style.backgroundColor = "#111";
      document.body.style.color = "#fff";
    } else {
      scene.background = new THREE.Color(0xf0f0f0);
      document.body.style.backgroundColor = "#fff";
      document.body.style.color = "#000";
    }
  });

scene.background = new THREE.Color(0x000000);

//STARS IN BACKGROUND
const starsGeo = new THREE.SphereGeometry(2000, 10, 10);
const starsMat = new THREE.MeshStandardMaterial({
  map: starTexture,
  side: THREE.BackSide,
});
const starMesh = new THREE.Mesh(starsGeo, starsMat);
scene.add(starMesh);

//ANIMATION

const clock = new THREE.Clock();

const animate = () => {
  const speed = clock.getDelta();

  requestAnimationFrame(animate);

  sunMesh.rotation.y += speed * 0.5;

  planets.forEach(
    ({ planetObj, planetMesh, rotatingAroundSun, planetRotation }) => {
      planetObj.rotateY(rotatingAroundSun * speed * 60);
      planetMesh.rotateY(planetRotation * speed * 60);
    }
  );

  orbitcontrol.update();
  renderer.render(scene, camera);
};

renderer.setAnimationLoop(animate);

animate();
