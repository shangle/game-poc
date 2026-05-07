class GameTitleScreen extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    static get observedAttributes() {
        return ['unlocked', 'mode'];
    }

    attributeChangedCallback() {
        this.render();
    }

    render() {
        const unlocked = this.getAttribute('unlocked') === 'true';
        const mode = this.getAttribute('mode') || 'title';

        this.shadowRoot.innerHTML = `
        <style>
            :host {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                width: 100%;
                height: 100%;
                background: radial-gradient(circle at 50% 50%, #1e293b 0%, #020617 100%);
                color: #f8fafc;
                font-family: 'Inter', system-ui, sans-serif;
                overflow-y: auto;
            }

            .container {
                text-align: center;
                animation: fadeIn 0.4s ease-out;
                padding: 2rem;
                width: 100%;
                max-width: 400px;
            }

            h1 {
                font-size: clamp(3rem, 12vw, 5rem);
                font-weight: 900;
                letter-spacing: -0.05em;
                line-height: 0.8;
                text-transform: uppercase;
                margin-bottom: 0.5rem;
                background: linear-gradient(to bottom, #fff, #94a3b8);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                filter: drop-shadow(0 10px 0 rgba(14, 165, 233, 0.2));
            }

            .subtitle {
                color: #0ea5e9;
                font-weight: 900;
                letter-spacing: 0.5em;
                text-transform: uppercase;
                font-size: 0.7rem;
                margin-bottom: 2rem;
            }

            .menu {
                display: flex;
                flex-direction: column;
                gap: 0.75rem;
                width: 100%;
            }

            .level-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 0.5rem;
                margin-top: 1rem;
                border-top: 1px solid rgba(255,255,255,0.1);
                padding-top: 1rem;
            }

            .level-grid h3 {
                grid-column: span 2;
                font-size: 0.6rem;
                text-transform: uppercase;
                letter-spacing: 0.2em;
                color: #64748b;
                margin-bottom: 0.5rem;
            }

            .option-group {
                text-align: left;
                margin-bottom: 1.5rem;
            }

            .option-group label {
                display: block;
                font-size: 0.7rem;
                font-weight: 900;
                text-transform: uppercase;
                color: #64748b;
                margin-bottom: 0.5rem;
            }

            input[type="range"] {
                width: 100%;
                cursor: pointer;
            }

            button {
                appearance: none;
                background: #1e293b;
                border: 1px solid rgba(255, 255, 255, 0.05);
                color: #94a3b8;
                cursor: pointer;
                font-family: inherit;
                font-weight: 900;
                text-transform: uppercase;
                padding: 1rem;
                border-radius: 0.75rem;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                letter-spacing: 0.1em;
                font-size: 0.8rem;
            }

            button.primary {
                background: #0ea5e9;
                color: white;
                box-shadow: 0 4px 0 #0369a1;
                border: none;
            }

            button:hover {
                background: #334155;
                color: #fff;
                transform: translateY(-2px);
            }

            button.primary:hover {
                background: #38bdf8;
            }

            button:active {
                transform: translateY(1px);
            }

            button.primary:active {
                transform: translateY(2px);
                box-shadow: 0 1px 0 #0369a1;
            }

            @keyframes fadeIn {
                from { opacity: 0; transform: scale(0.98); }
                to { opacity: 1; transform: scale(1); }
            }
        </style>
        <div class="container">
            ${mode === 'title' ? this.renderMainMenu(unlocked) : this.renderOptionsMenu()}
        </div>
        `;

        this.setupEvents();
    }

    renderMainMenu(unlocked) {
        const levelButtons = Cartridge.levels.map((lvl, index) => 
            `<button class="lvl-btn" data-index="${index}">Lvl ${index + 1}: ${lvl.name}</button>`
        ).join('');

        return `
            <h1>RETRO<br>QUEST</h1>
            <div class="subtitle">A New Beginning</div>
            
            <div class="menu">
                <button class="primary" id="start-btn">Start Game</button>
                
                ${unlocked ? `
                <div class="level-grid">
                    <h3>Select Level</h3>
                    ${levelButtons}
                </div>
                ` : ''}
                
                <button id="options-btn">Options</button>
            </div>
        `;
    }

    renderOptionsMenu() {
        return `
            <h1 style="font-size: 3rem;">OPTIONS</h1>
            <div class="subtitle">Customize Engine</div>
            
            <div class="menu">
                <div class="option-group">
                    <label>Mouse Sensitivity</label>
                    <input type="range" id="sense-slider" min="0.0005" max="0.01" step="0.0005" value="${window.gameEngine.settings.sensitivity}">
                </div>
                <div class="option-group">
                    <label>Field of View (FOV)</label>
                    <input type="range" id="fov-slider" min="60" max="110" step="5" value="${window.gameEngine.settings.fov}">
                </div>
                <button class="primary" id="back-btn">Apply & Back</button>
            </div>
        `;
    }

    setupEvents() {
        const startBtn = this.shadowRoot.getElementById('start-btn');
        if (startBtn) {
            startBtn.onclick = () => {
                console.log("Title Screen: Dispatching start-game");
                this.dispatchEvent(new CustomEvent('start-game', { 
                    bubbles: true, 
                    composed: true 
                }));
            };
        }

        const optionsBtn = this.shadowRoot.getElementById('options-btn');
        if (optionsBtn) {
            optionsBtn.onclick = () => this.setAttribute('mode', 'options');
        }

        const backBtn = this.shadowRoot.getElementById('back-btn');
        if (backBtn) {
            backBtn.onclick = () => {
                const sense = parseFloat(this.shadowRoot.getElementById('sense-slider').value);
                const fov = parseInt(this.shadowRoot.getElementById('fov-slider').value);
                window.gameEngine.settings.sensitivity = sense;
                window.gameEngine.settings.fov = fov;
                window.gameEngine.camera.fov = fov;
                window.gameEngine.camera.updateProjectionMatrix();
                this.setAttribute('mode', 'title');
            };
        }

        this.shadowRoot.querySelectorAll('.lvl-btn').forEach(btn => {
            btn.onclick = () => {
                console.log("Title Screen: Dispatching select-level", btn.dataset.index);
                this.selectLevel(parseInt(btn.dataset.index));
            };
        });
    }

    selectLevel(index) {
        this.dispatchEvent(new CustomEvent('select-level', { 
            detail: { index }, 
            bubbles: true, 
            composed: true 
        }));
    }
}

customElements.define('game-title-screen', GameTitleScreen);
