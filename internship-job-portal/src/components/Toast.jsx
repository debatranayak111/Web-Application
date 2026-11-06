import React from 'react';

export default function Toast({ toasts, onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast ${toast.type || 'info'}`}>
          <span style={{ fontSize: '1.2rem' }}>
            {toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️'}
          </span>
          <div style={{ flex: 1 }}>{toast.message}</div>
          <button
            onClick={() => onDismiss(toast.id)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              fontSize: '1rem',
              marginLeft: 8
            }}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}
