class GameTitleScreen extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    static get observedAttributes() {
        return ['unlocked'];
    }

    attributeChangedCallback() {
        this.render();
    }

    render() {
        const unlocked = this.getAttribute('unlocked') === 'true';
        const levelButtons = Cartridge.levels.map((lvl, index) => 
            `<button onclick="this.getRootNode().host.selectLevel(${index})">Lvl ${index + 1}: ${lvl.name}</button>`
        ).join('');

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
                animation: fadeIn 0.8s ease-out;
                padding: 2rem;
            }

            h1 {
                font-size: clamp(3rem, 12vw, 6rem);
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
                max-width: 320px;
                margin: 0 auto;
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
                from { opacity: 0; transform: scale(0.95); }
                to { opacity: 1; transform: scale(1); }
            }
        </style>
        <div class="container">
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
        </div>
        `;

        const startBtn = this.shadowRoot.getElementById('start-btn');
        if (startBtn) {
            startBtn.onclick = () => {
                this.dispatchEvent(new CustomEvent('start-game', { bubbles: true, composed: true }));
            };
        }
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
