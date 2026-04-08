/**
 * UI CONTROLLERS
 */
function switchTab(tabId) {
    document.querySelectorAll('.tab-btn').forEach(b => { b.classList.remove('active'); b.classList.add('text-gray-400'); });
    document.querySelectorAll('[id^="content-"]').forEach(c => c.classList.add('hidden'));
    document.getElementById('tab-'+tabId).classList.add('active');
    document.getElementById('tab-'+tabId).classList.remove('text-gray-400');
    document.getElementById('content-'+tabId).classList.remove('hidden');
}

function setLayer(layer) {
    activeLayer = layer;
    document.querySelectorAll('[id^="btn-layer-"]').forEach(b => {
        b.classList.remove('bg-blue-600', 'text-white');
        b.classList.add('bg-gray-700', 'text-gray-300');
    });
    const activeBtn = document.getElementById('btn-layer-'+layer);
    activeBtn.classList.remove('bg-gray-700', 'text-gray-300');
    activeBtn.classList.add('bg-blue-600', 'text-white');
    
    document.getElementById('grid-label').innerText = "Painting: " + layer.charAt(0).toUpperCase() + layer.slice(1);
    
    // Set default paint brush based on layer
    if(layer === 'floors' && gameData.palette.floors.length) setPaint(gameData.palette.floors[0].id);
    else if(layer === 'ceils' && gameData.palette.ceils.length) setPaint(gameData.palette.ceils[0].id);
    else if(layer === 'entities' && gameData.palette.walls.length) setPaint(gameData.palette.walls[0].id);
    else setPaint(ID_EMPTY);

    renderPalette();
    renderGrid();
}

function setPaint(id) { currentPaintId = id; renderPalette(); }

function renderPalette() {
    let html = `<div class="palette-item p-1 px-2 rounded flex items-center gap-2 ${currentPaintId===ID_EMPTY?'selected':''}" onclick="setPaint(${ID_EMPTY})">
        <div class="w-4 h-4 bg-gray-900 border border-gray-600"></div><span class="text-xs">Erase</span>
    </div>`;

    if(activeLayer === 'entities') {
        html += `<div class="palette-item p-1 px-2 rounded flex items-center gap-2 ${currentPaintId===ID_PLAYER?'selected':''}" onclick="setPaint(${ID_PLAYER})">
            <div class="w-4 h-4 bg-blue-500 rounded-full border border-white"></div><span class="text-xs font-bold text-blue-400">P. Start</span>
        </div>`;
        html += `<div class="palette-item p-1 px-2 rounded flex items-center gap-2 ${currentPaintId===ID_GOAL?'selected':''}" onclick="setPaint(${ID_GOAL})">
            <div class="w-4 h-4 bg-green-500 border border-white"></div><span class="text-xs font-bold text-green-400">Exit Goal</span>
        </div>`;
        
        const renderGroup = (arr, isCircle) => {
            arr.forEach(i => {
                html += `<div class="palette-item p-1 px-2 rounded flex items-center gap-2 ${currentPaintId===i.id?'selected':''}" onclick="setPaint(${i.id})">
                    <div class="w-4 h-4 ${isCircle?'rounded-full':''}" style="background-color: ${i.color}"></div><span class="text-xs">${i.name}</span>
                </div>`;
            });
        };
        renderGroup(gameData.palette.walls, false);
        renderGroup(gameData.palette.enemies, true);
        renderGroup(gameData.palette.objects, true);
        renderGroup(gameData.palette.items, true);
        document.getElementById('palette-title').innerText = "Palette (Entities & Logic)";
    } 
    else if (activeLayer === 'floors') {
        gameData.palette.floors.forEach(i => {
            html += `<div class="palette-item p-1 px-2 rounded flex items-center gap-2 ${currentPaintId===i.id?'selected':''}" onclick="setPaint(${i.id})">
                <div class="w-4 h-4 border border-gray-500" style="background-color: ${i.color}"></div><span class="text-xs">${i.name}</span>
            </div>`;
        });
        document.getElementById('palette-title').innerText = "Palette (Floor Textures)";
    }
    else if (activeLayer === 'ceils') {
        gameData.palette.ceils.forEach(i => {
            html += `<div class="palette-item p-1 px-2 rounded flex items-center gap-2 ${currentPaintId===i.id?'selected':''}" onclick="setPaint(${i.id})">
                <div class="w-4 h-4 border border-gray-500" style="background-color: ${i.color}"></div><span class="text-xs">${i.name}</span>
            </div>`;
        });
        document.getElementById('palette-title').innerText = "Palette (Ceiling Textures)";
    }

    document.getElementById('palette-container').innerHTML = html;
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
            cell.className = 'grid-cell relative';
            
            // Background color is Floor/Ceil based on layer. If Entities layer, show floor as faint background.
            const floorId = gameData.map.floors[z][x];
            const ceilId = gameData.map.ceils[z][x];
            const entId = gameData.map.entities[z][x];

            // Render Base Color
            if(activeLayer === 'ceils') {
                const cObj = gameData.palette.ceils.find(i=>i.id===ceilId);
                cell.style.backgroundColor = cObj ? cObj.color : '#000';
            } else {
                const fObj = gameData.palette.floors.find(i=>i.id===floorId);
                cell.style.backgroundColor = fObj ? fObj.color : '#000';
                if(activeLayer === 'entities') cell.style.opacity = '0.7'; // Dim floor to see entities better
            }

            // Render Entity Icon on top
            if(activeLayer === 'entities' && entId !== ID_EMPTY) {
                const entMarker = document.createElement('div');
                entMarker.className = 'absolute inset-0 m-auto';
                
                if(entId === ID_PLAYER) { entMarker.className += ' w-4 h-4 bg-blue-500 rounded-full border-2 border-white'; }
                else if(entId === ID_GOAL) { entMarker.className += ' w-4 h-4 bg-green-500 border-2 border-white'; }
                else {
                    let eObj = gameData.palette.walls.find(i=>i.id===entId) || 
                               gameData.palette.enemies.find(i=>i.id===entId) || 
                               gameData.palette.objects.find(i=>i.id===entId) || 
                               gameData.palette.items.find(i=>i.id===entId);
                    if(eObj) {
                        entMarker.style.backgroundColor = eObj.color;
                        entMarker.style.width = '80%'; entMarker.style.height = '80%';
                        if(!gameData.palette.walls.find(i=>i.id===entId)) entMarker.style.borderRadius = '50%'; // Sprites are circles
                    }
                }
                cell.appendChild(entMarker);
            }

            const paint = (e) => {
                e.preventDefault();
                if(activeLayer === 'entities') {
                    if(currentPaintId === ID_PLAYER || currentPaintId === ID_GOAL) {
                        // Enforce unique
                        for(let r=0; r<GRID_SIZE; r++) for(let c=0; c<GRID_SIZE; c++) 
                            if(gameData.map.entities[r][c] === currentPaintId) gameData.map.entities[r][c] = 0;
                    }
                    gameData.map.entities[z][x] = currentPaintId;
                } 
                else if (activeLayer === 'floors') gameData.map.floors[z][x] = currentPaintId;
                else if (activeLayer === 'ceils') gameData.map.ceils[z][x] = currentPaintId;
                renderGrid();
            };

            cell.onpointerdown = paint;
            cell.onpointerenter = (e) => { if(isDrawing) paint(e); };
            container.appendChild(cell);
        }
    }
}

