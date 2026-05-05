import * as THREE from "three";
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { MapControls } from 'three/addons/controls/MapControls.js';

// create some global variables that we can reference throughout our scene
let scene, renderer, camera;
let mouse, raycaster;
let room;
let desk;
let bunny;
let strawberry;
let libertyStatue;
let bean;
let tv;
let books;
let box;
let pony;
let bear;
let game;
let isHoveringBunny = false;
let isHoveringstrawberry = false;
let isHoveringlibertyStatue = false;
let isHoveringbean = false;
let isHoveringbooks = false;
let isHoveringtv = false;
let isHoveringbox = false;
let isHoveringpony = false;
let isHoveringbear = false;
let isHoveringgame = false;

// variables for camera zoom
let isZoomedIn = false;
let isResetting = false;
let targetCameraPos = new THREE.Vector3();
let targetLookAt = new THREE.Vector3();
const originalCameraPos = new THREE.Vector3(0, 7, 2);
const originalLookAt = new THREE.Vector3(0, 3, 0);

scene = new THREE.Scene();
scene.background = new THREE.Color(0xff00ff);

// create our camera and renderer
renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.shadowMap.enabled = true;
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const videoEl = document.createElement('video');
videoEl.src = 'static.mp4';
videoEl.loop = true;
videoEl.muted = true;
videoEl.play();
const videoTex = new THREE.VideoTexture(videoEl);

// set environment
new RGBELoader().load('qwantani_dusk_2_puresky_2k.hdr', function (envMap) {
    console.log('hdr environment map loaded!');
    envMap.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = envMap;
    scene.environment = envMap;

});

// load bunny model
new GLTFLoader().load('bunny.glb', function (model1) {
    bunny = model1.scene;
    bunny.scale.set(4, 4, 4);
    bunny.position.set(-3.7, 0, -3);
    bunny.rotation.y = Math.PI;
    scene.add(bunny);
    bunny.traverse(function (child) {
        if (child.isMesh) child.castShadow = true;
    });
});

// load room model
new GLTFLoader().load('Room.glb', function (model) {
    room = model.scene;
    room.scale.set(2, 2, 2);
    room.position.set(0, 0, 0);
    scene.add(room);
    room.traverse(function (child) {
        if (child.isMesh) child.receiveShadow = true;
    });
});

// load desk model
new FBXLoader().load('WoodWorkingDesk 1.fbx', function (model2) {
    desk = model2;
    desk.scale.set(0.025, 0.025, 0.025);
    desk.position.set(2, 0, -3.1);
    scene.add(desk);
    desk.traverse(function (child) {
        if (child.isMesh) child.castShadow = true;
    });
}, undefined, function(error) {
    console.error('FBX load error:', error);
});

// load jar model
new GLTFLoader().load('Jar.glb', function (model3) {
    strawberry = model3.scene;
    strawberry.scale.set(4, 4, 4);
    strawberry.position.set(3, 2, -3);
    scene.add(strawberry);
    strawberry.traverse(function (child) {
        if (child.isMesh) child.castShadow = true;
    });
});

// load liberty statue model
new GLTFLoader().load('statue_of_liberty.glb', function (model4) {
    libertyStatue = model4.scene;
    libertyStatue.scale.set(0.05, 0.05, 0.05);
    libertyStatue.position.set(3, -1.8, 3.2);
    libertyStatue.rotation.y = Math.PI / 2;
    scene.add(libertyStatue);
    libertyStatue.traverse(function (child) {
        if (child.isMesh) child.castShadow = true;
    });
});

// load bean model
new GLTFLoader().load('chicago_bean (1).glb', function (model5) {
    bean = model5.scene;
    bean.scale.set(0.13, 0.13, 0.13);
    bean.position.set(2, 0, 3.2);
    bean.rotation.y = Math.PI / 2;
    scene.add(bean);
    bean.traverse(function (child) {
        if (child.isMesh) {
            child.receiveShadow = true;
            child.castShadow = true;
            child.material = new THREE.MeshPhysicalMaterial({
                color: 0xffffff,
                metalness: 1.0,
                roughness: 0.0,
                reflectivity: 1,
                envMap: scene.environment,
                envMapIntensity: 2.0,
                vertexColors: false,
            });
            child.geometry.deleteAttribute('color');
        }
    });
});

// load books model
new FBXLoader().load('Books.fbx', function (model6) {
    books = model6;
    books.scale.set(0.02, 0.02, 0.02);
    books.position.set(-2.5, 0, -3.7);
    scene.add(books);
    books.traverse(function (child) {
        if (child.isMesh) {
            child.castShadow = true;
            child.material = new THREE.MeshStandardMaterial({ map: videoTex });
        }
    });
}, undefined, function(error) {
    console.error('FBX load error:', error);
});

// load box model
new GLTFLoader().load('box.glb', function (model7) {
    box = model7.scene;
    box.scale.set(4, 4, 4);
    box.position.set(-4, 0, 3.5);
    box.rotation.y = Math.PI / 2;
    scene.add(box);
    box.traverse(function (child) {
        if (child.isMesh) child.castShadow = true;
    });
});

