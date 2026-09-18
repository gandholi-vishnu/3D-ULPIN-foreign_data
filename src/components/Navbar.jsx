import React from 'react';
import { Search, Key, Building2, Info, UploadCloud, Database } from 'lucide-react';

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
      <div className="navbar-content">
        {/* Brand & Title */}
        <div className="navbar-brand" onClick={onResetView} style={{ cursor: 'pointer' }}>
          <div className="brand-icon-box">
            <Building2 size={18} color="#00f2fe" />
          </div>
          <div>
            <h1 className="brand-title">3D ULPIN</h1>
            <p className="brand-subtitle">Vertical Property Mapping System</p>
          </div>
        </div>

        {/* Center Search Input */}
        <div className="search-wrapper">
          <Search size={14} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search building, BIN, or ULPIN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Right Actions & Location Selector */}
        <div className="navbar-actions">
          {/* Location / Dataset Selector */}
          <div className="dataset-select-wrapper">
            <Database size={13} color="#38bdf8" />
            <select
              value={currentDatasetKey}
              onChange={(e) => onSelectDataset(e.target.value)}
              className="dataset-select"
              title="Select Cadastral Benchmark Location"
            >
              <option value="nyc">Foreign City — New York, USA</option>
              <option value="synthetic">Synthetic Demo — Not Official Data</option>
              {currentDatasetKey === 'imported' && (
                <option value="imported">Custom Imported GeoJSON</option>
              )}
            </select>
          </div>

          {/* Import GeoJSON */}
          <button
            className="nav-btn"
            onClick={onOpenImportModal}
            title="Import custom cadastral GeoJSON"
          >
            <UploadCloud size={14} />
            <span>Import</span>
          </button>

          {/* About / Source */}
          <button
            className="nav-btn"
            onClick={onOpenAboutModal}
            title="About Data Provenance & Legal Disclaimers"
          >
            <Info size={14} color="#38bdf8" />
            <span>About</span>
          </button>

          {/* Ion Token */}
          <button
            className={`nav-btn ${hasCustomToken ? 'nav-btn-active' : ''}`}
            onClick={onOpenTokenModal}
            title="Configure Cesium Ion Access Token"
          >
            <Key size={14} color={hasCustomToken ? '#4ade80' : '#94a3b8'} />
            <span>{hasCustomToken ? 'Ion Active' : 'Token'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
