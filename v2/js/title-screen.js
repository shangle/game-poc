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
                overflow: hidden;
            }

            .container {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                text-align: center;
                animation: fadeIn 0.4s ease-out;
                padding: 2rem;
                width: 100%;
                max-width: 400px;
                height: 100%;
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
                grid-template-columns: 1fr;
                gap: 0.5rem;
                width: 100%;
                max-height: 50vh;
                overflow-y: auto;
                padding-right: 0.5rem;
            }

            /* Scrollbar styling */
            .level-grid::-webkit-scrollbar { width: 4px; }
            .level-grid::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); }
            .level-grid::-webkit-scrollbar-thumb { background: #0ea5e9; border-radius: 10px; }

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
                width: 100%;
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
            ${this.renderContent(mode, unlocked)}
        </div>
        `;

        this.setupEvents();
    }

    renderContent(mode, unlocked) {
        if (mode === 'title') return this.renderMainMenu(unlocked);
        if (mode === 'levels') return this.renderLevelMenu();
        return this.renderOptionsMenu();
    }

    renderMainMenu(unlocked) {
        return `
            <h1>RETRO<br>QUEST</h1>
            <div class="subtitle">A New Beginning</div>
            
            <div class="menu">
                <button class="primary" id="start-btn">Start Game</button>
                ${unlocked ? `<button id="goto-levels-btn">Select Level</button>` : ''}
                <button id="options-btn">Options</button>
            </div>
        `;
    }

    renderLevelMenu() {
        const levelButtons = Cartridge.levels.map((lvl, index) => 
            `<button class="lvl-btn" data-index="${index}">${index + 1}. ${lvl.name}</button>`
        ).join('');

        return `
            <h1 style="font-size: 3rem;">LEVELS</h1>
            <div class="subtitle">Select Area</div>
            <div class="menu">
                <div class="level-grid">
                    ${levelButtons}
                </div>
                <button class="primary" id="back-to-main-btn" style="margin-top: 1rem;">Back</button>
            </div>
        `;
    }

    renderOptionsMenu() {
        return `
            <h1 style="font-size: 3rem;">OPTIONS</h1>
            <div class="subtitle">Customize Engine</div>
            
            <div class="menu">
                <div style="text-align: left; margin-bottom: 1rem;">
                    <label style="font-size: 0.7rem; font-weight: 900; color: #64748b; text-transform: uppercase;">Sensitivity</label>
                    <input type="range" id="sense-slider" min="0.0005" max="0.01" step="0.0005" value="${window.gameEngine.settings.sensitivity}" style="width: 100%;">
                </div>
                <button class="primary" id="back-btn">Apply & Back</button>
            </div>
        `;
    }

    setupEvents() {
        const getById = (id) => this.shadowRoot.getElementById(id);
        
        if (getById('start-btn')) getById('start-btn').onclick = () => this.dispatchEvent(new CustomEvent('start-game', { bubbles: true, composed: true }));
        if (getById('goto-levels-btn')) getById('goto-levels-btn').onclick = () => this.setAttribute('mode', 'levels');
        if (getById('options-btn')) getById('options-btn').onclick = () => this.setAttribute('mode', 'options');
        if (getById('back-to-main-btn')) getById('back-to-main-btn').onclick = () => this.setAttribute('mode', 'title');
        
        if (getById('back-btn')) {
            getById('back-btn').onclick = () => {
                const sense = parseFloat(getById('sense-slider').value);
                window.gameEngine.settings.sensitivity = sense;
                this.setAttribute('mode', 'title');
            };
        }

        this.shadowRoot.querySelectorAll('.lvl-btn').forEach(btn => {
            btn.onclick = () => this.selectLevel(parseInt(btn.dataset.index));
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
