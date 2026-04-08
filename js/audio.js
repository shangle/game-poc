/**
 * AUDIO ENGINE (Web Audio API)
 */
const AudioEngine = {
    ctx: null,
    masterGain: null,
    musicGain: null,
    sfxGain: null,

    init() {
        if (this.ctx) return;
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.masterGain = this.ctx.createGain();
        this.masterGain.connect(this.ctx.destination);
        
        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.value = 0.3;
        this.musicGain.connect(this.masterGain);

        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.value = 0.5;
        this.sfxGain.connect(this.masterGain);
    },

    resume() {
        if (!this.ctx) this.init();
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    },

    playSFX(type) {
        this.init();
        this.resume();
        const t = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const g = this.ctx.createGain();
        osc.connect(g);
        g.connect(this.sfxGain);

        if (type === 'shoot') {
            osc.type = 'square';
            osc.frequency.setValueAtTime(400, t);
            osc.frequency.exponentialRampToValueAtTime(50, t + 0.1);
            g.gain.setValueAtTime(0.5, t);
            g.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
            osc.start(t);
            osc.stop(t + 0.1);
        } 
        else if (type === 'hit') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(150, t);
            osc.frequency.linearRampToValueAtTime(50, t + 0.1);
            g.gain.setValueAtTime(0.4, t);
            g.gain.linearRampToValueAtTime(0.01, t + 0.1);
            osc.start(t);
            osc.stop(t + 0.1);
        }
        else if (type === 'collect') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, t);
            osc.frequency.exponentialRampToValueAtTime(1200, t + 0.05);
            g.gain.setValueAtTime(0.3, t);
            g.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
            osc.start(t);
            osc.stop(t + 0.2);
        }
        else if (type === 'death') {
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(100, t);
            osc.frequency.linearRampToValueAtTime(20, t + 0.5);
            g.gain.setValueAtTime(0.5, t);
            g.gain.linearRampToValueAtTime(0.01, t + 0.5);
            osc.start(t);
            osc.stop(t + 0.5);
        }
        else if (type === 'win') {
            osc.type = 'square';
            [523.25, 659.25, 783.99, 1046.50].forEach((f, i) => {
                const o = this.ctx.createOscillator();
                const gn = this.ctx.createGain();
                o.type = 'square';
                o.frequency.value = f;
                o.connect(gn);
                gn.connect(this.sfxGain);
                gn.gain.setValueAtTime(0.2, t + i * 0.1);
                gn.gain.exponentialRampToValueAtTime(0.01, t + i * 0.1 + 0.2);
                o.start(t + i * 0.1);
                o.stop(t + i * 0.1 + 0.2);
            });
        }
    },

    // A very simple 8-bit style loop
    musicNode: null,
    startMusic() {
        this.init();
        this.resume();
        if (this.musicNode) return;

        const loop = () => {
            const t = this.ctx.currentTime;
            const sequence = [110, 110, 123.47, 110, 146.83, 110, 123.47, 98];
            sequence.forEach((freq, i) => {
                const osc = this.ctx.createOscillator();
                const g = this.ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.value = freq;
                osc.connect(g);
                g.connect(this.musicGain);
                g.gain.setValueAtTime(0.1, t + i * 0.2);
                g.gain.exponentialRampToValueAtTime(0.01, t + i * 0.2 + 0.15);
                osc.start(t + i * 0.2);
                osc.stop(t + i * 0.2 + 0.15);
            });
            this.musicNode = setTimeout(loop, sequence.length * 200);
        };
        loop();
    },

    stopMusic() {
        if (this.musicNode) {
            clearTimeout(this.musicNode);
            this.musicNode = null;
        }
    }
};