function fillMap() {
    for(let z=0; z<GRID_SIZE; z++) {
        for(let x=0; x<GRID_SIZE; x++) {
            if(activeLayer === 'entities') gameData.map.entities[z][x] = currentPaintId;
            if(activeLayer === 'floors') gameData.map.floors[z][x] = currentPaintId;
            if(activeLayer === 'ceils') gameData.map.ceils[z][x] = currentPaintId;
        }
    }
    renderGrid();
}

/**
 * DB ASSET MANAGER UI
 */
function updateDBItem(category, id, key, val) {
    const item = gameData.palette[category].find(x => x.id === id);
    if(item) { item[key] = (key==='hp'||key==='speed'||key==='value')?Number(val):val; }
    renderPalette(); renderGrid();
}

function addDBItem(category) {
    const maxIdStr = category.substring(0, 3).toUpperCase(); // Hack to ensure unique ranges per category isn't strictly needed if we just Math.max all IDs.
    // Let's just find true max globally to be safe
    let maxId = 10;
    ['floors','ceils','walls','enemies','objects','items'].forEach(c => {
        gameData.palette[c].forEach(i => maxId = Math.max(maxId, i.id));
    });
    const id = maxId + 1;
    
    let base = { id, name: "New " + category, tex: category + "_" + id, color: "#ffffff" };
    if(category === 'enemies') base = { ...base, hp: 100, speed: 0.05 };
    if(category === 'items') base = { ...base, type: 'score', value: 50 };
    
    gameData.palette[category].push(base);
    renderDB(); renderPalette();
}

