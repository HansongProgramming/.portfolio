import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { BokehPass } from 'three/examples/jsm/postprocessing/BokehPass.js'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { Box3Helper } from 'three';
import { mod } from 'three/src/nodes/TSL.js';

//📝 === Scene Setup ===
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);
const promptDiv = document.getElementById('interactionPrompt');
const overlayDiv = document.getElementById('laptopOverlay');
const overlayDiv2 = document.getElementById('cameraScreen');
const overlayDiv3 = document.getElementById('tvScreen');

//📝  === Postprocessing: Bloom Setup ===
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  0.2,   
  0.1,
  0.85   
);

const bokehPass = new BokehPass(scene, camera, {
  focus: 8.0,           // distance from camera to focus point
  aperture: 0.00001,     // smaller = more depth of field blur
  maxblur: 0.01,         // how blurry it can get
  width: window.innerWidth,
  height: window.innerHeight
});
composer.addPass(bokehPass);

composer.addPass(bloomPass);

function updateBokehSettings(focus, aperture, maxblur) {
  bokehPass.uniforms['focus'].value = focus;
  bokehPass.uniforms['aperture'].value = aperture;
  bokehPass.uniforms['maxblur'].value = maxblur;
}


// ! === Lighting ===

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// 📝 Ambient
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
ambientLight.position.set(0,10,0)
scene.add(ambientLight);

// 📝 Key
const key = new THREE.DirectionalLight(0xf59d28, 0.5);
key.position.set(3,5,5)
key.castShadow = true;
key.shadow.mapSize.width = 1024; 
key.shadow.mapSize.height = 1024;
key.shadow.bias = -0.001;
scene.add(key)

const spotLight = new THREE.SpotLight(0xffdcad, 5);
spotLight.position.set(0,15,10)
spotLight.castShadow = true;
spotLight.angle = Math.PI / 6;       
spotLight.penumbra = 1;        
spotLight.decay = 0;                 
spotLight.distance = 50;    
scene.add(spotLight);

// 📝 Points
const lamp1 = new THREE.PointLight(0xf59d28, 5, 50, 5);
lamp1.position.set(6.5,1,-3)
scene.add(lamp1);

const lamp2 = new THREE.PointLight(0xf59d28, 5, 50, 5);
lamp2.position.set(-5.5,1,-5)
scene.add(lamp2);

const largeLampLeft = new THREE.PointLight(0xf59d28, 5, 50, 5);
largeLampLeft.position.set(-7, 7.5, 0)
scene.add(largeLampLeft);

const largeLampRight = new THREE.PointLight(0xf59d28, 5, 50, 5);
largeLampRight.position.set(6.5, 7.5, 0)
scene.add(largeLampRight);

const largeLampLeft2 = new THREE.PointLight(0xf59d28, 5, 50, 5);
largeLampLeft2.position.set(-7, 7.5, -7.6)
scene.add(largeLampLeft2);

const largeLampRight2 = new THREE.PointLight(0xf59d28, 5, 50, 5);
largeLampRight2.position.set(6.5, 7.5, -7.6)
scene.add(largeLampRight2);

function setupCollidable(object, isPushable = false) {
  const box = new THREE.Box3().setFromObject(object);
  boundingBoxes.set(object, box);
  if (isPushable) {
    pushables.push(object);
  } else {
    collidables.push(object);
  }
}


// ! === Load GLTF Model ===
let model, mixer,bg,plant,laptop,cam,chair, roomba,tv,tvstand;
let cameraFollow = true;
let animations = {};
let currentAction = null;
let idleClipName = null;
const collidables = [];
const pushables = [];
const boundingBoxes = new Map();

// 📝 Background
const backwall = new THREE.Mesh(
  new THREE.BoxGeometry(15, 5, 0),
  new THREE.MeshBasicMaterial({ visible: false })
);
backwall.position.set(0, 0, -8);
scene.add(backwall);

setupCollidable(backwall, false);

const frontwall = new THREE.Mesh(
  new THREE.BoxGeometry(15, 5, 0),
  new THREE.MeshBasicMaterial({ visible: false })
);
frontwall.position.set(0, 0, 8);
scene.add(frontwall);

setupCollidable(frontwall, false);

const leftwall = new THREE.Mesh(
  new THREE.BoxGeometry(0, 5, 15),
  new THREE.MeshBasicMaterial({ visible: false })
);
leftwall.position.set(-8, 0, 0);
scene.add(leftwall);

setupCollidable(leftwall, false);

const rightwall = new THREE.Mesh(
  new THREE.BoxGeometry(0, 5, 15),
  new THREE.MeshBasicMaterial({ visible: false })
);
rightwall.position.set(7.5, 0, 0);
scene.add(rightwall);

setupCollidable(rightwall, false);

const bgloader = new  GLTFLoader();
bgloader.load('./animations/background.glb', (gltf) => {
  bg = gltf.scene;
  bg.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  scene.add(bg);
})

