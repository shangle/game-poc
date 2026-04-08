/**
 * UI & LEVEL EDITOR CONTROLLER
 */

let activeLibTab = 'entities'; // 'entities' or 'tiles'
let activeAssetId = 1; // Currently selected brush
let inspectorTargetId = null; // The ID of the asset being edited in inspector

function openEditor() {
    initDemoMap();
    document.getElementById('boot-screen').style.display = 'none';
    document.getElementById('editor-sidebar').classList.remove('hidden');
    renderUI();
}

function renderUI() {
    renderLibrary();
    renderGrid();
    document.getElementById('game-title-display').innerText = gameData.title;
}

function setLayer(layer) {
    activeLayer = layer;
    document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('btn-layer-' + layer).classList.add('active');
    
    document.getElementById('grid-label').innerText = "Painting: " + layer.charAt(0).toUpperCase() + layer.slice(1);
    
    // Auto-switch library tab based on layer
    if (layer === 'entities') switchLibTab('entities');
    else switchLibTab('tiles');

    renderGrid();
}

function switchLibTab(tab) {
    activeLibTab = tab;
    document.querySelectorAll('.lib-tab').forEach(t => t.classList.remove('active'));
    document.getElementById(tab === 'entities' ? 'tab-ent' : 'tab-tile').classList.add('active');
    
    // Set default asset for that tab if current one isn't in it
    if (tab === 'entities') {
        if (!gameData.palette.walls.find(i=>i.id === activeAssetId) && 
            !gameData.palette.enemies.find(i=>i.id === activeAssetId) &&
            activeAssetId !== ID_PLAYER && activeAssetId !== ID_GOAL) {
            activeAssetId = gameData.palette.walls[0].id;
        }
    } else {
        const cat = activeLayer === 'floors' ? 'floors' : 'ceils';
        if (!gameData.palette[cat].find(i=>i.id === activeAssetId)) {
            activeAssetId = gameData.palette[cat][0].id;
        }
    }

    renderLibrary();
}

function renderLibrary() {
    const container = document.getElementById('library-content');
    container.innerHTML = '';

    const createCard = (id, name, texKey, color, isSystem = false) => {
        const card = document.createElement('div');
        card.className = `asset-card ${activeAssetId === id ? 'selected' : ''}`;
        if (isSystem) card.style.backgroundColor = '#1e3a8a';
        
        const preview = document.createElement('div');
        preview.className = 'asset-preview';
        const img = resolveAsset(texKey);
        preview.style.backgroundImage = `url(${img})`;
        if (!img) preview.style.backgroundColor = color || '#334155';

        const label = document.createElement('div');
        label.className = 'asset-name';
        label.innerText = name;

        card.appendChild(preview);
        card.appendChild(label);
        
        card.onclick = () => { activeAssetId = id; renderLibrary(); };
        card.oncontextmenu = (e) => { e.preventDefault(); openInspector(id); };
        
        container.appendChild(card);
    };

    // Erase tool first
    createCard(ID_EMPTY, "ERASER", "none", "#000", true);

    if (activeLibTab === 'entities') {
        createCard(ID_PLAYER, "PLAYER START", "none", "#3b82f6", true);
        createCard(ID_GOAL, "EXIT GOAL", "goal", "#22c55e", true);
        
        gameData.palette.walls.forEach(i => createCard(i.id, i.name, i.tex, i.color));
        gameData.palette.enemies.forEach(i => createCard(i.id, i.name, i.tex, i.color));
        gameData.palette.objects.forEach(i => createCard(i.id, i.name, i.tex, i.color));
        gameData.palette.items.forEach(i => createCard(i.id, i.name, i.tex, i.color));
    } else {
        const cat = activeLayer === 'ceils' ? 'ceils' : 'floors';
        gameData.palette[cat].forEach(i => createCard(i.id, i.name, i.tex, i.color));
    }
}