function renderDB() {
    let html = `
        <div class="bg-gray-800 p-3 rounded"><h4 class="text-xs font-bold text-gray-400 mb-2">Global Weapon</h4>
        <input type="text" value="${gameData.assets.gun || ''}" placeholder="Gun Sprite URL" onchange="gameData.assets.gun=this.value" class="w-full bg-gray-700 text-xs px-2 py-1 rounded text-white mb-1"></div>
    `;

    const buildCat = (catName, title, extraHTMLFn) => {
        let catHtml = `<div class="bg-gray-800 p-3 rounded"><h4 class="text-xs font-bold text-gray-400 mb-2 flex justify-between">${title} <button onclick="addDBItem('${catName}')" class="text-blue-400 hover:text-white">+</button></h4><div class="space-y-2">`;
        gameData.palette[catName].forEach(i => {
            if(!gameData.assets[i.tex]) gameData.assets[i.tex] = ""; // init
            catHtml += `<div class="bg-gray-900 p-2 rounded">
                <div class="flex gap-2 items-center mb-1">
                    <input type="color" value="${i.color}" onchange="updateDBItem('${catName}', ${i.id}, 'color', this.value)" class="w-6 h-6 cursor-pointer">
                    <input type="text" value="${i.name}" onchange="updateDBItem('${catName}', ${i.id}, 'name', this.value)" class="flex-1 bg-gray-700 text-xs px-2 py-1 rounded text-white">
                </div>
                <input type="text" value="${gameData.assets[i.tex]}" placeholder="Texture/Sprite URL" onchange="gameData.assets['${i.tex}']=this.value" class="w-full bg-gray-700 text-xs px-2 py-1 rounded text-white mb-1">
                ${extraHTMLFn ? extraHTMLFn(i) : ''}
            </div>`;
        });
        return catHtml + `</div></div>`;
    };

    html += buildCat('walls', 'Walls (Blocks)', null);
    html += buildCat('floors', 'Floors', null);
    html += buildCat('ceils', 'Ceilings', null);
    html += buildCat('objects', 'Objects (Solid)', null);
    
    html += buildCat('enemies', 'Enemies (Hostile)', (i) => `
        <div class="flex gap-2 text-xs text-gray-400">
            HP: <input type="number" value="${i.hp}" onchange="updateDBItem('enemies', ${i.id}, 'hp', this.value)" class="w-16 bg-gray-700 px-1 py-1 rounded text-white">
            Spd: <input type="number" step="0.01" value="${i.speed}" onchange="updateDBItem('enemies', ${i.id}, 'speed', this.value)" class="w-16 bg-gray-700 px-1 py-1 rounded text-white">
        </div>`);
        
    html += buildCat('items', 'Items (Collectible)', (i) => `
        <div class="flex gap-2 text-xs text-gray-400 items-center">
            Effect: <select onchange="updateDBItem('items', ${i.id}, 'type', this.value)" class="bg-gray-700 px-1 py-1 rounded text-white">
                <option value="score" ${i.type==='score'?'selected':''}>Score</option><option value="hp" ${i.type==='hp'?'selected':''}>Heal (HP)</option>
            </select>
            Val: <input type="number" value="${i.value}" onchange="updateDBItem('items', ${i.id}, 'value', this.value)" class="w-16 bg-gray-700 px-1 py-1 rounded text-white">
        </div>`);

    document.getElementById('db-categories').innerHTML = html;
}

function updateSettings() {
    gameData.title = document.getElementById('game-title-input').value || "MY RETRO ADVENTURE";
    gameData.startBg = document.getElementById('game-start-bg').value;
    document.getElementById('boot-title').innerText = gameData.title;
    if(gameData.startBg) document.getElementById('boot-screen').style.backgroundImage = `url(${gameData.startBg})`;
    else document.getElementById('boot-screen').style.backgroundImage = 'none';
}

function renderUI() {
    setLayer('entities');
    renderDB();
    document.getElementById('game-title-input').value = gameData.title;
    document.getElementById('game-start-bg').value = gameData.startBg || "";
    updateSettings();
}

/**
 * EXPORT / IMPORT
 */
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
        try { gameData = JSON.parse(e.target.result); renderUI(); alert("Game Loaded!"); } 
        catch(err) { alert("Invalid game file."); }
    };
    reader.readAsText(file);
}

function generateShareURL() {
    try {
        const b64 = btoa(encodeURIComponent(JSON.stringify(gameData)));
        window.location.hash = b64;
        navigator.clipboard.writeText(window.location.href).then(() => {
            const f = document.getElementById('share-feedback'); f.classList.remove('hidden'); setTimeout(() => f.classList.add('hidden'), 3000);
        }).catch(e => alert("Please copy URL manually from address bar."));
    } catch(e) { alert("Game data too large for URL link. Use Save Project instead."); }
}
