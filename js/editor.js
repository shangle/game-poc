/**
 * UI & LEVEL EDITOR CONTROLLER
 */

let activeLibTab = 'entities'; 
let activeAssetId = 1; 
let inspectorTargetId = null; 
let mapHistory = [];

function openEditor() {
    initDemoMap();
    document.getElementById('boot-screen').style.display = 'none';
    document.getElementById('editor-sidebar').classList.remove('hidden');
    renderUI();
}

function changeZoom(delta) {
    let currentSize = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--cell-size')) || 48;
    let newSize = Math.max(16, Math.min(128, currentSize + delta));
    document.documentElement.style.setProperty('--cell-size', newSize + 'px');
}

function renderUI() {
    renderLibrary();
    renderGrid();
    document.getElementById('game-title-display').innerText = gameData.title;
}

function saveHistory() {
    mapHistory.push(JSON.stringify(gameData.map));
    if (mapHistory.length > 20) mapHistory.shift();
}

function undo() {
    if (mapHistory.length > 0) {
        gameData.map = JSON.parse(mapHistory.pop());
        renderGrid();
    }
}

function setLayer(layer) {
    activeLayer = layer;
    document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('btn-layer-' + layer).classList.add('active');
    document.getElementById('grid-label').innerText = layer.toUpperCase();
    if (layer === 'entities') switchLibTab('entities');
    else switchLibTab('tiles');
    renderGrid();
}

function switchLibTab(tab) {
    activeLibTab = tab;
    document.querySelectorAll('.lib-tab').forEach(t => t.classList.remove('active'));
    const target = document.getElementById(tab === 'entities' ? 'tab-ent' : 'tab-tile');
    if (target) target.classList.add('active');
    renderLibrary();
}