function renderGrid() {
    const container = document.getElementById('grid-container');
    container.style.gridTemplateColumns = `repeat(${GRID_SIZE}, 1fr)`;
    container.innerHTML = '';
    
    let isDrawing = false;
    container.onpointerdown = () => isDrawing = true;
    window.onpointerup = () => isDrawing = false;

    for(let z=0; z<GRID_SIZE; z++) {
        for(let x=0; x<GRID_SIZE; x++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            
            const floorId = gameData.map.floors[z][x];
            const ceilId = gameData.map.ceils[z][x];
            const entId = gameData.map.entities[z][x];

            // Visual feedback of what is there
            if (activeLayer === 'ceils') {
                const c = gameData.palette.ceils.find(i=>i.id===ceilId);
                if (c) cell.style.backgroundImage = `url(${resolveAsset(c.tex)})`;
            } else {
                const f = gameData.palette.floors.find(i=>i.id===floorId);
                if (f) cell.style.backgroundImage = `url(${resolveAsset(f.tex)})`;
                
                // Show entities on top if not in ceil mode
                if (entId !== ID_EMPTY) {
                    const overlay = document.createElement('div');
                    overlay.className = 'absolute inset-1 pointer-events-none';
                    if (entId === ID_PLAYER) overlay.style.backgroundColor = '#3b82f6';
                    else if (entId === ID_GOAL) overlay.style.backgroundImage = `url(${resolveAsset('goal')})`;
                    else {
                        const e = findAssetInPalette(entId);
                        if (e) overlay.style.backgroundImage = `url(${resolveAsset(e.tex)})`;
                    }
                    overlay.style.backgroundSize = 'contain';
                    overlay.style.backgroundRepeat = 'no-repeat';
                    overlay.style.backgroundPosition = 'center';
                    cell.appendChild(overlay);
                    if (activeLayer !== 'entities') cell.style.opacity = '0.5';
                }
            }

            const paint = (e) => {
                e.preventDefault();
                if (activeLayer === 'entities') {
                    if (activeAssetId === ID_PLAYER || activeAssetId === ID_GOAL) {
                        for(let r=0; r<GRID_SIZE; r++) for(let c=0; c<GRID_SIZE; c++) 
                            if(gameData.map.entities[r][c] === activeAssetId) gameData.map.entities[r][c] = 0;
                    }
                    gameData.map.entities[z][x] = activeAssetId;
                } else if (activeLayer === 'floors') {
                    gameData.map.floors[z][x] = activeAssetId;
                } else {
                    gameData.map.ceils[z][x] = activeAssetId;
                }
                renderGrid();
            };

            cell.onpointerdown = paint;
            cell.onpointerenter = (e) => { if(isDrawing) paint(e); };
            container.appendChild(cell);
        }
    }
}

function findAssetInPalette(id) {
    for (let cat in gameData.palette) {
        if (Array.isArray(gameData.palette[cat])) {
            const found = gameData.palette[cat].find(i => i.id === id);
            if (found) return { item: found, category: cat };
        }
    }
    return null;
}

/**
 * INSPECTOR LOGIC
 */
function openInspector(id) {
    const found = findAssetInPalette(id);
    if (!found) return;
    
    inspectorTargetId = id;
    const { item, category } = found;
    const container = document.getElementById('inspector-fields');
    container.innerHTML = '';

    const addField = (label, key, type = 'text', step = null) => {
        const group = document.createElement('div');
        group.className = 'input-group';
        group.innerHTML = `<label>${label}</label>`;
        const input = document.createElement('input');
        input.type = type;
        if (step) input.step = step;
        input.value = item[key] || '';
        if (key === 'tex') input.value = gameData.assets[item.tex] || '';
        
        input.onchange = (e) => {
            if (key === 'tex') {
                gameData.assets[item.tex] = e.target.value;
                renderLibrary();
                renderGrid();
            } else {
                item[key] = type === 'number' ? Number(e.target.value) : e.target.value;
                renderLibrary();
                renderGrid();
            }
        };
        group.appendChild(input);
        container.appendChild(group);
    };

    addField("Name", "name");
    addField("Image URL", "tex");
    addField("Color Map", "color", "color");
    
    if (category === 'enemies') {
        addField("Health", "hp", "number");
        addField("Speed", "speed", "number", "0.01");
    } else if (category === 'items') {
        addField("Value", "value", "number");
    }

    document.getElementById('inspector').style.display = 'block';
}

