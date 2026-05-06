class GameTitleScreen extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
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
            }

            .container {
                text-align: center;
                animation: fadeIn 0.8s ease-out;
            }

            h1 {
                font-size: clamp(4rem, 15vw, 8rem);
                font-weight: 900;
                letter-spacing: -0.05em;
                line-height: 0.8;
                text-transform: uppercase;
                margin-bottom: 1rem;
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
                font-size: 0.8rem;
                margin-bottom: 4rem;
            }

            .menu {
                display: flex;
                flex-direction: column;
                gap: 1rem;
                width: 100%;
                max-width: 300px;
                margin: 0 auto;
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
                padding: 1.25rem;
                border-radius: 1rem;
                transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                letter-spacing: 0.1em;
            }

            button.primary {
                background: #0ea5e9;
                color: white;
                box-shadow: 0 6px 0 #0369a1;
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
                transform: translateY(2px);
            }

            button.primary:active {
                transform: translateY(4px);
                box-shadow: 0 2px 0 #0369a1;
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
                <button id="load-btn">Load Save</button>
                <button id="options-btn">Options</button>
            </div>
        </div>
        `;

        this.shadowRoot.getElementById('start-btn').onclick = () => {
            this.dispatchEvent(new CustomEvent('start-game', { bubbles: true, composed: true }));
        };
    }
}

customElements.define('game-title-screen', GameTitleScreen);
