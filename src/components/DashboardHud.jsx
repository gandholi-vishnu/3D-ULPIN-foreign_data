import React from 'react';
import { Building2, Layers, MapPin, ArrowUp, Activity } from 'lucide-react';

export default function DashboardHud({
  totalBuildings = 0,
  totalStrataUnits = 0,
  selectedParcel = null,
  selectedUnitId = null,
  mapViewMode = 'standard'
}) {
  const activeFloor = selectedParcel?.verticalStrata?.find(
    (u) => u.unitId === selectedUnitId || u.subUlpin === selectedUnitId
  );

  return (
    <div className="dashboard-hud">
      {/* 1. Mapped Buildings */}
      <div className="hud-card">
        <div className="hud-icon-wrap" style={{ color: '#38bdf8' }}>
          <Building2 size={13} />
        </div>
        <div className="hud-content">
          <span className="hud-label">Mapped Buildings</span>
          <span className="hud-value">{totalBuildings}</span>
        </div>
      </div>

      {/* 2. Vertical Strata Units */}
      <div className="hud-card">
        <div className="hud-icon-wrap" style={{ color: '#00f2fe' }}>
          <Layers size={13} />
        </div>
        <div className="hud-content">
          <span className="hud-label">Strata Units</span>
          <span className="hud-value">{totalStrataUnits}</span>
        </div>
      </div>

      {/* 3. Selected Building */}
      <div className={`hud-card ${selectedParcel ? 'hud-card-active' : ''}`}>
        <div className="hud-icon-wrap" style={{ color: selectedParcel ? '#facc15' : '#64748b' }}>
          <MapPin size={13} />
        </div>
        <div className="hud-content" style={{ maxWidth: '160px' }}>
          <span className="hud-label">Selected Building</span>
          <span className="hud-value hud-value-truncate">
            {selectedParcel ? selectedParcel.name : 'None selected'}
          </span>
        </div>
      </div>

      {/* 4. Selected Floor */}
      <div className={`hud-card ${activeFloor ? 'hud-card-active-floor' : ''}`}>
        <div className="hud-icon-wrap" style={{ color: activeFloor ? '#ffd700' : '#64748b' }}>
          <Layers size={13} />
        </div>
        <div className="hud-content">
          <span className="hud-label">Selected Floor</span>
          <span className="hud-value">
            {activeFloor ? `Level ${activeFloor.floorNumber}` : 'None'}
          </span>
        </div>
      </div>

      {/* 5. Building Height */}
      <div className="hud-card">
        <div className="hud-icon-wrap" style={{ color: '#4ade80' }}>
          <ArrowUp size={13} />
        </div>
        <div className="hud-content">
          <span className="hud-label">Height</span>
          <span className="hud-value">
            {selectedParcel?.extrudedHeight ? `${Math.round(selectedParcel.extrudedHeight)}m` : '—'}
          </span>
        </div>
      </div>

      {/* 6. Map Mode Status */}
      <div className="hud-card">
        <div className="hud-icon-wrap" style={{ color: mapViewMode === 'street' ? '#818cf8' : mapViewMode === 'dark' ? '#c084fc' : '#38bdf8' }}>
          <Activity size={13} />
        </div>
        <div className="hud-content">
          <span className="hud-label">Mode</span>
          <span className="hud-value" style={{ textTransform: 'capitalize' }}>
            {mapViewMode === 'street' ? 'Street-Level' : mapViewMode === 'dark' ? 'Dark View' : 'Standard 3D'}
          </span>
        </div>
      </div>
    </div>
  );
}
