import React from "react";
import "./Mensaje.css";

/* ------------------ 🔹 MODELO ------------------ */
const MessageVariant = {
    SUCCESS: "success",
    INFO: "info",
    WARN: "warn",
    ERROR: "error",
    CONFIRM: "confirm",
    ALERT: "alert",
};

function createMessage(partial = {}) {
    return {
        id: partial.id ?? String(Date.now() + Math.random()),
        variant: partial.variant ?? MessageVariant.INFO,
        title: partial.title ?? "",
        text: partial.text ?? "",
        duration: typeof partial.duration === "number" ? partial.duration : 2500,
        confirmText: partial.confirmText ?? "Sí",
        cancelText: partial.cancelText ?? "Cancelar",
        _resolver: partial._resolver ?? null,
    };
}

/* ------------------ 🔹 CONTROLADOR ------------------ */
class MessageController {
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

    // ---- Toasts ----
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
        this.state.queue = this.state.queue.filter(m => m.id !== id);
        this._emit();
    }

    success(text, title = "Hecho") { return this.show({ variant: MessageVariant.SUCCESS, text, title }); }
    info(text, title = "Información") { return this.show({ variant: MessageVariant.INFO, text, title }); }
    warn(text, title = "Atención") { return this.show({ variant: MessageVariant.WARN, text, title }); }
    error(text, title = "Error") { return this.show({ variant: MessageVariant.ERROR, text, title, duration: 3500 }); }

    // ---- Confirmación (Sí/Cancelar) ----
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

    // ---- Alerta (solo botón Aceptar) ----
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

/* Creamos el singleton que podrás importar desde cualquier archivo */
export const message = new MessageController();

/* ------------------ 🔹 VISTA ------------------ */
export default function Mensaje() {
    const [vm, setVm] = React.useState(message.snapshot());
    React.useEffect(() => message.subscribe(setVm), []);

    return (
        <>
            {/* TOASTS */}
            <div className="msg-stack">
                {vm.queue.map(m => (
                    <div key={m.id} className={`msg toast ${m.variant}`}>
                        {m.title && <div className="msg-title">{m.title}</div>}
                        <div className="msg-text">{m.text}</div>
                        <button className="msg-close" onClick={() => message.dismiss(m.id)}>×</button>
                    </div>
                ))}
            </div>

            {/* MODAL */}
            {vm.confirm && (
                <div className="msg-overlay" onClick={() => message.resolveConfirm(false)}>
                    <div className="msg-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="msg-modal-header">
                            <div
                                className={`msg-title ${vm.confirm.variant === "alert" ? "title-warning" : "title-primary"}`}
                            >
                                {vm.confirm.title}
                            </div>
                            <button className="msg-close" onClick={() => message.resolveConfirm(false)}>×</button>
                        </div>

                        <div className="msg-modal-body">
                            <p>{vm.confirm.text}</p>
                        </div>

                        <div className="msg-modal-actions">
                            {vm.confirm.variant === "confirm" ? (
                                <>
                                    <button className="btn ghost" onClick={() => message.resolveConfirm(false)}>
                                        {vm.confirm.cancelText}
                                    </button>
                                    <button className="btn primary" onClick={() => message.resolveConfirm(true)}>
                                        {vm.confirm.confirmText}
                                    </button>
                                </>
                            ) : (
                                <button
                                    className="btn warning"
                                    onClick={() => message.resolveConfirm(true)}
                                >
                                    {vm.confirm.confirmText ?? "Aceptar"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