// load pony model
new GLTFLoader().load('Pony.glb', function (model8) {
    pony = model8.scene;
    pony.scale.set(12, 12, 12);
    pony.position.set(-3.6, -0.1, 0);
    scene.add(pony);
    pony.traverse(function (child) {
        if (child.isMesh) child.castShadow = true;
    });
});

// load bear model
new GLTFLoader().load('IKEA.glb', function (model9) {
    bear = model9.scene;
    bear.scale.set(4, 4, 4);
    bear.position.set(0, 0, 0);
    scene.add(bear);
    bear.traverse(function (child) {
        if (child.isMesh) child.castShadow = true;
    });
});

// load game model
new GLTFLoader().load('3ds.glb', function (model10) {
    game = model10.scene;
    game.scale.set(4, 4, 4);
    game.position.set(-2.5, 0, 3.2);
    scene.add(game);
    game.traverse(function (child) { // ✅ fixed typo
        if (child.isMesh) child.castShadow = true;
    });
});

// load tv model
new FBXLoader().load('TV.fbx', function (model11) {
    tv = model11;
    tv.scale.set(0.0016, 0.0016, 0.0016);
    tv.position.set(-0.4, 0, 3);
    tv.rotation.y = Math.PI;
    scene.add(tv);
    tv.traverse(function (child) {
        if (child.isMesh) {
            child.castShadow = true;
            child.material = new THREE.MeshStandardMaterial({ map: videoTex });
        }
    });
}, undefined, function(error) {
    console.error('FBX load error:', error);
});

// create our camera
let aspectRatio = window.innerWidth / window.innerHeight;
camera = new THREE.PerspectiveCamera(90, aspectRatio, 0.1, 300);
camera.position.set(0, 7, 2);
camera.lookAt(0, 0, 0);

addObjects();
renderer.render(scene, camera);

// create orbit controls
let controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
controls.enableZoom = false;
controls.minPolarAngle = Math.PI / 4;
controls.maxPolarAngle = Math.PI / 2;
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.minDistance = 2;
controls.maxDistance = 2;
controls.target.set(0, 3, 0);
controls.update();

// setup mouse and raycaster
mouse = new THREE.Vector2();
raycaster = new THREE.Raycaster();
document.addEventListener("mousemove", onMouseMove);
document.addEventListener("click", onMouseClick);

// helper function to hide all info panels
function hideAllPanels() {
    const panels = [
        'bunny-info', 'strawberry-info', 'libertyStatue-info',
        'bean-info', 'books-info', 'tv-info',
        'box-info', 'pony-info', 'bear-info', 'game-info'
    ];
    panels.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.opacity = '0';
    });
}

// press E to reset
document.addEventListener("keydown", function(e) {
    if (e.key === "e" || e.key === "E") {
        isZoomedIn = false;
        controls.enabled = true;
        isResetting = true;
        hideAllPanels();
    }
});

