import { createMessage, MessageVariant } from "../models/message.model";

export class MessageController {
    constructor() {
        this.state = { queue: [] };
        this.currentConfirm = null;
        this._subs = new Set();
    }

    subscribe(fn) { this._subs.add(fn); return () => this._subs.delete(fn); }
    _emit() { const snap = this.snapshot(); for (const fn of this._subs) fn(snap); }
    snapshot() {
        return {
            queue: [...this.state.queue],
            confirm: this.currentConfirm ? { ...this.currentConfirm } : null,
        };
    }

    show(opts) {
        const msg = createMessage(opts);
        if (msg.variant === MessageVariant.CONFIRM || msg.variant === MessageVariant.ALERT) {

            return msg.variant === MessageVariant.CONFIRM ? this.confirm(opts) : this.alert(opts);
        }
        this.state.queue = [...this.state.queue, msg];
        this._emit();
        if (msg.duration > 0) setTimeout(() => this.dismiss(msg.id), msg.duration);
        return msg.id;
    }
    dismiss(id) {
        const before = this.state.queue.length;
        this.state.queue = this.state.queue.filter(m => m.id !== id);
        if (this.state.queue.length !== before) this._emit();
    }

    success(text, title = "Hecho") { return this.show({ variant: MessageVariant.SUCCESS, text, title }); }
    info(text, title = "Información") { return this.show({ variant: MessageVariant.INFO, text, title }); }
    warn(text, title = "Atención") { return this.show({ variant: MessageVariant.WARN, text, title }); }
    error(text, title = "Error") { return this.show({ variant: MessageVariant.ERROR, text, title, duration: 3500 }); }

    confirm({ text, title = "Confirmar acción", confirmText = "Sí", cancelText = "Cancelar" }) {
        if (this.currentConfirm?._resolver) this.currentConfirm._resolver(false);
        let resolver;
        const promise = new Promise((res) => (resolver = res));
        this.currentConfirm = createMessage({
            variant: MessageVariant.CONFIRM,
            text,
            title,
            confirmText,
            cancelText,
            _resolver: resolver,
        });
        this._emit();
        return promise;
    }

    alert({ title = "Atención", text = "Mensaje", buttonText = "Aceptar" }) {
        if (this.currentConfirm?._resolver) this.currentConfirm._resolver(false);
        let resolver;
        const promise = new Promise((res) => (resolver = res));
        this.currentConfirm = createMessage({
            variant: MessageVariant.ALERT,
            text,
            title,
            confirmText: buttonText,
            cancelText: "",
            _resolver: resolver,
        });
        this._emit();
        return promise;
    }

    resolveConfirm(ok) {
        if (this.currentConfirm?._resolver) this.currentConfirm._resolver(!!ok);
        this.currentConfirm = null;
        this._emit();
    }
}

const message = new MessageController();
export default message;