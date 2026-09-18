import React from 'react';
import { Info, ShieldAlert, BookOpen, Layers, CheckCircle2, X, ExternalLink, FileCode, Database } from 'lucide-react';

export default function AboutModal({ isOpen, onClose, activeDatasetMetadata }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '660px', maxHeight: '88vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Info size={18} color="#38bdf8" />
            <h3 style={{ fontSize: '15px', fontWeight: 700 }}>Data Provenance, Licenses & System Scope</h3>
          </div>
          <button className="btn-icon" onClick={onClose} title="Close">
            <X size={16} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body">
          {/* Active Dataset Provenance Banner */}
          <div style={{
            background: 'rgba(56, 189, 248, 0.08)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            borderRadius: '8px',
            padding: '12px 14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: '#38bdf8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Active Dataset Provenance
              </span>
              <span style={{ fontSize: '11px', background: 'rgba(56, 189, 248, 0.2)', padding: '2px 8px', borderRadius: '12px', color: '#7dd3fc', fontWeight: 600 }}>
                {activeDatasetMetadata?.source || 'Public Open Geospatial'}
              </span>
            </div>
            <p style={{ fontSize: '14px', fontWeight: 700, color: '#f8fafc', marginBottom: '4px' }}>
              {activeDatasetMetadata?.name || 'Dataset'}
            </p>
            <p style={{ fontSize: '11px', color: '#cbd5e1', lineHeight: 1.5 }}>
              CRS: <strong>{activeDatasetMetadata?.crs || 'EPSG:4326 (WGS 84)'}</strong> • Mapped Buildings/Parcels: <strong>{activeDatasetMetadata?.totalParcels || 35}</strong> • Vertical Strata Units: <strong>{activeDatasetMetadata?.totalVerticalUnits || 120}</strong>
            </p>
            {activeDatasetMetadata?.sourceUrl && (
              <a
                href={activeDatasetMetadata.sourceUrl}
                target="_blank"
                rel="noreferrer"
                style={{ fontSize: '11px', color: '#38bdf8', display: 'inline-flex', alignItems: 'center', gap: '4px', marginTop: '6px' }}
              >
                Official Source Portal: {activeDatasetMetadata.sourceUrl} <ExternalLink size={11} />
              </a>
            )}
          </div>

          {/* Explicit Legal Hackathon Notice */}
          <div style={{
            background: 'rgba(245, 158, 11, 0.08)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '8px',
            padding: '12px 14px',
            display: 'flex',
            gap: '10px'
          }}>
            <ShieldAlert size={20} color="#fbbf24" style={{ flexShrink: 0, marginTop: '2px' }} />
            <div style={{ fontSize: '12px', color: '#fef3c7', lineHeight: 1.5 }}>
              <p style={{ fontWeight: 700, marginBottom: '2px', color: '#fbbf24' }}>
                Prototype Evaluation & Legal Disclaimers
              </p>
              <p>
                1. <strong>Foreign Data Notice:</strong> Foreign geospatial data (e.g. New York City / OpenStreetMap) is used strictly as an open-access technical benchmark. It is <strong>NOT</strong> official Indian cadastral data.
              </p>
              <p style={{ marginTop: '4px' }}>
                2. <strong>Generated Identifiers:</strong> All ULPIN numbers are <strong>Prototype-generated ULPINs — Not official government ULPINs</strong>. All floor-level identifiers are <strong>Prototype-generated Sub-ULPINs</strong>.
              </p>
              <p style={{ marginTop: '4px' }}>
                3. <strong>No Official Claim:</strong> Neither OpenStreetMap nor municipal open data portals provide official cadastral ownership or sovereign legal ULPIN data.
              </p>
            </div>
          </div>

          {/* Genuine Verified Public Sources & Licenses Table */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
              <Database size={14} color="#38bdf8" />
              Verified Public Geospatial Sources & Licenses
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                  <strong style={{ color: '#38bdf8' }}>NYC Open Data — Building Footprints</strong>
                  <span style={{ color: '#4ade80', fontSize: '11px', fontWeight: 600 }}>Public Domain / Free Access</span>
                </div>
                <div style={{ color: '#94a3b8', fontSize: '11px' }}>
                  Publisher: NYC Department of Information Technology & Telecommunications (DOITT)
                </div>
                <a href="https://data.cityofnewyork.us" target="_blank" rel="noreferrer" style={{ color: '#7dd3fc', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '3px', marginTop: '3px' }}>
                  data.cityofnewyork.us <ExternalLink size={10} />
                </a>
              </div>

              <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '10px', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                  <strong style={{ color: '#38bdf8' }}>OpenStreetMap (OSM) Global Buildings</strong>
                  <span style={{ color: '#fbbf24', fontSize: '11px', fontWeight: 600 }}>Open Database License (ODbL)</span>
                </div>
                <div style={{ color: '#94a3b8', fontSize: '11px' }}>
                  Publisher: OpenStreetMap Contributors
                </div>
                <a href="https://www.openstreetmap.org" target="_blank" rel="noreferrer" style={{ color: '#7dd3fc', fontSize: '11px', display: 'inline-flex', alignItems: 'center', gap: '3px', marginTop: '3px' }}>
                  openstreetmap.org <ExternalLink size={10} />
                </a>
              </div>
            </div>
          </div>

          {/* ISO 19152 LADM 3D Cadastre Scope */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
              <Layers size={14} color="#ff9933" />
              Cadastral Strata Mapping (ISO 19152 LADM)
            </h4>
            <p style={{ fontSize: '12px', color: '#cbd5e1', lineHeight: 1.5 }}>
              In sovereign land administration, cadastral registries record <strong>volumetric legal strata parcels (floors and whole titles)</strong>. Private interior architecture (bedrooms, kitchens, bathrooms, dining halls) belongs to internal architectural CAD/BIM and is deliberately excluded from legal land administration cadastre systems.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="modal-footer">
          <button type="button" className="btn btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
