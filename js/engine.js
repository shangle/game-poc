/**
 * THREE.JS GAME ENGINE
 */
const TILE_SIZE = 10; const WALL_HEIGHT = 10;
let scene, camera, renderer, animationFrameId;
let colliders = [], enemies = [], items = [], goalMesh = null;
let gameActive = false;
let playerStats = { hp: 100, score: 0 };
let cachedMaterials = {};

function getMaterial(texKey, isSprite=false) {
    if(!cachedMaterials[texKey]) {
        const tex = new THREE.TextureLoader().load(resolveAsset(texKey));
        tex.magFilter = THREE.NearestFilter;
        if(!isSprite) {
            cachedMaterials[texKey] = new THREE.MeshLambertMaterial({ map: tex });
        } else {
            cachedMaterials[texKey] = new THREE.SpriteMaterial({ map: tex, color: 0xffffff });
        }
    }
    return cachedMaterials[texKey];
}

function init3D() {
    const container = document.getElementById('game-container');
    container.style.display = 'block';
    
    if(!renderer) {
        scene = new THREE.Scene(); scene.background = new THREE.Color(0x020617); scene.fog = new THREE.Fog(0x020617, 10, 80); 
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        renderer = new THREE.WebGLRenderer({ antialias: false }); 
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(window.innerWidth, window.innerHeight);
        container.insertBefore(renderer.domElement, container.firstChild);
        
        scene.add(new THREE.AmbientLight(0xffffff, 0.6));
        const pointLight = new THREE.PointLight(0xffffff, 0.8, 50); camera.add(pointLight); scene.add(camera);
        
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
}

function buildWorld() {
    cachedMaterials = {}; 
    scene.children = scene.children.filter(c => c.type === 'AmbientLight' || c.type === 'PerspectiveCamera');
    colliders = []; enemies = []; items = []; goalMesh = null;
    playerStats = { hp: 100, score: 0 }; updateHUD();
    document.getElementById('weapon-img').src = resolveAsset('gun');

    const planeGeo = new THREE.PlaneGeometry(TILE_SIZE, TILE_SIZE);
    const boxGeo = new THREE.BoxGeometry(TILE_SIZE, WALL_HEIGHT, TILE_SIZE);

    let playerSet = false;

    for(let z = 0; z < GRID_SIZE; z++) {
        for(let x = 0; x < GRID_SIZE; x++) {
            const posX = x * TILE_SIZE; const posZ = z * TILE_SIZE;
            const fId = gameData.map.floors[z][x];
            if(fId !== ID_EMPTY) {
                const fData = gameData.palette.floors.find(i=>i.id===fId);
                if(fData) {
                    const mesh = new THREE.Mesh(planeGeo, getMaterial(fData.tex, false));
                    mesh.rotation.x = -Math.PI / 2; mesh.position.set(posX, 0, posZ); scene.add(mesh);
                }
            }
            const cId = gameData.map.ceils[z][x];
            if(cId !== ID_EMPTY) {
                const cData = gameData.palette.ceils.find(i=>i.id===cId);
                if(cData) {
                    const mesh = new THREE.Mesh(planeGeo, getMaterial(cData.tex, false));
                    mesh.rotation.x = Math.PI / 2; mesh.position.set(posX, WALL_HEIGHT, posZ); scene.add(mesh);
                }
            }
            const eId = gameData.map.entities[z][x];
            if(eId === ID_PLAYER) { 
                camera.position.set(posX, WALL_HEIGHT/2, posZ); playerSet = true;
            } 
            else if(eId === ID_GOAL) {
                goalMesh = new THREE.Sprite(getMaterial('goal', true));
                goalMesh.scale.set(8, 8, 1); goalMesh.position.set(posX, 4, posZ); scene.add(goalMesh);
            } 
            else {
                const wData = gameData.palette.walls.find(i=>i.id===eId);
                const enData = gameData.palette.enemies.find(i=>i.id===eId);
                const oData = gameData.palette.objects.find(i=>i.id===eId);
                const iData = gameData.palette.items.find(i=>i.id===eId);

                if(wData) {
                    const mesh = new THREE.Mesh(boxGeo, getMaterial(wData.tex, false));
                    mesh.position.set(posX, WALL_HEIGHT/2, posZ); scene.add(mesh);
                    colliders.push({ type: 'box', x: posX, z: posZ, size: TILE_SIZE });
                } 
                else if(enData) {
                    const sprite = new THREE.Sprite(getMaterial(enData.tex, true));
                    sprite.scale.set(6, 6, 1); sprite.position.set(posX, 3, posZ); scene.add(sprite);
                    enemies.push({ mesh: sprite, hp: enData.hp, speed: enData.speed, active: true });
                }
                else if(oData) {
                    const sprite = new THREE.Sprite(getMaterial(oData.tex, true));
                    sprite.scale.set(7, 7, 1); sprite.position.set(posX, 3.5, posZ); scene.add(sprite);
                    colliders.push({ type: 'circle', x: posX, z: posZ, radius: 3.5 });
                }
                else if(iData) {
                    const sprite = new THREE.Sprite(getMaterial(iData.tex, true));
                    sprite.scale.set(4, 4, 1); sprite.position.set(posX, 2, posZ); scene.add(sprite);
                    items.push({ mesh: sprite, type: iData.type, value: iData.value, active: true, base_y: 2 });
                }
            }
        }
    }
    if(!playerSet) camera.position.set(TILE_SIZE, WALL_HEIGHT/2, TILE_SIZE);
}

const keys = { w: false, a: false, s: false, d: false };
const velocity = new THREE.Vector3(); let euler = new THREE.Euler(0, 0, 0, 'YXZ');
const isTouchDevice = ('ontouchstart' in window || navigator.maxTouchPoints > 0);

document.addEventListener('keydown', (e) => { if(gameActive) keys[e.key.toLowerCase()] = true; });
document.addEventListener('keyup', (e) => { if(gameActive) keys[e.key.toLowerCase()] = false; });

// MOBILE BUTTONS
const setupMobileBtn = (id, key) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.addEventListener('touchstart', (e) => { e.preventDefault(); keys[key] = true; });
    el.addEventListener('touchend', (e) => { e.preventDefault(); keys[key] = false; });
};
setupMobileBtn('m-up', 'w'); setupMobileBtn('m-down', 's');
setupMobileBtn('m-left', 'a'); setupMobileBtn('m-right', 'd');
const fireBtn = document.getElementById('m-fire');
if (fireBtn) fireBtn.addEventListener('touchstart', (e) => { e.preventDefault(); shoot(); });

