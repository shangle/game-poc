/**
 * RETRO ENGINE V2 - CORE ENGINE
 */

const TILE_SIZE = 10;
const WALL_HEIGHT = 10;

class GameEngine {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.clock = new THREE.Clock();
        this.active = false;
        
        this.colliders = [];
        this.enemies = [];
        this.items = [];
        this.projectiles = [];
        this.goalMesh = null;
        
        this.player = {
            hp: 100,
            score: 0,
            velocity: new THREE.Vector3(),
            euler: new THREE.Euler(0, 0, 0, 'YXZ')
        };

        this.settings = {
            sensitivity: 0.002,
            fov: 75
        };

        this.keys = { w: false, a: false, s: false, d: false };
        this.currentLevelIndex = 0;
        this.cartridge = null;
        this.raycaster = new THREE.Raycaster();
    }

    loadCartridge(cartridge) {
        this.cartridge = cartridge;
        this.currentLevelIndex = 0;
    }

    startLevel(index) {
        this.reset();
        this.currentLevelIndex = index;
        const level = this.cartridge.levels[index];
        this.buildWorld(level);
        this.active = true;
        this.loop();
    }

    reset() {
        this.active = false;
        if (this.scene) {
            this.projectiles.forEach(p => this.scene.remove(p.mesh));
            this.enemies.forEach(e => this.scene.remove(e.mesh));
            this.items.forEach(i => this.scene.remove(i.mesh));
        }
        this.projectiles = [];
        this.enemies = [];
        this.items = [];
        this.colliders = [];
        this.player.hp = 100;
        this.player.score = 0;
        this.updateHUD();
    }

    init(container) {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x020617);
        this.scene.fog = new THREE.Fog(0x020617, 10, 100);

        this.camera = new THREE.PerspectiveCamera(this.settings.fov, window.innerWidth / window.innerHeight, 0.1, 1000);
        
        this.renderer = new THREE.WebGLRenderer({ antialias: false });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(this.renderer.domElement);

        const ambient = new THREE.AmbientLight(0xffffff, 0.8);
        this.scene.add(ambient);
        
        const pointLight = new THREE.PointLight(0xffffff, 1.0, 100);
        this.camera.add(pointLight);
        this.scene.add(this.camera);

        window.addEventListener('resize', () => this.onResize());
        document.addEventListener('keydown', (e) => this.keys[e.key.toLowerCase()] = true);
        document.addEventListener('keyup', (e) => this.keys[e.key.toLowerCase()] = false);
        
        container.addEventListener('click', () => {
            if (this.active) {
                if (document.pointerLockElement) {
                    this.shoot();
                } else {
                    container.requestPointerLock();
                }
            }
        });

        document.addEventListener('mousemove', (e) => this.onMouseMove(e));

        // Set procedural gun art
        const weaponImg = document.getElementById('weapon-sprite');
        if (weaponImg) {
             const gunData = this.createProceduralTexture('gun');
             weaponImg.style.backgroundImage = `url(${gunData})`;
             
             // Try to load external gun if available, fallback is already set
             const loader = new THREE.ImageLoader();
             loader.load('https://shangle.me/game-poc/assets/gun.png', (image) => {
                 weaponImg.style.backgroundImage = `url(${image.src})`;
             }, undefined, (err) => console.log("Engine: Using procedural weapon art."));
        }
    }

    onMouseMove(event) {
        if (this.active && document.pointerLockElement) {
            this.player.euler.setFromQuaternion(this.camera.quaternion);
            this.player.euler.y -= event.movementX * this.settings.sensitivity;
            this.player.euler.x -= event.movementY * this.settings.sensitivity;
            this.player.euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.player.euler.x));
            this.camera.quaternion.setFromEuler(this.player.euler);
        }
    }

    shoot() {
        const weapon = document.getElementById('weapon-container');
        if (weapon) {
            weapon.classList.add('firing');
            setTimeout(() => weapon.classList.remove('firing'), 100);
        }

        // Projectile Visual (Laser Bolt)
        const laserGeo = new THREE.CylinderGeometry(0.05, 0.05, 2, 8);
        const laserMat = new THREE.MeshBasicMaterial({ color: 0x0ea5e9 });
        const laser = new THREE.Mesh(laserGeo, laserMat);
        
        laser.rotation.x = Math.PI / 2; // Orient along Z
        
        // Offset starting position
        laser.position.copy(this.camera.position);
        
        const direction = new THREE.Vector3(0, 0, -1);
        direction.applyQuaternion(this.camera.quaternion);
        
        // Push slightly forward and down to align with weapon
        laser.position.addScaledVector(direction, 1);
        laser.position.y -= 1;
        
        // Match camera rotation
        laser.quaternion.copy(this.camera.quaternion);
        laser.rotateX(Math.PI / 2); // Re-orient cylinder to face forward
        
        this.projectiles.push({ mesh: laser, dir: direction, life: 100 });
        this.scene.add(laser);

        // Raycasting for damage
        this.raycaster.setFromCamera(new THREE.Vector2(0, 0), this.camera);
        const targets = this.enemies.filter(e => e.active).map(e => e.mesh);
        const intersects = this.raycaster.intersectObjects(targets);

        if (intersects.length > 0) {
            const hit = this.enemies.find(e => e.mesh === intersects[0].object);
            if (hit) {
                hit.hp -= 50;
                if (hit.hp <= 0) {
                    hit.active = false;
                    this.scene.remove(hit.mesh);
                    this.player.score += 100;
                    this.updateHUD();
                }
            }
        }
    }

    update(delta) {
        if (!this.active) return;

        // Player movement
        const move = new THREE.Vector3();
        if (this.keys.w) move.z -= 1;
        if (this.keys.s) move.z += 1;
        if (this.keys.a) move.x -= 1;
        if (this.keys.d) move.x += 1;

        if (move.length() > 0) {
            move.normalize().applyQuaternion(this.camera.quaternion);
            move.y = 0;
            move.multiplyScalar(0.6);

            if (!this.checkCollision(this.camera.position.x + move.x, this.camera.position.z)) this.camera.position.x += move.x;
            if (!this.checkCollision(this.camera.position.x, this.camera.position.z + move.z)) this.camera.position.z += move.z;
        }

        // Projectiles
        for (let i = this.projectiles.length - 1; i >= 0; i--) {
            const p = this.projectiles[i];
            p.mesh.position.addScaledVector(p.dir, 2.0);
            p.life--;
            if (p.life <= 0 || this.checkCollision(p.mesh.position.x, p.mesh.position.z, 0.5)) {
                this.scene.remove(p.mesh);
                this.projectiles.splice(i, 1);
            }
        }

        // Goal check
        if (this.goalMesh && this.camera.position.distanceTo(this.goalMesh.position) < 5) {
            this.nextLevel();
        }

        // Item collection
        this.items.forEach(item => {
            if (item.active && this.camera.position.distanceTo(item.mesh.position) < 3) {
                item.active = false;
                this.scene.remove(item.mesh);
                if (item.type === 'hp') this.player.hp = Math.min(100, this.player.hp + item.value);
                this.updateHUD();
            }
        });

        // Enemies
        this.enemies.forEach(e => {
            if (!e.active) return;
            const dir = new THREE.Vector3().subVectors(this.camera.position, e.mesh.position);
            dir.y = 0;
            if (dir.length() > 4) {
                dir.normalize().multiplyScalar(e.speed);
                const nx = e.mesh.position.x + dir.x;
                const nz = e.mesh.position.z + dir.z;
                if (!this.checkCollision(nx, nz, 2)) {
                    e.mesh.position.x = nx;
                    e.mesh.position.z = nz;
                }
            } else if (Math.random() < 0.02) {
                this.player.hp -= 5;
                this.updateHUD();
                if (this.player.hp <= 0) this.gameOver();
            }
        });
    }

    createProceduralTexture(type) {
        const c = document.createElement('canvas');
        const ctx = c.getContext('2d');
        c.width = 64; c.height = 64;

        if (type.includes('wall')) {
            ctx.fillStyle = '#4a5568'; ctx.fillRect(0, 0, 64, 64);
            ctx.fillStyle = '#2d3748';
            for (let i = 0; i < 64; i += 16) for (let j = 0; j < 64; j += 8) ctx.fillRect(i + 1, j + 1, 14, 6);
        } else if (type.includes('floor')) {
            ctx.fillStyle = '#2d3748'; ctx.fillRect(0, 0, 64, 64);
            ctx.fillStyle = '#1a202c'; ctx.fillRect(0, 0, 32, 32); ctx.fillRect(32, 32, 32, 32);
        } else if (type.includes('ceil')) {
            ctx.fillStyle = '#111827'; ctx.fillRect(0, 0, 64, 64);
            ctx.fillStyle = '#ffffff'; ctx.fillRect(10, 10, 2, 2); ctx.fillRect(40, 50, 2, 2);
        } else if (type === 'goal') {
            ctx.fillStyle = '#22c55e'; ctx.fillRect(0, 0, 64, 64);
            ctx.fillStyle = '#ffffff'; ctx.font = 'bold 18px sans-serif'; ctx.fillText('EXIT', 12, 38);
        } else if (type.includes('enemy')) {
            ctx.fillStyle = '#ef4444'; ctx.beginPath(); ctx.arc(32, 32, 20, 0, Math.PI * 2); ctx.fill();
        } else if (type === 'gun') {
            c.width = 128; c.height = 128;
            ctx.fillStyle = '#374151'; ctx.fillRect(50, 75, 28, 75); 
            ctx.fillStyle = '#6b7280'; ctx.fillRect(57, 25, 13, 75); ctx.fillStyle = '#000'; ctx.fillRect(61, 20, 5, 10);
        } else {
            ctx.fillStyle = '#334155'; ctx.fillRect(0, 0, 64, 64);
        }
        return c.toDataURL();
    }

    buildWorld(level) {
        if (!level || !level.map) return;

        // Clear scene
        this.scene.children = this.scene.children.filter(c => c.type === 'AmbientLight' || c.type === 'PerspectiveCamera');
        this.colliders = [];
        this.enemies = [];
        this.items = [];
        this.projectiles = []; // Clear old projectiles

        const planeGeo = new THREE.PlaneGeometry(TILE_SIZE, TILE_SIZE);
        const boxGeo = new THREE.BoxGeometry(TILE_SIZE, WALL_HEIGHT, TILE_SIZE);
        const loader = new THREE.TextureLoader();

        const getMat = (url, type) => {
            const finalUrl = (url && url.startsWith('http')) ? url : this.createProceduralTexture(type);
            const tex = loader.load(finalUrl, 
                undefined, undefined,
                () => {
                    tex.image = new Image();
                    tex.image.src = this.createProceduralTexture(type);
                    tex.needsUpdate = true;
                }
            );
            tex.magFilter = THREE.NearestFilter;
            return new THREE.MeshLambertMaterial({ map: tex });
        };

        const getSpriteMat = (url, type) => {
            const finalUrl = (url && url.startsWith('http')) ? url : this.createProceduralTexture(type);
            const tex = loader.load(finalUrl,
                undefined, undefined,
                () => {
                    tex.image = new Image();
                    tex.image.src = this.createProceduralTexture(type);
                    tex.needsUpdate = true;
                }
            );
            tex.magFilter = THREE.NearestFilter;
            return new THREE.SpriteMaterial({ map: tex });
        };

        for (let z = 0; z < GRID_SIZE; z++) {
            const rowEntities = (level.map.entities && level.map.entities[z]) ? level.map.entities[z] : [];
            const rowFloors = (level.map.floors && level.map.floors[z]) ? level.map.floors[z] : [];
            const rowCeils = (level.map.ceils && level.map.ceils[z]) ? level.map.ceils[z] : [];

            for (let x = 0; x < GRID_SIZE; x++) {
                const posX = x * TILE_SIZE;
                const posZ = z * TILE_SIZE;

                // Floor
                const fId = rowFloors[x] || 0;
                const fData = this.cartridge.palette.floors.find(i => i.id === fId);
                if (fData) {
                    const mesh = new THREE.Mesh(planeGeo, getMat(fData.tex, 'floor'));
                    mesh.rotation.x = -Math.PI / 2;
                    mesh.position.set(posX, 0, posZ);
                    this.scene.add(mesh);
                }

                // Ceiling
                const cId = rowCeils[x] || 0;
                const cData = this.cartridge.palette.ceils.find(i => i.id === cId);
                if (cData) {
                    const mesh = new THREE.Mesh(planeGeo, getMat(cData.tex, 'ceil'));
                    mesh.rotation.x = Math.PI / 2;
                    mesh.position.set(posX, WALL_HEIGHT, posZ);
                    this.scene.add(mesh);
                }

                // Entities
                const eId = rowEntities[x] || 0;
                if (eId === ID_PLAYER) {
                    this.camera.position.set(posX, WALL_HEIGHT / 2, posZ);
                } else if (eId === ID_GOAL) {
                    const sprite = new THREE.Sprite(getSpriteMat('goal.png', 'goal'));
                    sprite.scale.set(8, 8, 1);
                    sprite.position.set(posX, 4, posZ);
                    this.scene.add(sprite);
                    this.goalMesh = sprite;
                } else {
                    const wData = this.cartridge.palette.walls.find(i => i.id === eId);
                    const enData = this.cartridge.palette.enemies.find(i => i.id === eId);
                    const iData = this.cartridge.palette.items.find(i => i.id === eId);

                    if (wData) {
                        const mesh = new THREE.Mesh(boxGeo, getMat(wData.tex, 'wall'));
                        mesh.position.set(posX, WALL_HEIGHT / 2, posZ);
                        this.scene.add(mesh);
                        this.colliders.push({ type: 'box', x: posX, z: posZ, size: TILE_SIZE });
                    } else if (enData) {
                        const sprite = new THREE.Sprite(getSpriteMat(enData.tex, 'enemy'));
                        sprite.scale.set(6, 6, 1);
                        sprite.position.set(posX, 3, posZ);
                        this.scene.add(sprite);
                        this.enemies.push({ mesh: sprite, hp: enData.hp, speed: enData.speed, active: true });
                    } else if (iData) {
                        const sprite = new THREE.Sprite(getSpriteMat(iData.tex, 'item'));
                        sprite.scale.set(4, 4, 1);
                        sprite.position.set(posX, 2, posZ);
                        this.scene.add(sprite);
                        this.items.push({ mesh: sprite, type: iData.type, value: iData.value, active: true });
                    }
                }
            }
        }
    }

    updateHUD() {
        const hpEl = document.getElementById('hp-value');
        if (hpEl) hpEl.innerText = Math.max(0, this.player.hp);
        const scoreEl = document.getElementById('score-value');
        if (scoreEl) scoreEl.innerText = this.player.score;
    }

    nextLevel() {
        const currentLevel = this.cartridge.levels[this.currentLevelIndex];
        // Unlock next levels even if it's not the last one
        document.dispatchEvent(new CustomEvent('level-clear', { detail: { index: this.currentLevelIndex } }));

        if (currentLevel.exits && currentLevel.exits.length > 0) {
            const nextLvlId = currentLevel.exits[0].targetLevel;
            const nextIndex = this.cartridge.levels.findIndex(l => l.id === nextLvlId);
            if (nextIndex !== -1) {
                this.startLevel(nextIndex);
            } else {
                this.win();
            }
        } else {
            this.win();
        }
    }

    win() {
        this.active = false;
        document.exitPointerLock();
        document.dispatchEvent(new CustomEvent('game-win', { detail: { score: this.player.score } }));
    }

    gameOver() {
        this.active = false;
        document.exitPointerLock();
        document.dispatchEvent(new CustomEvent('game-over'));
    }

    loop() {
        if (!this.active) return;
        requestAnimationFrame(() => this.loop());
        const delta = this.clock.getDelta();
        this.update(delta);
        this.renderer.render(this.scene, this.camera);
    }
}

window.gameEngine = new GameEngine();
