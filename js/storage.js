/**
 * LOCAL STORAGE PERSISTENCE
 */

const STORAGE_KEY = 'retro_engine_save';

function saveToLocalStorage() {
    try {
        const data = JSON.stringify(gameData);
        localStorage.setItem(STORAGE_KEY, data);
        console.log("Game saved to LocalStorage");
        showToast("Project saved to browser!");
    } catch (e) {
        console.error("Failed to save to LocalStorage", e);
        showToast("Save failed!", true);
    }
}

function loadFromLocalStorage() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        if (data) {
            gameData = JSON.parse(data);
            console.log("Game loaded from LocalStorage");
            if (typeof renderUI === 'function') renderUI();
            showToast("Project loaded from browser!");
            return true;
        }
    } catch (e) {
        console.error("Failed to load from LocalStorage", e);
    }
    return false;
}

function hasSavedGame() {
    return !!localStorage.getItem(STORAGE_KEY);
}

/**
 * UI FEEDBACK
 */
function showToast(message, isError = false) {
    const toast = document.createElement('div');
    toast.className = `fixed bottom-24 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full font-black text-xs uppercase tracking-widest z-50 transition-all transform translate-y-10 opacity-0`;
    toast.style.backgroundColor = isError ? '#ef4444' : '#10b981';
    toast.style.color = '#fff';
    toast.innerText = message;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.classList.remove('translate-y-10', 'opacity-0');
    }, 10);
    
    // Animate out
    setTimeout(() => {
        toast.classList.add('translate-y-10', 'opacity-0');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}
