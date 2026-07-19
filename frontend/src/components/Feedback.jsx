import "./Feedback.css";

export function InlineFeedback({ type = "error", children }) {
  if (!children) return null;

  return (
    <div className={`inline-feedback inline-feedback-${type}`} role={type === "error" ? "alert" : "status"}>
      <span className="inline-feedback-icon" aria-hidden="true">
        {type === "error" ? "!" : "✓"}
      </span>
      <span>{children}</span>
    </div>
  );
}

export function ConfirmDialog({ open, title, message, confirmLabel = "Delete", onConfirm, onCancel }) {
  if (!open) return null;

  return (
    <div className="confirm-backdrop" role="presentation" onMouseDown={onCancel}>
      <div
        className="confirm-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-message"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="confirm-dialog-icon" aria-hidden="true">!</div>
        <h3 id="confirm-dialog-title">{title}</h3>
        <p id="confirm-dialog-message">{message}</p>
        <div className="confirm-dialog-actions">
          <button type="button" className="confirm-cancel-btn" onClick={onCancel}>Cancel</button>
          <button type="button" className="confirm-delete-btn" onClick={onConfirm} autoFocus>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
