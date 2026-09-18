import React, { useState } from 'react';
import { UploadCloud, FileCode, CheckCircle, AlertCircle, X, Download } from 'lucide-react';
import { parseGeoJSONToCadastre } from '../utils/geojsonParser';

export default function ImportGeoJsonModal({ isOpen, onClose, onImportSuccess }) {
  const [jsonText, setJsonText] = useState('');
  const [datasetName, setDatasetName] = useState('Imported Urban Block');
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target.result;
        setJsonText(text);
        setDatasetName(file.name.replace(/\.[^/.]+$/, ''));
        setError(null);
      } catch (err) {
        setError('Failed to read file: ' + err.message);
      }
    };
    reader.readAsText(file);
  };

  const handleLoadSample = async () => {
    try {
      const res = await fetch('/sample_cadastre.geojson');
      if (!res.ok) throw new Error('Could not fetch sample GeoJSON');
      const data = await res.json();
      setJsonText(JSON.stringify(data, null, 2));
      setDatasetName('Sample Open Cadastre Import');
      setError(null);
    } catch (err) {
      setError('Sample load failed: ' + err.message);
    }
  };

  const handleProcessImport = () => {
    try {
      if (!jsonText.trim()) {
        setError('Please paste or upload valid GeoJSON content.');
        return;
      }

      const parsedJson = JSON.parse(jsonText);
      const parsedCadastre = parseGeoJSONToCadastre(parsedJson, datasetName);

      if (parsedCadastre.parcels.length === 0) {
        setError('No valid Polygon or MultiPolygon parcels found in the GeoJSON.');
        return;
      }

      onImportSuccess(parsedCadastre);
      onClose();
    } catch (err) {
      setError('GeoJSON Parsing Error: ' + err.message);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '580px' }} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UploadCloud size={18} color="#38bdf8" />
            <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Import Cadastral GeoJSON</h3>
          </div>
          <button className="btn-icon" onClick={onClose} title="Close">
            <X size={16} />
          </button>
        </div>

        <div className="modal-body">
          <div style={{ fontSize: '12px', color: '#94a3b8' }}>
            Load external open parcel datasets (e.g. OpenStreetMap, municipal cadastre, or QGIS exports). The system will compute centroids, generate Base ULPINs, and extrude 3D strata slabs.
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <label className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center', cursor: 'pointer' }}>
              <UploadCloud size={14} />
              Upload .geojson File
              <input type="file" accept=".json,.geojson" onChange={handleFileUpload} style={{ display: 'none' }} />
            </label>

            <button type="button" className="btn btn-saffron" onClick={handleLoadSample}>
              <Download size={14} />
              Load Sample GeoJSON
            </button>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#94a3b8', marginBottom: '4px' }}>
              Dataset Label:
            </label>
            <input
              type="text"
              value={datasetName}
              onChange={(e) => setDatasetName(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.06)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                padding: '8px 12px',
                color: '#fff',
                fontSize: '13px',
                outline: 'none'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#94a3b8', marginBottom: '4px' }}>
              Paste Raw GeoJSON:
            </label>
            <textarea
              rows={6}
              value={jsonText}
              onChange={(e) => setJsonText(e.target.value)}
              placeholder='{"type": "FeatureCollection", "features": [...]}'
              style={{
                width: '100%',
                background: 'rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '8px',
                padding: '8px 12px',
                color: '#38bdf8',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                outline: 'none',
                resize: 'vertical'
              }}
            />
          </div>

          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              borderRadius: '8px',
              padding: '8px 12px',
              color: '#fca5a5',
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}>
              <AlertCircle size={14} style={{ flexShrink: 0 }} />
              {error}
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={handleProcessImport}>
            Parse & Render 3D Cadastre
          </button>
        </div>
      </div>
    </div>
  );
}