function startGameEngine() {
    init3D(); buildWorld();
    gameActive = true;
    document.getElementById('editor-sidebar').classList.add('hidden');
    document.getElementById('game-container').style.display = 'block';
    document.getElementById('btn-pause').style.display = 'block';
    
    // Always show mobile controls on touch devices, but still allow mouse use
    if (isTouchDevice) {
        document.getElementById('mobile-controls').style.display = 'flex';
    }
    
    // Add a listener to request pointer lock on first click for better reliability
    const clickToLock = () => {
        if (gameActive) { // Lock even if touch is available
            try { 
                document.getElementById('game-container').requestPointerLock(); 
                document.getElementById('game-container').removeEventListener('click', clickToLock);
            } catch(e) { console.warn("Pointer lock failed", e); }
        }
    };
    document.getElementById('game-container').addEventListener('click', clickToLock);
    
    // Attempt immediate lock if possible (often fails without gesture)
    try { document.getElementById('game-container').requestPointerLock(); } catch(e) {}
    
    AudioEngine.startMusic();
    if (!animationFrameId) gameLoop();
}

function stopGame() {
    gameActive = false;
    document.getElementById('game-container').style.display = 'none';
    document.getElementById('mobile-controls').style.display = 'none';
    document.getElementById('btn-pause').style.display = 'none';
    
    AudioEngine.stopMusic();
    
    if (document.pointerLockElement) {
        document.exitPointerLock();
    }
    
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    
    // Default back to editor, but main.js can override
    document.getElementById('editor-sidebar').classList.remove('hidden');
    renderUI();
}

document.addEventListener('mousemove', (event) => {
    if (gameActive && document.pointerLockElement) {
        euler.setFromQuaternion(camera.quaternion);
        euler.y -= (event.movementX || 0) * 0.002; euler.x -= (event.movementY || 0) * 0.002;
        euler.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, euler.x)); 
        camera.quaternion.setFromEuler(euler);
    }
});

let touchStartX = 0, touchStartY = 0;
window.addEventListener('touchstart', (e) => {
    if(!gameActive || e.target.tagName === 'BUTTON' || e.target.classList.contains('joy-btn')) return;
    touchStartX = e.touches[0].clientX; touchStartY = e.touches[0].clientY;
}, {passive: false});
window.addEventListener('touchmove', (e) => {
    if(!gameActive || e.target.tagName === 'BUTTON' || e.target.classList.contains('joy-btn')) return;
    e.preventDefault(); 
    euler.setFromQuaternion(camera.quaternion);
    euler.y -= (e.touches[0].clientX - touchStartX) * 0.005; euler.x -= (e.touches[0].clientY - touchStartY) * 0.005;
    euler.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, euler.x));
    camera.quaternion.setFromEuler(euler);
    touchStartX = e.touches[0].clientX; touchStartY = e.touches[0].clientY;
}, {passive: false});

