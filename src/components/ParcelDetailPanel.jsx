import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Building,
  User,
  Layers,
  MapPin,
  Compass,
  ArrowUpRight,
  Search,
  CheckCircle2
} from 'lucide-react';
import { generateFloorSubUlpin } from '../utils/ulpinGenerator.js';

export default function ParcelDetailPanel({
  parcel,
  onClose,
  selectedUnitId,
  onSelectUnit
}) {
  const [copied, setCopied] = useState(false);
  const [copiedUnitUlpin, setCopiedUnitUlpin] = useState(null);
  const [floorSearch, setFloorSearch] = useState('');

  // Handle empty state gracefully
  if (!parcel) {
    return (
      <div className="detail-panel glass-panel detail-panel-empty">
        <div className="empty-panel-content">
          <div className="empty-panel-icon">
            <Building size={28} />
          </div>
          <h3 className="empty-panel-title">Select a Building</h3>
          <p className="empty-panel-desc">
            Click any 3D building or parcel on the map to inspect its cadastral ULPIN, surveyed height, and vertical strata.
          </p>
        </div>
      </div>
    );
  }

  const handleCopyUlpin = (text, isUnit = false) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    if (isUnit) {
      setCopiedUnitUlpin(text);
      setTimeout(() => setCopiedUnitUlpin(null), 2000);
    } else {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const strataList = parcel.verticalStrata || [];
  const activeFloor = strataList.find(
    (u) => u.unitId === selectedUnitId || u.subUlpin === selectedUnitId
  ) || null;

  const filteredStrata = strataList.filter((u) => {
    if (!floorSearch.trim()) return true;
    const q = floorSearch.toLowerCase();
    return (
      String(u.floorNumber).includes(q) ||
      u.floorLabel.toLowerCase().includes(q) ||
      u.subUlpin.toLowerCase().includes(q) ||
      u.name.toLowerCase().includes(q) ||
      u.owner.toLowerCase().includes(q)
    );
  });

  const totalFloors = parcel.totalFloors || strataList.length || 1;
  const quickFloors = [];
  if (totalFloors > 1) {
    quickFloors.push(0);
    if (totalFloors > 15) quickFloors.push(10);
    if (totalFloors > 30) quickFloors.push(20);
    if (totalFloors > 50) quickFloors.push(40);
    if (totalFloors >= 60) quickFloors.push(60);
    quickFloors.push(totalFloors - 1);
  }

  return (
    <div className="detail-panel glass-panel">
      {/* Header */}
      <div className="detail-header">
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="parcel-id-chip">
              {parcel.id}
            </span>
            <span className="parcel-survey-chip">
              {parcel.surveyNumber || 'Cadastral Feature'}
            </span>
          </div>
          <h2 className="parcel-name-title" title={parcel.name}>
            {parcel.name}
          </h2>
        </div>

        <button className="btn-icon" onClick={onClose} title="Close details">
          <X size={16} />
        </button>
      </div>

      <div className="detail-body">
        {/* Parent Building ULPIN Card */}
        <div className="ulpin-display-card">
          <div className="ulpin-label">
            <span>Building ULPIN</span>
            <span className="ulpin-badge">Cadastral ID</span>
          </div>
          <div className="ulpin-value-row">
            <span className="ulpin-code">{parcel.ulpin}</span>
            <button
              className="copy-btn"
              onClick={() => handleCopyUlpin(parcel.ulpin)}
              title="Copy Building ULPIN"
            >
              {copied ? <Check size={12} color="#4ade80" /> : <Copy size={12} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>

        {/* ACTIVE SELECTED FLOOR STRATA CARD */}
        {activeFloor && (
          <div className="active-floor-highlight-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span className="active-floor-badge">
                Selected Floor: {activeFloor.floorLabel}
              </span>
              <button
                className="btn-icon-sm"
                onClick={() => onSelectUnit(null)}
                title="Deselect floor"
              >
                <X size={12} />
              </button>
            </div>

            <div style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc', marginBottom: '4px' }}>
              {activeFloor.name}
            </div>

            {/* Sub-ULPIN Row */}
            <div className="active-subulpin-box">
              <div style={{ fontSize: '10px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Floor Sub-ULPIN
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: '#00f2fe' }}>
                  {activeFloor.subUlpin}
                </span>
                <button
                  className="copy-btn"
                  style={{ padding: '3px 8px', fontSize: '11px' }}
                  onClick={() => handleCopyUlpin(activeFloor.subUlpin, true)}
                  title="Copy Floor Sub-ULPIN"
                >
                  {copiedUnitUlpin === activeFloor.subUlpin ? (
                    <Check size={11} color="#4ade80" />
                  ) : (
                    <Copy size={11} />
                  )}
                  {copiedUnitUlpin === activeFloor.subUlpin ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            {/* Floor Attributes Grid */}
            <div className="floor-attr-grid">
              <div className="floor-attr-pill">
                <span className="pill-key">Floor Elevation</span>
                <span className="pill-val">{activeFloor.heightRange}</span>
              </div>
              <div className="floor-attr-pill">
                <span className="pill-key">Floor Area</span>
                <span className="pill-val">{activeFloor.areaSqM.toLocaleString()} m²</span>
              </div>
              <div className="floor-attr-pill" style={{ gridColumn: 'span 2' }}>
                <span className="pill-key">Floor Titleholder</span>
                <span className="pill-val" style={{ color: '#ffd700' }}>{activeFloor.owner}</span>
              </div>
              <div className="floor-attr-pill" style={{ gridColumn: 'span 2' }}>
                <span className="pill-key">Usage Classification</span>
                <span className="pill-val">{activeFloor.usage}</span>
              </div>
            </div>
          </div>
        )}

        {/* Building Attributes Grid */}
        <div className="attr-grid">
          <div className="attr-item">
            <div className="attr-key">Height</div>
            <div className="attr-val" style={{ color: '#38bdf8', fontWeight: 700 }}>
              {parcel.extrudedHeight > 0.5 ? `${Math.round(parcel.extrudedHeight)} meters` : 'Surface'}
            </div>
          </div>

          <div className="attr-item">
            <div className="attr-key">Total Floors</div>
            <div className="attr-val">
              {totalFloors} {totalFloors === 1 ? 'Level' : 'Levels'}
            </div>
          </div>

          <div className="attr-item">
            <div className="attr-key">Ground Footprint</div>
            <div className="attr-val">{parcel.areaSqM ? `${parcel.areaSqM.toLocaleString()} m²` : '—'}</div>
          </div>

          <div className="attr-item">
            <div className="attr-key">Primary Use</div>
            <div className="attr-val">{parcel.landType || 'Urban Commercial'}</div>
          </div>

          <div className="attr-item" style={{ gridColumn: 'span 2' }}>
            <div className="attr-key" style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Compass size={11} /> Centroid (WGS 84)
            </div>
            <div className="attr-val" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
              {parcel.centroid ? `${parcel.centroid[1].toFixed(5)}°N, ${Math.abs(parcel.centroid[0]).toFixed(5)}°W` : '—'}
            </div>
          </div>
        </div>

        {/* Registered Titleholder */}
        <div className="attr-item" style={{ width: '100%' }}>
          <div className="attr-key" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <User size={12} />
            Titleholder / Registered Owner
          </div>
          <div className="attr-val" style={{ marginTop: '2px', fontWeight: 600 }}>
            {parcel.owner || 'Municipal Land Registry'}
          </div>
        </div>

        {/* VERTICAL PROPERTY STRATA SECTION */}
        {strataList.length > 0 && (
          <div className="vertical-section">
            <div className="vertical-section-title">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Layers size={14} color="#00f2fe" />
                <span>Vertical Property Strata ({strataList.length} Floors)</span>
              </div>
            </div>

            {/* Quick Floor Jump Presets */}
            {quickFloors.length > 0 && (
              <div className="quick-floor-bar">
                <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600, alignSelf: 'center' }}>
                  Jump:
                </span>
                {quickFloors.map((flNum) => {
                  const targetUnit = strataList.find((u) => u.floorNumber === flNum);
                  const isCurrent = activeFloor?.floorNumber === flNum;
                  return (
                    <button
                      key={flNum}
                      className={`quick-floor-chip ${isCurrent ? 'active' : ''}`}
                      onClick={() => onSelectUnit(targetUnit ? targetUnit.unitId : null)}
                      title={`Select Floor ${flNum}`}
                    >
                      {flNum === 0 ? 'L0 Ground' : flNum === totalFloors - 1 ? `L${flNum} Top` : `L${flNum}`}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Floor Search Filter */}
            {strataList.length > 10 && (
              <div className="floor-search-box">
                <Search size={12} color="#64748b" />
                <input
                  type="text"
                  placeholder="Filter floor (e.g. 0, 60, Spotify)..."
                  value={floorSearch}
                  onChange={(e) => setFloorSearch(e.target.value)}
                  className="floor-search-input"
                />
                {floorSearch && (
                  <button className="btn-clear-search" onClick={() => setFloorSearch('')}>
                    <X size={11} />
                  </button>
                )}
              </div>
            )}

            {/* Scrollable Strata Stack */}
            <div className="strata-stack">
              {filteredStrata.map((unit) => {
                const isActive = activeFloor?.unitId === unit.unitId;
                return (
                  <div
                    key={unit.unitId}
                    className={`strata-floor-card ${isActive ? 'active' : ''}`}
                    onClick={() => onSelectUnit(isActive ? null : unit.unitId)}
                  >
                    <div className="strata-card-header">
                      <span className="strata-floor-tag">
                        {unit.floorLabel}
                      </span>
                      <span className="strata-height-tag">
                        {unit.heightRange}
                      </span>
                    </div>

                    <div className="strata-unit-name">
                      {unit.name}
                    </div>

                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {unit.owner} • {unit.areaSqM} m²
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
                      <span className="strata-subulpin">
                        {unit.subUlpin}
                      </span>
                      <button
                        className="copy-btn"
                        style={{ padding: '2px 6px', fontSize: '10px' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyUlpin(unit.subUlpin, true);
                        }}
                        title="Copy Sub-ULPIN"
                      >
                        {copiedUnitUlpin === unit.subUlpin ? (
                          <Check size={10} color="#4ade80" />
                        ) : (
                          <Copy size={10} />
                        )}
                        {copiedUnitUlpin === unit.subUlpin ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
