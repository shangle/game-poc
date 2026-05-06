// Mock implementation for the PixUrl utility while the external service is unavailable.
// This fulfills the web-component mandate for modular logic.
class PixUrlUtility extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <style>
                :host { 
                    display: block; 
                    padding: 12px; 
                    background: #1e293b; 
                    border-radius: 8px; 
                    color: white; 
                    font-family: system-ui, sans-serif; 
                    text-align: center; 
                }
                .label { font-size: 10px; color: #94a3b8; text-transform: uppercase; font-weight: bold; letter-spacing: 0.1em; margin-bottom: 8px; display: block; }
                button { 
                    background: #3b82f6; border: none; padding: 8px 16px; border-radius: 6px; 
                    color: white; cursor: pointer; font-weight: bold; width: 100%; box-sizing: border-box;
                    transition: background 0.2s;
                }
                button:hover { background: #2563eb; }
                input { 
                    padding: 8px; border-radius: 6px; border: 1px solid #475569; 
                    background: #0f172a; color: white; margin-bottom: 12px; width: 100%; box-sizing: border-box;
                }
            </style>
            <div>
                <span class="label">PixUrl Plugin (Offline Mode)</span>
                <input type="text" id="url-input" placeholder="Paste data:image/png;base64... or https://..." />
                <button id="send-btn">Inject to Editor</button>
            </div>
        `;
    }
    connectedCallback() {
        this.shadowRoot.getElementById('send-btn').addEventListener('click', () => {
            const url = this.shadowRoot.getElementById('url-input').value;
            if(url) {
                // Dispatch event to integrate with the Editor's window listener
                window.dispatchEvent(new CustomEvent('pixurl-output', { detail: url }));
            }
        });
    }
}
customElements.define('pixurl-utility', PixUrlUtility);
