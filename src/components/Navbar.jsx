import React from 'react';
import { Search, Key, RotateCcw, Layers, Building2, Info, UploadCloud, Database } from 'lucide-react';

export default function Navbar({
  searchTerm,
  setSearchTerm,
  onResetView,
  onOpenTokenModal,
  onOpenAboutModal,
  onOpenImportModal,
  hasCustomToken,
  currentDatasetKey,
  onSelectDataset,
  activeMetadata
}) {
  return (
    <header className="navbar">
      <div className="tricolor-strip" />
      <div className="navbar-content">
        {/* Brand & SIH Badge */}
        <div className="navbar-brand">
          <span className="brand-badge">SIH 2026</span>
          <div>
            <h1 className="brand-title">
              <Building2 size={18} color="#ff9933" />
              3D ULPIN & Vertical Property Mapping
            </h1>
            <p className="brand-subtitle">
              {activeMetadata?.name || 'Synthetic Demo'} • {activeMetadata?.source || 'Open Geospatial Benchmark'}
            </p>
          </div>
        </div>

        {/* Center Search Input */}
        <div className="search-wrapper" style={{ width: '260px' }}>
          <Search size={15} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search Building, Parcel ID, or ULPIN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Right Actions */}
        <div className="navbar-actions">
          {/* Dataset Switcher Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Database size={14} color="#38bdf8" />
            <select
              value={currentDatasetKey}
              onChange={(e) => onSelectDataset(e.target.value)}
              style={{
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                padding: '6px 12px',
                color: '#f8fafc',
                fontSize: '12px',
                fontWeight: 600,
                outline: 'none',
                cursor: 'pointer'
              }}
              title="Select Cadastral Dataset"
            >
              <option value="nyc" style={{ background: '#0f172a', color: '#fff' }}>
                🏙️ Foreign City — New York, USA
              </option>
              <option value="synthetic" style={{ background: '#0f172a', color: '#fff' }}>
                📍 Synthetic Demo — Not Official Data
              </option>
              {currentDatasetKey === 'imported' && (
                <option value="imported" style={{ background: '#0f172a', color: '#fff' }}>
                  📁 Custom Imported GeoJSON
                </option>
              )}
            </select>
          </div>

          {/* Import GeoJSON Button */}
          <button
            className="btn btn-secondary"
            onClick={onOpenImportModal}
            title="Import custom cadastral GeoJSON file"
          >
            <UploadCloud size={14} />
            Import GeoJSON
          </button>

          {/* About & Data Source Modal */}
          <button
            className="btn btn-secondary"
            onClick={onOpenAboutModal}
            title="About System, Data Provenance & Legal Disclaimers"
          >
            <Info size={14} color="#38bdf8" />
            About / Source
          </button>

          {/* Cesium Ion Token Settings */}
          <button
            className="btn btn-saffron"
            onClick={onOpenTokenModal}
            title="Configure Cesium Ion Access Token"
          >
            <Key size={14} />
            {hasCustomToken ? 'Ion Active' : 'Ion Token'}
          </button>
        </div>
      </div>
    </header>
  );
}
