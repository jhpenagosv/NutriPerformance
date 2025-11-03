export const MessageVariant = {
    SUCCESS: "success",
    INFO: "info",
    WARN: "warn",
    ERROR: "error",
    CONFIRM: "confirm",
    ALERT: "alert",
};

/**
 * @typedef {{
 *  id: string,
 *  variant: keyof MessageVariant,
 *  title?: string,
 *  text: string,
 *  duration?: number,     // ms; solo toasts
 *  confirmText?: string,  // modal
 *  cancelText?: string,   // modal
 *  _resolver?: (v:boolean)=>void // uso interno para confirm/alert
 * }} UIMessage
 */

export function createMessage(partial = {}) {
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