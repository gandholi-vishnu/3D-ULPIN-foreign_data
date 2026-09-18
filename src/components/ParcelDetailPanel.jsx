import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Building,
  User,
  Layers,
  MapPin,
  ShieldAlert,
  Compass,
  ArrowUpRight,
  Search,
  Sparkles
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

  if (!parcel) return null;

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

  // Resolve active selected floor unit
  const strataList = parcel.verticalStrata || [];
  const activeFloor = strataList.find(
    (u) => u.unitId === selectedUnitId || u.subUlpin === selectedUnitId
  ) || null;

  // Filter strata list by floor search
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

  // Quick jump presets for high-rise buildings
  const totalFloors = parcel.totalFloors || strataList.length || 1;
  const quickFloors = [];
  if (totalFloors > 1) {
    quickFloors.push(0); // Ground Floor
    if (totalFloors > 15) quickFloors.push(10);
    if (totalFloors > 30) quickFloors.push(20);
    if (totalFloors > 50) quickFloors.push(40);
    if (totalFloors >= 60) quickFloors.push(60); // Specifically matches prompt requirement for Floor 60
    if (totalFloors > 1) quickFloors.push(totalFloors - 1); // Top floor
  }

  return (
    <div className="detail-panel glass-panel">
      {/* Header */}
      <div className="detail-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="parcel-id-chip" style={{ fontSize: '13px' }}>
              {parcel.id}
            </span>
            <span style={{
              fontSize: '11px',
              padding: '2px 6px',
              borderRadius: '4px',
              background: 'rgba(56, 189, 248, 0.15)',
              color: '#38bdf8',
              fontWeight: 600
            }}>
              {parcel.surveyNumber || 'Cadastral Survey'}
            </span>
          </div>
          <h2 style={{ fontSize: '15px', fontWeight: 700, lineHeight: 1.3 }}>
            {parcel.name}
          </h2>
        </div>

        <button className="btn-icon" onClick={onClose} title="Close details">
          <X size={16} />
        </button>
      </div>

      <div className="detail-body">
        {/* Prototype Base Building ULPIN Card */}
        <div className="ulpin-display-card">
          <div className="ulpin-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Building Parent ULPIN</span>
            <span style={{ fontSize: '9px', color: '#facc15', fontWeight: 600, border: '1px solid rgba(250, 204, 21, 0.4)', padding: '1px 5px', borderRadius: '4px' }}>
              Simulated
            </span>
          </div>
          <div className="ulpin-value-row">
            <span className="ulpin-code">{parcel.ulpin}</span>
            <button
              className="copy-btn"
              onClick={() => handleCopyUlpin(parcel.ulpin)}
              title="Copy Base ULPIN to clipboard"
            >
              {copied ? <Check size={12} color="#4ade80" /> : <Copy size={12} />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <div style={{ fontSize: '10px', color: '#fbbf24', marginTop: '4px', fontWeight: 500 }}>
            ⚠️ Prototype-generated ULPIN — Not an official government land identifier.
          </div>
        </div>

        {/* ACTIVE SELECTED FLOOR STRATA CARD (Requirement 4 & 5) */}
        {activeFloor && (
          <div className="active-floor-highlight-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span className="active-floor-badge">
                <Sparkles size={11} />
                Selected Strata — {activeFloor.floorLabel}
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
                Unique Floor Sub-ULPIN
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '2px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', fontWeight: 700, color: '#38bdf8' }}>
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
            <div className="floor-attr-grid" style={{ marginTop: '8px' }}>
              <div className="floor-attr-pill">
                <span className="pill-key">Floor Elevation</span>
                <span className="pill-val">{activeFloor.heightRange}</span>
              </div>
              <div className="floor-attr-pill">
                <span className="pill-key">Strata Area</span>
                <span className="pill-val">{activeFloor.areaSqM.toLocaleString()} m²</span>
              </div>
              <div className="floor-attr-pill" style={{ gridColumn: 'span 2' }}>
                <span className="pill-key">Strata Titleholder</span>
                <span className="pill-val" style={{ color: '#ffd700' }}>{activeFloor.owner}</span>
              </div>
              <div className="floor-attr-pill" style={{ gridColumn: 'span 2' }}>
                <span className="pill-key">Usage Classification</span>
                <span className="pill-val">{activeFloor.usage}</span>
              </div>
            </div>
            
            <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '6px' }}>
              * 3D floor volume and clickable pin highlighted in Cesium 3D view.
            </div>
          </div>
        )}

        {/* Building Attributes Grid */}
        <div className="attr-grid">
          <div className="attr-item">
            <div className="attr-key">Primary Land Use</div>
            <div className="attr-val">{parcel.landType || 'Urban Commercial'}</div>
          </div>

          <div className="attr-item">
            <div className="attr-key">Sub-Classification</div>
            <div className="attr-val" style={{ fontSize: '12px' }}>{parcel.subType || 'Skyscraper Property'}</div>
          </div>

          <div className="attr-item">
            <div className="attr-key">Surveyed Height</div>
            <div className="attr-val" style={{ color: '#38bdf8', fontWeight: 700 }}>
              {parcel.extrudedHeight > 0.5 ? `${Math.round(parcel.extrudedHeight)} meters` : 'Surface (0.2m)'}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-subtle)' }}>
              {totalFloors} Recorded Strata Levels
            </div>
          </div>

          <div className="attr-item">
            <div className="attr-key">Ground Footprint Area</div>
            <div className="attr-val">{parcel.areaSqM ? parcel.areaSqM.toLocaleString() : '—'} m²</div>
            <div style={{ fontSize: '10px', color: 'var(--text-subtle)' }}>
              {parcel.areaDisplay || 'Cadastral Footprint'}
            </div>
          </div>

          <div className="attr-item">
            <div className="attr-key" style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Compass size={11} /> Centroid WGS 84
            </div>
            <div className="attr-val" style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
              {parcel.centroid ? `${parcel.centroid[1].toFixed(4)}°N, ${parcel.centroid[0].toFixed(4)}°W` : '—'}
            </div>
          </div>

          <div className="attr-item">
            <div className="attr-key">Registry / Tax Status</div>
            <div className="attr-val" style={{ fontSize: '12px', color: '#4ade80' }}>
              {parcel.taxStatus || 'NYC Municipal Registry'}
            </div>
          </div>
        </div>

        {/* Registered Owner */}
        <div className="attr-item" style={{ width: '100%' }}>
          <div className="attr-key" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <User size={12} />
            Building Master Titleholder / Recorded Owner
          </div>
          <div className="attr-val" style={{ marginTop: '2px' }}>
            {parcel.owner || 'City Registry Record'}
          </div>
          {parcel.ownerContact && (
            <div style={{ fontSize: '11px', color: 'var(--text-subtle)', marginTop: '2px' }}>
              Contact / Agency: {parcel.ownerContact}
            </div>
          )}
        </div>

        {/* Survey Note */}
        {parcel.description && (
          <div style={{ fontSize: '12px', color: '#cbd5e1', background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Survey Note: </span>
            {parcel.description}
          </div>
        )}

        {/* VERTICAL PROPERTY STRATA SECTION (Requirement 3, 4, 5) */}
        {strataList.length > 0 ? (
          <div className="vertical-section">
            <div className="vertical-section-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Layers size={15} />
                <span>Vertical Property Strata ({strataList.length} Floors)</span>
              </div>
            </div>

            <div style={{ fontSize: '11px', color: 'var(--text-subtle)', marginBottom: '8px' }}>
              Every floor has its own unique Sub-ULPIN and clickable 3D pin. Click any floor to highlight.
            </div>

            {/* Quick Floor Jump Presets */}
            {quickFloors.length > 0 && (
              <div className="quick-floor-bar">
                <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 600, marginRight: '4px' }}>
                  Quick Jump:
                </span>
                {quickFloors.map((flNum) => {
                  const targetUnit = strataList.find((u) => u.floorNumber === flNum);
                  const isCurrent = activeFloor?.floorNumber === flNum;
                  return (
                    <button
                      key={flNum}
                      className={`quick-floor-chip ${isCurrent ? 'active' : ''}`}
                      onClick={() => onSelectUnit(targetUnit ? targetUnit.unitId : null)}
                      title={`Jump to Floor ${flNum}`}
                    >
                      {flNum === 0 ? 'L0 (Ground)' : flNum === totalFloors - 1 ? `L${flNum} (Top)` : `L${flNum}`}
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
                  placeholder="Filter floor (e.g. 0, 60, Spotify, Retail)..."
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
                        Elev: {unit.heightRange}
                      </span>
                    </div>

                    <div className="strata-unit-name">
                      {unit.name}
                    </div>

                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Titleholder: <strong>{unit.owner}</strong> • {unit.areaSqM} m²
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px' }}>
                      <span className="strata-subulpin" style={{ fontSize: '10px' }}>
                        Sub-ULPIN: {unit.subUlpin}
                      </span>
                      <button
                        className="copy-btn"
                        style={{ padding: '2px 6px', fontSize: '10px' }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyUlpin(unit.subUlpin, true);
                        }}
                        title="Copy Prototype-generated Sub-ULPIN"
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
            <div style={{ fontSize: '10px', color: 'var(--text-subtle)', marginTop: '4px' }}>
              * Prototype-generated Sub-ULPIN — Not an official government title identifier.
            </div>
          </div>
        ) : (
          <div style={{
            padding: '10px',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: '8px',
            border: '1px dashed rgba(255,255,255,0.1)',
            fontSize: '11px',
            color: 'var(--text-subtle)'
          }}>
            <strong>Surface-Level Cadastral Parcel:</strong> Single ground-level property title.
          </div>
        )}

        {/* Hackathon Disclaimer Card */}
        <div style={{
          display: 'flex',
          gap: '8px',
          alignItems: 'flex-start',
          background: 'rgba(245, 158, 11, 0.08)',
          border: '1px solid rgba(245, 158, 11, 0.25)',
          borderRadius: '8px',
          padding: '8px 10px',
          fontSize: '11px',
          color: '#fbbf24'
        }}>
          <ShieldAlert size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>Technical Prototype Demonstration:</strong> All ULPIN and Sub-ULPIN identifiers are simulated for SIH 2026 evaluation. Not an official government land record.
          </div>
        </div>
      </div>
    </div>
  );
}