function closeInspector() {
    document.getElementById('inspector').style.display = 'none';
    inspectorTargetId = null;
}

function addNewAssetPrompt() {
    // Simple logic to add a new asset to the current active category
    let category = 'walls';
    if (activeLibTab === 'tiles') category = activeLayer === 'ceils' ? 'ceils' : 'floors';
    else category = 'walls';

    let maxId = 200;
    for (let cat in gameData.palette) {
        if (Array.isArray(gameData.palette[cat])) {
            gameData.palette[cat].forEach(i => maxId = Math.max(maxId, i.id));
        }
    }
    const id = maxId + 1;
    const newAsset = { id, name: "New " + category, tex: category + "_" + id, color: "#ffffff" };
    if (category === 'enemies') Object.assign(newAsset, { hp: 100, speed: 0.05 });
    if (category === 'items') Object.assign(newAsset, { type: 'score', value: 50 });

    gameData.palette[category].push(newAsset);
    activeAssetId = id;
    renderLibrary();
    openInspector(id);
}

function deleteActiveAsset() {
    if (!inspectorTargetId) return;
    for (let cat in gameData.palette) {
        if (Array.isArray(gameData.palette[cat])) {
            const idx = gameData.palette[cat].findIndex(i => i.id === inspectorTargetId);
            if (idx !== -1) {
                gameData.palette[cat].splice(idx, 1);
                break;
            }
        }
    }
    closeInspector();
    activeAssetId = ID_EMPTY;
    renderLibrary();
}

function showProjectSettings() {
    // Reuse inspector for global settings
    const container = document.getElementById('inspector-fields');
    container.innerHTML = '<h3 class="text-white font-bold mb-4">Project Settings</h3>';
    
    const addField = (label, val, onChange) => {
        const group = document.createElement('div');
        group.className = 'input-group';
        group.innerHTML = `<label>${label}</label>`;
        const input = document.createElement('input');
        input.value = val;
        input.onchange = (e) => onChange(e.target.value);
        group.appendChild(input);
        container.appendChild(group);
    };

    addField("Game Title", gameData.title, (v) => { 
        gameData.title = v; 
        document.getElementById('game-title-display').innerText = v;
        document.getElementById('boot-title').innerText = v;
    });
    addField("Menu Background URL", gameData.startBg, (v) => {
        gameData.startBg = v;
        if(v) document.getElementById('boot-screen').style.backgroundImage = `url(${v})`;
    });

    document.getElementById('inspector').style.display = 'block';
}

function fillMap() {
    for(let z=0; z<GRID_SIZE; z++) {
        for(let x=0; x<GRID_SIZE; x++) {
            if(activeLayer === 'entities') gameData.map.entities[z][x] = activeAssetId;
            if(activeLayer === 'floors') gameData.map.floors[z][x] = activeAssetId;
            if(activeLayer === 'ceils') gameData.map.ceils[z][x] = activeAssetId;
        }
    }
    renderGrid();
}

function downloadGame() {
    const a = document.createElement('a');
    a.href = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(gameData));
    a.download = gameData.title.replace(/\s+/g, '_') + ".json";
    document.body.appendChild(a); a.click(); a.remove();
}

function importGame(event) {
    const file = event.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        try { gameData = JSON.parse(e.target.result); renderUI(); } 
        catch(err) { alert("Invalid game file."); }
    };
    reader.readAsText(file);
}