function onMouseMove(ev) {
    mouse.x = (ev.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(ev.clientY / window.innerHeight) * 2 + 1;
    raycaster.setFromCamera(mouse, camera);

    // helper to check hover for any object
    function checkHover(obj, flag, name) {
        if (!obj) return false;
        const hits = raycaster.intersectObject(obj, true);
        if (hits.length > 0) {
            if (!flag) console.log('hover enter ' + name);
            return true;
        }
        return false;
    }

    isHoveringBunny = checkHover(bunny, isHoveringBunny, 'bunny');
    isHoveringstrawberry = checkHover(strawberry, isHoveringstrawberry, 'strawberry');
    isHoveringbean = checkHover(bean, isHoveringbean, 'bean');
    isHoveringbooks = checkHover(books, isHoveringbooks, 'books');
    isHoveringtv = checkHover(tv, isHoveringtv, 'tv');
    isHoveringbox = checkHover(box, isHoveringbox, 'box');
    isHoveringpony = checkHover(pony, isHoveringpony, 'pony');
    isHoveringbear = checkHover(bear, isHoveringbear, 'bear');
    isHoveringgame = checkHover(game, isHoveringgame, 'game');
    isHoveringlibertyStatue = checkHover(libertyStatue, isHoveringlibertyStatue, 'libertyStatue');
}

function onMouseClick() {
    raycaster.setFromCamera(mouse, camera);

    // helper to check click for any object
    function checkClick(obj) {
        if (!obj) return false;
        return raycaster.intersectObject(obj, true).length > 0;
    }

    if (checkClick(bunny)) {
        isZoomedIn = true;
        controls.enabled = false;
        targetCameraPos.set(-3.7, 0.4, -2);
        targetLookAt.set(-3.7, 0.2, -4);
        hideAllPanels();
        document.getElementById('bunny-info').style.opacity = '1';
        return;
    }
    if (checkClick(strawberry)) {
        isZoomedIn = true;
        controls.enabled = false;
        targetCameraPos.set(3, 3, -1.4);
        targetLookAt.set(3, 2, -4.4);
        hideAllPanels();
        document.getElementById('strawberry-info').style.opacity = '1';
        return;
    }
    if (checkClick(libertyStatue)) {
        isZoomedIn = true;
        controls.enabled = false;
        targetCameraPos.set(3, 2.8, -1);
       targetLookAt.set(3, 1.8, 3.2);
        hideAllPanels();
        document.getElementById('libertyStatue-info').style.opacity = '1';
        return;
    }
    if (checkClick(bean)) {
        isZoomedIn = true;
        controls.enabled = false;
        targetCameraPos.set(2, 2, -1);
        targetLookAt.set(2, 1, 3.2);
        hideAllPanels();
        document.getElementById('bean-info').style.opacity = '1';
        return;
    }
    if (checkClick(books)) {
        isZoomedIn = true;
        controls.enabled = false;
        targetCameraPos.set(-2.5, 2, -2);
        targetLookAt.set(-2.5, 1, -3.7);
        hideAllPanels();
        document.getElementById('books-info').style.opacity = '1';
        return;
    }
    if (checkClick(tv)) {
        isZoomedIn = true;
        controls.enabled = false;
        targetCameraPos.set(-0.4, 2, -1); 
        targetLookAt.set(-0.4, 1, 3);
        hideAllPanels();
        document.getElementById('tv-info').style.opacity = '1';
        return;
    }
    if (checkClick(box)) {
        isZoomedIn = true;
        controls.enabled = false;
        targetCameraPos.set(-0.6, 1.2, 4.2);
        targetLookAt.set(-4, 1, 3.5);
        hideAllPanels();
        document.getElementById('box-info').style.opacity = '1';
        return;
    }
    if (checkClick(pony)) {
        isZoomedIn = true;
        controls.enabled = false;
        targetCameraPos.set(-3.6, 2, 1.5);
        targetLookAt.set(-3.6, 1, 0);
        hideAllPanels();
        document.getElementById('pony-info').style.opacity = '1';
        return;
    }
    if (checkClick(bear)) {
        isZoomedIn = true;
        controls.enabled = false;
        targetCameraPos.set(0, 2, 1.5);
        targetLookAt.set(0, 1, 0);
        hideAllPanels();
        document.getElementById('bear-info').style.opacity = '1';
        return;
    }
    if (checkClick(game)) {
        isZoomedIn = true;
        controls.enabled = false;
        targetCameraPos.set(-2.5, 2, 0);
        targetLookAt.set(-2.5, 1, 3.2);
        targetCameraPos.set(-3.0, 2, 0);
        targetLookAt.set(-2.5, 1, 3.2);
        hideAllPanels();
        document.getElementById('game-info').style.opacity = '1';
        return;
    }
}

function draw() {
    if (isZoomedIn) {
        camera.position.lerp(targetCameraPos, 0.05);
        controls.target.lerp(targetLookAt, 0.05);
        controls.update();
    } else if (isResetting) {
        camera.position.lerp(originalCameraPos, 0.05);
        controls.target.lerp(originalLookAt, 0.05);
        controls.update();
        if (camera.position.distanceTo(originalCameraPos) < 0.01) {
            isResetting = false;
            camera.position.copy(originalCameraPos);
            controls.target.copy(originalLookAt);
        }
    } else {
        controls.update();
    }

    // hover scale effects for all models
    function lerpScale(obj, hovering, hoverScale, normalScale) {
        if (!obj) return;
        if (hovering) {
            obj.scale.lerp(new THREE.Vector3(hoverScale, hoverScale, hoverScale), 0.1);
        } else {
            obj.scale.lerp(new THREE.Vector3(normalScale, normalScale, normalScale), 0.1);
        }
    }

    lerpScale(bunny, isHoveringBunny, 5, 4);
    lerpScale(strawberry, isHoveringstrawberry, 5, 4);
    lerpScale(libertyStatue, isHoveringlibertyStatue, 0.06, 0.05);
    lerpScale(bean, isHoveringbean, 0.15, 0.13);
    lerpScale(books, isHoveringbooks, 0.023, 0.02);
    lerpScale(box, isHoveringbox, 5, 4);
    lerpScale(pony, isHoveringpony, 13, 12);
    lerpScale(bear, isHoveringbear, 5, 4);
    lerpScale(game, isHoveringgame, 5, 4);
    lerpScale(tv, isHoveringtv, 0.0018, 0.0016);
   

    renderer.render(scene, camera);
    window.requestAnimationFrame(draw);
}
draw();

function addObjects() {
    let ambientLight = new THREE.AmbientLight(0xffffff, 2);
    scene.add(ambientLight);

    let dirLight = new THREE.DirectionalLight(0xffffff, 6);
    dirLight.position.set(10, 20, 30);
    dirLight.lookAt(0, 0, 0);
    scene.add(dirLight);
    dirLight.castShadow = true;
    dirLight.shadow.camera.right = 10;
    dirLight.shadow.camera.left = -10;
    dirLight.shadow.camera.top = 10;
    dirLight.shadow.camera.bottom = -10;
}