// 📝 Plant

const plantLoader = new  GLTFLoader();
plantLoader.load('./animations/plants.glb', (gltf) => {
  plant = gltf.scene;
  plant.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  scene.add(plant);
})

//📝 Laptop

const invisibleBox = new THREE.Mesh(
  new THREE.BoxGeometry(1.6, 1.6, 1.6),
  new THREE.MeshBasicMaterial({ visible: false })
);
invisibleBox.position.set(-5.1, 0.5, -2);
scene.add(invisibleBox);

setupCollidable(invisibleBox, false);

const laptoploader = new  GLTFLoader();
laptoploader.load('./animations/laptopTable.glb', (gltf) => {
  laptop = gltf.scene;
  laptop.position.set(-5.1,0,-2);
  laptop.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  scene.add(laptop);
})

// 📝Camera

const camCollision = new THREE.Mesh(
  new THREE.BoxGeometry(2, 2, 2),
  new THREE.MeshBasicMaterial({ visible: false })
);
camCollision.position.set(3.5, 0, -4);
scene.add(camCollision);

setupCollidable(camCollision, false);

const camloader = new  GLTFLoader();
camloader.load('./animations/camTable.glb', (gltf) => {
  cam = gltf.scene;
  cam.position.set(3.5,0,-3)
  cam.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  scene.add(cam);
})

//📝  Chair
const chairCollision = new THREE.Mesh(
  new THREE.BoxGeometry(5, 2, 2),
  new THREE.MeshBasicMaterial({ visible: false })
);
chairCollision.position.set(-1.5, 0, -5.5);
scene.add(chairCollision);

setupCollidable(chairCollision, false);

const chairloader = new  GLTFLoader();
chairloader.load('./animations/chair.glb', (gltf) => {
  chair = gltf.scene;
  chair.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  scene.add(chair);
})

const tvloader = new  GLTFLoader();
tvloader.load('./animations/tv.glb', (gltf) => {
  tv = gltf.scene;
  tv.position.set(-8, 6, 4)
  tv.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  scene.add(tv);
})

const tvstandloader = new  GLTFLoader();
tvstandloader.load('./animations/tvstand.glb', (gltf) => {
  tvstand = gltf.scene;
  tvstand.position.set(-7, 0, 5)
  tvstand.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  scene.add(tvstand);
})


//📝 Lamp

const hanglamploader = new GLTFLoader();
hanglamploader.load('./animations/lampHanging.glb', (gltf) => {
  const originalLamp = gltf.scene;

  const basePosition = new THREE.Vector3(-8, 7.4, 8);
  originalLamp.position.copy(basePosition);

  originalLamp.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  const rows = 3;      
  const columns = 2;   
  const spacingX = 13.5;  
  const spacingY = 8;  

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const lampClone = originalLamp.clone(true);

      lampClone.position.set(
        basePosition.x + col * spacingX,      
        basePosition.y ,      
        basePosition.z - row * spacingY                     
      );

      scene.add(lampClone);
    }
  }
});

// 📝 Character

const loader = new GLTFLoader();
loader.load('./animations/hans.glb', (gltf) => {
  model = gltf.scene;

  model.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

//📝  bot

const roombaLoader = new GLTFLoader();
roombaLoader.load('./animations/bot.glb', (gltf) => {

  roomba = gltf.scene;

  roomba.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
    scene.add(roomba);

  });
})

  
// ! overlay div
  model.position.set(-2, 0, 0);
  model.scale.set(1, 1, 1);
  scene.add(model);

  mixer = new THREE.AnimationMixer(model);
  gltf.animations.forEach(clip => {
    animations[clip.name.toLowerCase()] = clip;
    console.log('Loaded animation:', clip.name);
  });

  idleClipName = Object.keys(animations).find(name => name.includes('idle'));
  if (idleClipName) {
    const action = mixer.clipAction(animations[idleClipName]);
    action.play();
    currentAction = idleClipName;
  } else {
    console.warn("No 'idle' animation found.");
  }
  
}, undefined, error => {
  console.error("Error loading model:", error);
});


// 📝 === Camera Position ===
camera.position.set(0, 6, 10);
camera.lookAt(0, 0, 0);

// ! 📝 === Input Handling ===