function renderLibrary() {
    const container = document.getElementById('library-content');
    container.innerHTML = '';

    const createCard = (id, name, texKey, color, isSystem = false) => {
        const card = document.createElement('div');
        card.className = `asset-card ${activeAssetId === id ? 'selected' : ''}`;
        
        const preview = document.createElement('div');
        preview.className = 'asset-preview';
        const img = resolveAsset(texKey);
        if (img) preview.style.backgroundImage = `url(${img})`;
        else preview.style.backgroundColor = color || '#334155';

        const label = document.createElement('div');
        label.className = 'asset-name';
        label.innerText = name;

        card.appendChild(preview);
        card.appendChild(label);
        
        card.onclick = () => { activeAssetId = id; renderLibrary(); };
        card.oncontextmenu = (e) => { e.preventDefault(); openInspector(id); };
        
        container.appendChild(card);
    };

    createCard(ID_EMPTY, "ERASER", "none", "#000", true);

    if (activeLibTab === 'entities') {
        createCard(ID_PLAYER, "PLAYER", "none", "#3b82f6", true);
        createCard(ID_GOAL, "EXIT", "goal", "#22c55e", true);
        ['walls', 'enemies', 'objects', 'items'].forEach(cat => {
            gameData.palette[cat].forEach(i => createCard(i.id, i.name, i.tex, i.color));
        });
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
    const getTarget = (e) => {
        const x = e.clientX || (e.touches && e.touches[0].clientX);
        const y = e.clientY || (e.touches && e.touches[0].clientY);
        return document.elementFromPoint(x, y);
    };

    const handlePaint = (target) => {
        if (!target || !target.dataset.pos) return;
        const [z, x] = target.dataset.pos.split(',').map(Number);
        if (activeLayer === 'entities') {
            if (activeAssetId === ID_PLAYER || activeAssetId === ID_GOAL) {
                for(let r=0; r<GRID_SIZE; r++) for(let c=0; c<GRID_SIZE; c++) 
                    if(gameData.map.entities[r][c] === activeAssetId) gameData.map.entities[r][c] = 0;
            }
            if (gameData.map.entities[z][x] !== activeAssetId) {
                saveHistory();
                gameData.map.entities[z][x] = activeAssetId;
            }
        } else {
            const mapLayer = activeLayer === 'floors' ? 'floors' : 'ceils';
            if (gameData.map[mapLayer][z][x] !== activeAssetId) {
                saveHistory();
                gameData.map[mapLayer][z][x] = activeAssetId;
            }
        }
        renderGrid();
    };

    container.onpointerdown = (e) => { isDrawing = true; handlePaint(e.target); };
    window.onpointerup = () => isDrawing = false;
    container.onpointermove = (e) => { if(isDrawing) handlePaint(getTarget(e)); };

    for(let z=0; z<GRID_SIZE; z++) {
        for(let x=0; x<GRID_SIZE; x++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.dataset.pos = `${z},${x}`;
            
            const floorId = gameData.map.floors[z][x];
            const ceilId = gameData.map.ceils[z][x];
            const entId = gameData.map.entities[z][x];

            const f = gameData.palette.floors.find(i=>i.id===floorId);
            if (f) cell.style.backgroundImage = `url(${resolveAsset(f.tex)})`;
            
            if (entId !== ID_EMPTY) {
                const overlay = document.createElement('div');
                overlay.className = 'absolute inset-0 pointer-events-none';
                if (entId === ID_PLAYER) overlay.style.backgroundColor = 'rgba(59, 130, 246, 0.5)';
                else if (entId === ID_GOAL) overlay.style.backgroundImage = `url(${resolveAsset('goal')})`;
                else {
                    const e = findAssetInPalette(entId);
                    if (e) overlay.style.backgroundImage = `url(${resolveAsset(e.item.tex)})`;
                }
                overlay.style.backgroundSize = 'contain';
                overlay.style.backgroundRepeat = 'no-repeat';
                overlay.style.backgroundPosition = 'center';
                cell.appendChild(overlay);
            }

            if (activeLayer === 'ceils') {
                const c = gameData.palette.ceils.find(i=>i.id===ceilId);
                const ceilOverlay = document.createElement('div');
                ceilOverlay.className = 'absolute inset-0 pointer-events-none opacity-50';
                if (c) ceilOverlay.style.backgroundImage = `url(${resolveAsset(c.tex)})`;
                cell.appendChild(ceilOverlay);
            }

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

function openInspector(id) {
    const found = findAssetInPalette(id);
    if (!found) return;
    
    inspectorTargetId = id;
    const { item, category } = found;
    const container = document.getElementById('inspector-fields');
    container.innerHTML = '';

// LISTEN FOR PIXURL OUTPUT
document.addEventListener('image-processed', (e) => {
    const dataUrl = e.detail.dataUrl;
    console.log("PixUrl Processed:", dataUrl);
    
    // Auto-fill active context
    const wizardTex = document.getElementById('wizard-tex');
    const inspectorTex = document.querySelector('#inspector-fields input[data-key="tex"]');
    
    if (wizardTex && !document.getElementById('asset-wizard').classList.contains('hidden')) {
        wizardTex.value = dataUrl;
    } else if (inspectorTex && inspectorTargetId) {
        inspectorTex.value = dataUrl;
        inspectorTex.dispatchEvent(new Event('change'));
    }
});

const addField = (label, key, type = 'text') => {
    const group = document.createElement('div');
    group.className = 'input-group';
    
    let labelHtml = `<label>${label}</label>`;
    if (key === 'tex') {
        labelHtml = `<div class="mb-4">
            <label class="mb-2">${label}</label>
            <div class="border border-slate-700 rounded-xl overflow-hidden bg-slate-950 mt-2">
                <div class="bg-slate-800 px-3 py-1 text-[9px] font-black uppercase text-slate-400">PixUrl Tool</div>
                <pixurl-utility></pixurl-utility>
            </div>
        </div>`;
    }
    group.innerHTML = labelHtml;

    const input = document.createElement('input');
    input.type = type;
    if (key === 'tex') input.dataset.key = 'tex';
    input.value = (key === 'tex') ? (gameData.assets[item.tex] || '') : (item[key] || '');
        
        input.onchange = (e) => {
            if (key === 'tex') gameData.assets[item.tex] = e.target.value;
            else item[key] = type === 'number' ? Number(e.target.value) : e.target.value;
            renderUI();
        };
        group.appendChild(input);
        container.appendChild(group);
    };

    addField("Name", "name");
    addField("Image URL", "tex");
    
    // Power User: Advanced Data
    const dataGroup = document.createElement('div');
    dataGroup.className = 'input-group';
    dataGroup.innerHTML = `<label>Custom Data (JSON)</label>`;
    const area = document.createElement('textarea');
    area.className = 'w-full bg-slate-950 border border-slate-800 p-2 rounded text-xs font-mono text-emerald-400';
    area.rows = 4;
    const cleanItem = {...item}; delete cleanItem.id; delete cleanItem.name; delete cleanItem.tex;
    area.value = JSON.stringify(cleanItem, null, 2);
    area.onchange = (e) => {
        try {
            const data = JSON.parse(e.target.value);
            Object.assign(item, data);
            renderUI();
        } catch(err) { alert("Invalid JSON"); }
    };
    dataGroup.appendChild(area);
    container.appendChild(dataGroup);

    document.getElementById('inspector').style.display = 'block';
}

function closeInspector() {
    document.getElementById('inspector').style.display = 'none';
    inspectorTargetId = null;
}

let wizardType = 'walls';

function addNewAssetPrompt() {
    const wizard = document.getElementById('asset-wizard');
    document.getElementById('wizard-step-1').classList.remove('hidden');
    document.getElementById('wizard-step-2').classList.add('hidden');
    wizard.classList.remove('hidden');
    wizard.style.display = 'flex'; // Ensure flex for centering
}

function closeWizard() {
    const wizard = document.getElementById('asset-wizard');
    wizard.classList.add('hidden');
    wizard.style.display = 'none';
}

function selectWizardType(type) {
    wizardType = type;
    document.getElementById('wizard-step-1').classList.add('hidden');
    document.getElementById('wizard-step-2').classList.remove('hidden');
    document.getElementById('wizard-name').value = "New " + type.slice(0, -1);
    document.getElementById('wizard-tex').value = "";
}

function finalizeWizard() {
    const name = document.getElementById('wizard-name').value || "Unnamed Asset";
    const tex = document.getElementById('wizard-tex').value || "";
    
    let maxId = 0;
    for (let c in gameData.palette) {
        if (Array.isArray(gameData.palette[c])) {
            gameData.palette[c].forEach(i => maxId = Math.max(maxId, i.id));
        }
    }
    
    const id = maxId + 1;
    const newItem = { id, name, tex: tex ? `custom_${id}` : wizardType + "_" + id, color: "#ffffff" };
    
    // Additional properties based on type
    if (wizardType === 'enemies') { newItem.hp = 100; newItem.speed = 0.05; }
    if (wizardType === 'items') { newItem.type = 'score'; newItem.value = 100; }

    if (tex) gameData.assets[newItem.tex] = tex;
    
    gameData.palette[wizardType].push(newItem);
    activeAssetId = id;
    
    closeWizard();
    renderUI();
    openInspector(id);
}

function deleteActiveAsset() {
    if (!inspectorTargetId) return;
    for (let cat in gameData.palette) {
        const idx = gameData.palette[cat].findIndex(i => i.id === inspectorTargetId);
        if (idx !== -1) { gameData.palette[cat].splice(idx, 1); break; }
    }
    closeInspector();
    activeAssetId = ID_EMPTY;
    renderUI();
}

function downloadGame() {
    const a = document.createElement('a');
    a.href = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(gameData));
    a.download = gameData.title.replace(/\s+/g, '_') + ".json";
    a.click();
}

function importGame(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e) => { gameData = JSON.parse(e.target.result); renderUI(); };
    reader.readAsText(file);
}
