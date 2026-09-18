import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  Building,
  User,
  Maximize2,
  Tag,
  Layers,
  MapPin,
  ShieldAlert,
  Compass,
  ArrowUpRight
} from 'lucide-react';

export default function ParcelDetailPanel({
  parcel,
  onClose,
  selectedUnitId,
  onSelectUnit
}) {
  const [copied, setCopied] = useState(false);
  const [copiedUnitUlpin, setCopiedUnitUlpin] = useState(null);

  if (!parcel) return null;

  const handleCopyUlpin = (text, isUnit = false) => {
    navigator.clipboard.writeText(text);
    if (isUnit) {
      setCopiedUnitUlpin(text);
      setTimeout(() => setCopiedUnitUlpin(null), 2000);
    } else {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

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
              {parcel.surveyNumber}
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
        {/* Prototype ULPIN Display Card */}
        <div className="ulpin-display-card">
          <div className="ulpin-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>Prototype-Generated Base ULPIN</span>
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
            ⚠️ Prototype-generated ULPIN — Not an official government ULPIN.
          </div>
        </div>

        {/* Key Attributes Grid */}
        <div className="attr-grid">
          <div className="attr-item">
            <div className="attr-key">Primary Land Use</div>
            <div className="attr-val">{parcel.landType}</div>
          </div>

          <div className="attr-item">
            <div className="attr-key">Sub-Classification</div>
            <div className="attr-val" style={{ fontSize: '12px' }}>{parcel.subType || 'Urban Cadastre'}</div>
          </div>

          <div className="attr-item">
            <div className="attr-key">Measured Height</div>
            <div className="attr-val" style={{ color: '#38bdf8', fontWeight: 700 }}>
              {parcel.extrudedHeight > 0.5 ? `${Math.round(parcel.extrudedHeight)} meters` : 'Surface (0.2m)'}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--text-subtle)' }}>
              {parcel.totalFloors ? `${parcel.totalFloors} Recorded Levels` : 'Single Level'}
            </div>
          </div>

          <div className="attr-item">
            <div className="attr-key">Ground Footprint Area</div>
            <div className="attr-val">{parcel.areaSqM ? parcel.areaSqM.toLocaleString() : '—'} m²</div>
            <div style={{ fontSize: '10px', color: 'var(--text-subtle)' }}>
              {parcel.areaDisplay || 'Survey Footprint'}
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
            <div className="attr-key">Tax / Assessment Status</div>
            <div className="attr-val" style={{ fontSize: '12px', color: '#4ade80' }}>
              {parcel.taxStatus || 'Assessed Public Data'}
            </div>
          </div>
        </div>

        {/* Registered / Recorded Owner */}
        <div className="attr-item" style={{ width: '100%' }}>
          <div className="attr-key" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <User size={12} />
            Recorded Owner / Agency
          </div>
          <div className="attr-val" style={{ marginTop: '2px' }}>
            {parcel.owner}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--text-subtle)', marginTop: '2px' }}>
            Contact / Registry: {parcel.ownerContact}
          </div>
        </div>

        {/* Cadastral Note */}
        <div style={{ fontSize: '12px', color: '#cbd5e1', background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <span style={{ fontWeight: 600, color: 'var(--text-muted)' }}>Survey Note: </span>
          {parcel.description}
        </div>

        {/* VERTICAL PROPERTY MAPPING SECTION */}
        {parcel.isVerticalProperty && parcel.verticalStrata ? (
          <div className="vertical-section">
            <div className="vertical-section-title">
              <Layers size={15} />
              Vertical Property Strata ({parcel.totalFloors} Recorded Levels)
            </div>

            <div style={{ fontSize: '11px', color: 'var(--text-subtle)', marginBottom: '4px' }}>
              Click any floor below to highlight the 3D vertical strata volume and inspect its Prototype-generated Sub-ULPIN.
            </div>

            <div className="strata-stack">
              {parcel.verticalStrata.map((unit) => {
                const isActive = selectedUnitId === unit.unitId;
                return (
                  <div
                    key={unit.unitId}
                    className={`strata-floor-card ${isActive ? 'active' : ''}`}
                    onClick={() => onSelectUnit(isActive ? null : unit.unitId)}
                  >
                    <div className="strata-card-header">
                      <span className="strata-floor-tag">
                        {unit.floorLabel} (Level {unit.floorNumber})
                      </span>
                      <span className="strata-height-tag">
                        Elev: {unit.heightRange}
                      </span>
                    </div>

                    <div className="strata-unit-name">
                      {unit.name}
                    </div>

                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Strata Titleholder: <strong>{unit.owner}</strong> • {unit.areaSqM} m²
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
            <div style={{ fontSize: '10px', color: 'var(--text-subtle)', marginTop: '2px' }}>
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
            <strong>Surface-Level Cadastral Parcel:</strong> Single ground-level property title. No multi-tier vertical strata subdivisions recorded.
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