const keys = {};
document.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
document.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);
document.addEventListener('keydown', e => {
  if (e.code === 'Space' && isNear(model, laptop)) {
    e.preventDefault();
    overlayDiv.style.display = 'block';
    cameraFollow = false;
    const targetPos = new THREE.Vector3(-4, 1.5, 0);
    const targetLookAt = new THREE.Vector3(-8, 2, -30);
    updateBokehSettings(2, 0.01, 0.02);
    let progress = 0;
    const update = () => {
      camera.position.lerp(targetPos, progress);
      camera.lookAt(targetLookAt);
      if (progress < 1) { progress += 0.02; requestAnimationFrame(update); }
    };
    update();
  } else if (e.code === 'Space' && isNear(model, cam)) {
    e.preventDefault();
    overlayDiv2.style.display = 'block';
    cameraFollow = false;
    const targetPos = new THREE.Vector3(5, 2.7, -5);
    const targetLookAt = new THREE.Vector3(-3, 2, -3);
    updateBokehSettings(1.5, 0.01, 0.02);
    let progress = 0;
    const update = () => {
      camera.position.lerp(targetPos, progress);
      camera.lookAt(targetLookAt);
      if (progress < 1) { progress += 0.02; requestAnimationFrame(update); }
    };
    update();
  } else if (e.code === 'Space' && isNear(model, tvstand)) {
    e.preventDefault();
    overlayDiv3.style.display = 'block';
    cameraFollow = false;
    const targetPos = new THREE.Vector3(-3, 0, 5);
    const targetLookAt = new THREE.Vector3(-15, 6, 0);
    updateBokehSettings(1.5, 0.01, 0.02);
    let progress = 0;
    const update = () => {
      camera.position.lerp(targetPos, progress);
      camera.lookAt(targetLookAt);
      if (progress < 1) { progress += 0.02; requestAnimationFrame(update); }
    };
    update();
  }
});
document.addEventListener('keydown', e => {
  if (e.code === 'Escape') {
    overlayDiv.style.display = 'none';
    overlayDiv2.style.display = 'none';
    cameraFollow = true;
  }
});

function setAnimation(name) {
  if (!mixer || !animations[name]) return;
  if (currentAction === name) return;

  const next = mixer.clipAction(animations[name]);
  if (currentAction) {
    const prev = mixer.clipAction(animations[currentAction]);
    prev.fadeOut(0.4);
  }
  next.reset().fadeIn(0.4).play();
  currentAction = name;
}

function handleMovement(delta) {
  const speed = 10;
  if (!model) return;

  // Character movement (WASD)
  const direction = new THREE.Vector3();
  if (keys['w']) direction.z -= 1;
  if (keys['s']) direction.z += 1;
  if (keys['a']) direction.x -= 1;
  if (keys['d']) direction.x += 1;

  if (direction.lengthSq() === 0) {
    if (idleClipName) setAnimation(idleClipName);
  } else {
    setAnimation('walk');

    direction.normalize();
    const move = direction.clone().multiplyScalar(speed * delta);
    const newPos = model.position.clone().add(move);

    const modelBox = new THREE.Box3().setFromObject(model).translate(move);

    let collided = false;

    for (const obj of collidables) {
      const box = boundingBoxes.get(obj);
      if (box && modelBox.intersectsBox(box)) {
        collided = true;
        break;
      }
    }

    if (!collided) {
      let pushed = false;

      for (const obj of pushables) {
        const box = boundingBoxes.get(obj);
        if (box && modelBox.intersectsBox(box)) {
          obj.position.add(move);

          const updatedBox = new THREE.Box3().setFromObject(obj);
          boundingBoxes.set(obj, updatedBox);

          pushed = true;
          break;
        }
      }

      model.position.add(move);
    }

    const angle = Math.atan2(direction.x, direction.z);
    const targetQuat = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), angle);
    model.quaternion.slerp(targetQuat, 0.3);
  }

  // Roomba movement (Arrow Keys)
  if (roomba) {
    const roombaSpeed = speed * delta;
    if (keys['arrowup']) roomba.position.z -= roombaSpeed;
    if (keys['arrowdown']) roomba.position.z += roombaSpeed;
    if (keys['arrowleft']) roomba.position.x -= roombaSpeed;
    if (keys['arrowright']) roomba.position.x += roombaSpeed;
  }
}


function isNear(object1, object2, distance = 2) {
  if (!object1 || !object2) return false;
  const pos1 = object1.position;
  const pos2 = object2.position;
  return pos1.distanceTo(pos2) < distance;
}

// 📝 === Render Loop ===

const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta();
  handleMovement(delta);

  boundingBoxes.forEach((box, obj) => {
    box.copy(new THREE.Box3().setFromObject(obj));
  });
  
  
  if (mixer) mixer.update(delta);

  if (model) {
    if (cameraFollow) {
      const cameraOffset = new THREE.Vector3(0, 6, 10);
      const cameraTarget = model.position.clone().add(cameraOffset);
      camera.position.lerp(cameraTarget, 0.1);
      camera.lookAt(model.position);
    }
  
    if (isNear(model, laptop) || isNear(model, cam) || isNear(model, tvstand)) {
      promptDiv.style.display = 'block';
    } else {
      promptDiv.style.display = 'none';
      overlayDiv.style.display = 'none';
      overlayDiv2.style.display = 'none';
      overlayDiv3.style.display = 'none';
      cameraFollow = true;
      updateBokehSettings(8.0, 0.00001, 0.01);
    }
  }
  

  composer.render();
}

animate();

// 📝 === Responsive Resize ===
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
