/**
 * ASSET GENERATOR (Canvas based fail-safes)
 */
function createAsset(type) {
    const c = document.createElement('canvas'); const ctx = c.getContext('2d');
    c.width = 64; c.height = 64;
    
    if(type.startsWith('wall')) {
        ctx.fillStyle = type==='wall1'?'#4a5568':'#2b6cb0'; ctx.fillRect(0,0,64,64);
        ctx.fillStyle = type==='wall1'?'#2d3748':'#2c5282';
        for(let i=0; i<64; i+=16) for(let j=0; j<64; j+=8) if(!((j/8)%2===0 && i%32===0)) ctx.fillRect(i+1, j+1, 14, 6);
    } else if(type.startsWith('floor')) {
        ctx.fillStyle = type==='floor1'?'#2d3748':'#486581'; ctx.fillRect(0,0,64,64);
        ctx.fillStyle = type==='floor1'?'#1a202c':'#334e68'; ctx.fillRect(0,0,32,32); ctx.fillRect(32,32,32,32);
    } else if(type.startsWith('ceil')) {
        ctx.fillStyle = type==='ceil1'?'#111827':'#3f2020'; ctx.fillRect(0,0,64,64);
        if(type==='ceil1') { ctx.fillStyle='#fff'; ctx.fillRect(10,10,2,2); ctx.fillRect(40,50,2,2); ctx.fillRect(50,20,2,2); }
    } else if(type==='goal') {
        ctx.fillStyle = '#22c55e'; ctx.fillRect(0,0,64,64); ctx.fillStyle = '#fff'; ctx.font = 'bold 18px sans-serif'; ctx.fillText('EXIT', 12, 38);
    } else if(type.startsWith('enemy')) {
        c.width=128; c.height=128; ctx.fillStyle = type==='enemy1'?'#ef4444':'#a855f7';
        ctx.beginPath(); ctx.arc(64,64,40,0,Math.PI*2); ctx.fill();
        ctx.fillStyle='#000'; ctx.fillRect(45,50,15,15); ctx.fillRect(70,50,15,15);
        ctx.fillStyle='#fff'; ctx.fillRect(50,80,28,10);
    } else if(type.startsWith('obj')) { // Barrel
        c.width=128; c.height=128; ctx.fillStyle = '#92400e'; ctx.fillRect(34, 20, 60, 88);
        ctx.fillStyle = '#000'; ctx.fillRect(34, 30, 60, 5); ctx.fillRect(34, 90, 60, 5);
    } else if(type.startsWith('item')) {
        c.width=128; c.height=128; 
        if(type==='item_hp') { ctx.fillStyle='#ef4444'; ctx.beginPath(); ctx.arc(64,80,30,0,Math.PI*2); ctx.fill(); ctx.fillRect(54,30,20,40); }
        else { ctx.fillStyle='#eab308'; ctx.beginPath(); ctx.arc(64,64,30,0,Math.PI*2); ctx.fill(); ctx.fillStyle='#000'; ctx.font='bold 40px Arial'; ctx.fillText('$', 52, 78); }
    } else if (type === 'gun') {
        c.width = 256; c.height = 256; ctx.fillStyle = '#374151'; ctx.fillRect(100, 150, 56, 150); 
        ctx.fillStyle = '#6b7280'; ctx.fillRect(115, 50, 26, 150); ctx.fillStyle = '#000'; ctx.fillRect(123, 40, 10, 20); 
    }
    return c.toDataURL('image/png');
}

// Preload Procedural Assets directly into gameData if empty
function resolveAsset(texKey) {
    if(gameData.assets[texKey]) return gameData.assets[texKey];
    const generated = createAsset(texKey);
    gameData.assets[texKey] = generated;
    return generated;
}

// Initial assets
gameData.assets.gun = createAsset('gun');
