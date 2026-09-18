import React, { useState } from 'react';
import { Key, ShieldCheck, ExternalLink, X, AlertCircle } from 'lucide-react';

export default function TokenModal({ isOpen, onClose, currentToken, onSaveToken }) {
  const [inputVal, setInputVal] = useState(currentToken || '');

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    onSaveToken(inputVal.trim());
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Key size={18} color="#ff9933" />
            <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Cesium Ion Token Configuration</h3>
          </div>
          <button className="btn-icon" onClick={onClose} title="Close">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSave}>
          <div className="modal-body">
            <div style={{
              background: 'rgba(56, 189, 248, 0.1)',
              border: '1px solid rgba(56, 189, 248, 0.3)',
              borderRadius: '8px',
              padding: '10px 12px',
              display: 'flex',
              gap: '10px',
              alignItems: 'flex-start'
            }}>
              <ShieldCheck size={20} color="#38bdf8" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <p style={{ fontWeight: 600, color: '#38bdf8', marginBottom: '2px' }}>
                  No Token Required for Demo
                </p>
                <p style={{ fontSize: '12px', color: '#cbd5e1' }}>
                  This prototype is designed to work immediately using open standard imagery (OpenStreetMap / Ellipsoid) even without an Ion token.
                </p>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, marginBottom: '6px', color: '#94a3b8' }}>
                Optional Cesium Ion Default Access Token:
              </label>
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  padding: '9px 12px',
                  color: '#fff',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ fontSize: '12px', color: '#94a3b8' }}>
              <p style={{ marginBottom: '6px' }}><strong>How to configure permanently:</strong></p>
              <p style={{ marginBottom: '4px' }}>1. Create a free account at <a href="https://cesium.com/ion/" target="_blank" rel="noreferrer" style={{ color: '#38bdf8', display: 'inline-flex', alignItems: 'center', gap: '3px' }}>cesium.com/ion <ExternalLink size={12} /></a></p>
              <p style={{ marginBottom: '4px' }}>2. Create an Access Token under "Access Tokens"</p>
              <p style={{ marginBottom: '6px' }}>3. Add it to your project's <code style={{ color: '#ff9933' }}>.env</code> file:</p>
              <div className="code-box">
                VITE_CESIUM_ION_TOKEN=your_token_here
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Save & Apply
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
