// Space-themed Sound Effects Utility
// Uses Web Audio API to generate synthesized sci-fi sounds

class SpaceSounds {
    constructor() {
        this.audioContext = null;
        this.enabled = true;
        this.volume = 0.3;
        this.init();
    }

    init() {
        // Initialize AudioContext on first user interaction
        const initAudio = () => {
            if (!this.audioContext) {
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            document.removeEventListener('click', initAudio);
            document.removeEventListener('keydown', initAudio);
        };
        document.addEventListener('click', initAudio);
        document.addEventListener('keydown', initAudio);
    }

    ensureContext() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        return this.audioContext;
    }

    // Soft click sound - for buttons and selections
    click() {
        if (!this.enabled) return;
        const ctx = this.ensureContext();
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.1);

        gain.gain.setValueAtTime(this.volume * 0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

        osc.start(now);
        osc.stop(now + 0.1);
    }

    // Hover sound - subtle feedback
    hover() {
        if (!this.enabled) return;
        const ctx = this.ensureContext();
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, now);
        osc.frequency.exponentialRampToValueAtTime(1400, now + 0.05);

        gain.gain.setValueAtTime(this.volume * 0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        osc.start(now);
        osc.stop(now + 0.05);
    }

    // Open popup/modal sound - ascending whoosh
    openPopup() {
        if (!this.enabled) return;
        const ctx = this.ensureContext();
        const now = ctx.currentTime;

        // Main tone
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc1.connect(filter);
        filter.connect(gain1);
        gain1.connect(ctx.destination);

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(200, now);
        osc1.frequency.exponentialRampToValueAtTime(600, now + 0.15);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(800, now);
        filter.frequency.exponentialRampToValueAtTime(2000, now + 0.15);

        gain1.gain.setValueAtTime(this.volume * 0.5, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

        osc1.start(now);
        osc1.stop(now + 0.2);

        // Shimmer overlay
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();

        osc2.connect(gain2);
        gain2.connect(ctx.destination);

        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(1200, now);
        osc2.frequency.exponentialRampToValueAtTime(1800, now + 0.1);

        gain2.gain.setValueAtTime(this.volume * 0.2, now);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

        osc2.start(now);
        osc2.stop(now + 0.15);
    }

    // Close popup/modal sound - descending whoosh
    closePopup() {
        if (!this.enabled) return;
        const ctx = this.ensureContext();
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(500, now);
        osc.frequency.exponentialRampToValueAtTime(150, now + 0.15);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(2000, now);
        filter.frequency.exponentialRampToValueAtTime(400, now + 0.15);

        gain.gain.setValueAtTime(this.volume * 0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

        osc.start(now);
        osc.stop(now + 0.15);
    }

    // Tab switch sound - digital transition
    tabSwitch() {
        if (!this.enabled) return;
        const ctx = this.ensureContext();
        const now = ctx.currentTime;

        // First beep
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();

        osc1.connect(gain1);
        gain1.connect(ctx.destination);

        osc1.type = 'square';
        osc1.frequency.setValueAtTime(880, now);

        gain1.gain.setValueAtTime(this.volume * 0.15, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

        osc1.start(now);
        osc1.stop(now + 0.05);

        // Second beep (higher)
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();

        osc2.connect(gain2);
        gain2.connect(ctx.destination);

        osc2.type = 'square';
        osc2.frequency.setValueAtTime(1100, now + 0.05);

        gain2.gain.setValueAtTime(0, now);
        gain2.gain.setValueAtTime(this.volume * 0.2, now + 0.05);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

        osc2.start(now + 0.05);
        osc2.stop(now + 0.1);
    }

    // Success/confirm sound
    success() {
        if (!this.enabled) return;
        const ctx = this.ensureContext();
        const now = ctx.currentTime;

        const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5 chord

        frequencies.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + i * 0.05);

            gain.gain.setValueAtTime(0, now);
            gain.gain.setValueAtTime(this.volume * 0.25, now + i * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3 + i * 0.05);

            osc.start(now + i * 0.05);
            osc.stop(now + 0.35 + i * 0.05);
        });
    }

    // Error/warning sound
    error() {
        if (!this.enabled) return;
        const ctx = this.ensureContext();
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.setValueAtTime(150, now + 0.1);
        osc.frequency.setValueAtTime(200, now + 0.2);

        gain.gain.setValueAtTime(this.volume * 0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

        osc.start(now);
        osc.stop(now + 0.3);
    }

    // Select/checkbox toggle
    select() {
        if (!this.enabled) return;
        const ctx = this.ensureContext();
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(900, now + 0.08);

        gain.gain.setValueAtTime(this.volume * 0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        osc.start(now);
        osc.stop(now + 0.08);
    }

    // Deselect/uncheck
    deselect() {
        if (!this.enabled) return;
        const ctx = this.ensureContext();
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(700, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.08);

        gain.gain.setValueAtTime(this.volume * 0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

        osc.start(now);
        osc.stop(now + 0.08);
    }

    // Expand/collapse sound
    expand() {
        if (!this.enabled) return;
        const ctx = this.ensureContext();
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(500, now + 0.1);

        gain.gain.setValueAtTime(this.volume * 0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

        osc.start(now);
        osc.stop(now + 0.1);
    }

    // Collapse sound
    collapse() {
        if (!this.enabled) return;
        const ctx = this.ensureContext();
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(500, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.1);

        gain.gain.setValueAtTime(this.volume * 0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

        osc.start(now);
        osc.stop(now + 0.1);
    }

    // Sci-fi scan/data loading sound
    scan() {
        if (!this.enabled) return;
        const ctx = this.ensureContext();
        const now = ctx.currentTime;

        for (let i = 0; i < 5; i++) {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.type = 'sine';
            const startFreq = 400 + i * 200;
            osc.frequency.setValueAtTime(startFreq, now + i * 0.05);
            osc.frequency.exponentialRampToValueAtTime(startFreq * 1.5, now + i * 0.05 + 0.03);

            gain.gain.setValueAtTime(this.volume * 0.15, now + i * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.05);

            osc.start(now + i * 0.05);
            osc.stop(now + i * 0.05 + 0.05);
        }
    }

    // Toggle sounds on/off
    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }

    setVolume(vol) {
        this.volume = Math.max(0, Math.min(1, vol));
    }
}

// Create global instance
window.spaceSounds = new SpaceSounds();