document.addEventListener('mousedown', (e) => { if(gameActive && !isTouchDevice && e.button===0) shoot(); });

function checkCollision(nx, nz, radius=2) {
    for(let c of colliders) {
        if(c.type === 'box') {
            const h = c.size/2;
            if (nx + radius > c.x - h && nx - radius < c.x + h && nz + radius > c.z - h && nz - radius < c.z + h) return true;
        } else if(c.type === 'circle') {
            const dist = Math.hypot(nx - c.x, nz - c.z);
            if(dist < radius + c.radius) return true;
        }
    }
    return false;
}

const raycaster = new THREE.Raycaster();
function shoot() {
    AudioEngine.playSFX('shoot');
    const w = document.getElementById('weapon-container'), f = document.getElementById('flash');
    w.classList.add('firing'); f.style.background = 'rgba(255,255,0,0.3)'; f.style.display = 'block';
    setTimeout(() => { w.classList.remove('firing'); f.style.display = 'none'; }, 100);

    raycaster.setFromCamera(new THREE.Vector2(0,0), camera); 
    const targets = enemies.filter(e => e.active).map(e => e.mesh);
    const intersects = raycaster.intersectObjects(targets);
    
    if (intersects.length > 0) {
        const obj = enemies.find(e => e.mesh === intersects[0].object);
        if(obj) {
            obj.hp -= 50;
            if(obj.hp <= 0) { 
                obj.active = false; scene.remove(obj.mesh); playerStats.score += 50; updateHUD(); 
                AudioEngine.playSFX('hit');
            }
        }
    }
}

function updateHUD() {
    document.getElementById('hp-display').innerText = playerStats.hp;
    document.getElementById('score-display').innerText = playerStats.score;
}

let clock = 0;
function gameLoop() {
    if (!gameActive) return;
    animationFrameId = requestAnimationFrame(gameLoop);
    clock += 0.05;

    velocity.set(0, 0, 0);
    if(keys.w) velocity.z -= 0.6; if(keys.s) velocity.z += 0.6;
    if(keys.a) velocity.x -= 0.6; if(keys.d) velocity.x += 0.6;
    velocity.applyQuaternion(camera.quaternion); velocity.y = 0; 
    
    if (velocity.length() > 0) {
        velocity.normalize().multiplyScalar(0.6);
        if(!checkCollision(camera.position.x + velocity.x, camera.position.z)) camera.position.x += velocity.x;
        if(!checkCollision(camera.position.x, camera.position.z + velocity.z)) camera.position.z += velocity.z;
    }

    items.forEach(item => {
        if(!item.active) return;
        item.mesh.position.y = item.base_y + Math.sin(clock + item.mesh.position.x) * 0.5;
        if(camera.position.distanceTo(item.mesh.position) < 3.5) {
            item.active = false; scene.remove(item.mesh);
            if(item.type === 'hp') playerStats.hp = Math.min(100, playerStats.hp + item.value);
            if(item.type === 'score') playerStats.score += item.value;
            updateHUD(); AudioEngine.playSFX('collect');
        }
    });

    if(goalMesh && camera.position.distanceTo(goalMesh.position) < 5) {
        gameActive = false; AudioEngine.playSFX('win'); stopGame();
        alert("Level Clear! Score: " + playerStats.score);
    }

    enemies.forEach(e => {
        if(!e.active) return;
        const dir = new THREE.Vector3().subVectors(camera.position, e.mesh.position); dir.y = 0; 
        if (dir.length() > 4) {
            dir.normalize();
            const nx = e.mesh.position.x + dir.x * e.speed;
            const nz = e.mesh.position.z + dir.z * e.speed;
            if(!checkCollision(nx, nz, 2)) { e.mesh.position.x = nx; e.mesh.position.z = nz; }
        } else if(Math.random() < 0.05) { 
            playerStats.hp -= 10; updateHUD(); AudioEngine.playSFX('hit');
            if(playerStats.hp <= 0) { AudioEngine.playSFX('death'); stopGame(); alert("Game Over"); }
        }
    });

    renderer.render(scene, camera);
}
