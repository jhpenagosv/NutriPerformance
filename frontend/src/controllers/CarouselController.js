export class CarouselController {
    constructor({ intervalMs = 4500 } = {}) {
        this.state = { index: 0, playing: true };
        this.intervalMs = intervalMs;
        this._timer = null;
        this._subs = new Set();
    }

    subscribe(fn) { this._subs.add(fn); try { fn(this.snapshot()); } catch { } return () => this._subs.delete(fn); }
    _emit() { const s = this.snapshot(); for (const fn of this._subs) fn(s); }
    snapshot() { return { ...this.state }; }
    next(total) { this.state.index = (this.state.index + 1) % total; this._emit(); }
    prev(total) { this.state.index = (this.state.index - 1 + total) % total; this._emit(); }
    goTo(i, total) { this.state.index = ((i % total) + total) % total; this._emit(); }

    play(total) {
        if (this._timer) return;
        this.state.playing = true; this._emit();
        this._timer = setInterval(() => this.next(total), this.intervalMs);
    }
    pause() {
        this.state.playing = false; this._emit();
        if (this._timer) { clearInterval(this._timer); this._timer = null; }
    }
    destroy() { this.pause(); this._subs.clear(); }
}