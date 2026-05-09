/**
 * RETRO STUDIO: MENU EDITOR LOGIC
 */

class MenuEditor {
    constructor() {
        this.state = {
            title: "RETRO QUEST",
            version: "1.0.0",
            author: "Michael",
            theme: {
                bgStart: "#1e293b",
                bgEnd: "#020617",
                textColor: "#f8fafc",
                accentColor: "#0ea5e9"
            },
            menuButtons: {
                start: true,
                load: false,
                options: true,
                levels: true
            }
        };

        this.init();
    }

    init() {
        // Bind inputs
        this.bindInput('game-title', 'title');
        this.bindInput('game-version', 'version');
        this.bindInput('game-author', 'author');
        this.bindInput('color-bg-start', 'theme.bgStart');
        this.bindInput('color-bg-end', 'theme.bgEnd');
        this.bindInput('color-text', 'theme.textColor');
        this.bindInput('color-accent', 'theme.accentColor');

        document.getElementById('export-btn').onclick = () => this.exportJson();
        
        const importBtn = document.getElementById('import-btn');
        const importFile = document.getElementById('import-file');
        importBtn.onclick = () => importFile.click();
        importFile.onchange = (e) => this.importJson(e);
        
        this.updatePreview();
    }

    importJson(e) {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                this.state = { ...this.state, ...data };
                this.syncInputs();
                this.updatePreview();
            } catch (err) { alert("Invalid JSON file"); }
        };
        reader.readAsText(file);
    }

    syncInputs() {
        // Simple sync for the flattened fields we have
        document.getElementById('game-title').value = this.state.title;
        document.getElementById('game-version').value = this.state.version;
        document.getElementById('game-author').value = this.state.author;
        document.getElementById('color-bg-start').value = this.state.theme.bgStart;
        document.getElementById('color-bg-end').value = this.state.theme.bgEnd;
        document.getElementById('color-text').value = this.state.theme.textColor;
        document.getElementById('color-accent').value = this.state.theme.accentColor;
    }

    bindInput(id, path) {
        const el = document.getElementById(id);
        if (!el) return;

        // Set initial value
        const val = path.split('.').reduce((obj, key) => obj[key], this.state);
        el.value = val;

        el.oninput = (e) => {
            const keys = path.split('.');
            let obj = this.state;
            for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
            obj[keys[keys.length - 1]] = e.target.value;
            this.updatePreview();
        };
    }

    updatePreview() {
        const preview = document.getElementById('title-preview');
        if (!preview) return;

        // Directly update the preview component's data
        // We'll pass the state as a stringified attribute to the custom element
        preview.setAttribute('data-config', JSON.stringify(this.state));
    }

    exportJson() {
        const data = JSON.stringify(this.state, null, 4);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.state.title.toLowerCase().replace(/\s+/g, '-')}-metadata.json`;
        a.click();
    }
}

// Custom Element for the Live Preview
class StudioPreview extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() { return ['data-config']; }

    attributeChangedCallback() {
        this.render();
    }

    render() {
        const config = JSON.parse(this.getAttribute('data-config') || '{}');
        const theme = config.theme || {};

        this.shadowRoot.innerHTML = `
        <style>
            :host {
                display: flex;
                width: 100%;
                height: 100%;
                background: radial-gradient(circle at 50% 50%, ${theme.bgStart} 0%, ${theme.bgEnd} 100%);
                color: ${theme.textColor};
                font-family: sans-serif;
                align-items: center;
                justify-content: center;
                text-align: center;
            }
            h1 { 
                font-size: 2rem; 
                text-transform: uppercase; 
                margin-bottom: 0.5rem;
                filter: drop-shadow(0 4px 0 ${theme.accentColor}44);
            }
            .subtitle { font-size: 0.5rem; letter-spacing: 0.2em; color: ${theme.accentColor}; margin-bottom: 2rem; }
            .menu { display: flex; flex-direction: column; gap: 0.5rem; padding: 0 2rem; }
            button {
                padding: 0.6rem;
                border-radius: 0.5rem;
                background: #1e293b88;
                border: 1px solid white;
                color: white;
                font-size: 0.6rem;
                font-weight: bold;
                text-transform: uppercase;
            }
            button.primary { background: ${theme.accentColor}; border: none; }
        </style>
        <div>
            <h1>${config.title.replace(/\n/g, '<br>')}</h1>
            <div class="subtitle">BY ${config.author.toUpperCase()}</div>
            <div class="menu">
                <button class="primary">Start Game</button>
                <button>Select Level</button>
                <button>Options</button>
            </div>
        </div>
        `;
    }
}

customElements.define('studio-preview', StudioPreview);
window.menuEditor = new MenuEditor();
