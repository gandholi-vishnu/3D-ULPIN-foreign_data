import React from 'react';
import {
  Building2,
  Flame,
  Maximize2,
  Layers,
  RotateCcw,
  Globe,
  Compass,
  Moon,
  ArrowLeft
} from 'lucide-react';

export default function CityControlsToolbar({
  showBuildings,
  setShowBuildings,
  colorByHeight,
  setColorByHeight,
  onZoomToDataset,
  show3DStrata,
  setShow3DStrata,
  mapViewMode = 'standard',
  setMapViewMode,
  onResetView
}) {
  return (
    <>
      {/* Floating 3D City Controls Toolbar */}
      <div className="city-controls-bar">
        {/* Three Map View Modes (Standard Map | Street View | Dark View) */}
        <div className="view-mode-segmented">
          <button
            className={`view-mode-tab ${mapViewMode === 'standard' ? 'active' : ''}`}
            onClick={() => setMapViewMode('standard')}
            title="Standard aerial 3D city perspective"
          >
            <Globe size={13} />
            <span>Standard Map</span>
          </button>

          <button
            className={`view-mode-tab ${mapViewMode === 'street' ? 'active' : ''}`}
            onClick={() => setMapViewMode('street')}
            title="Street-Level 3D pedestrian view navigating between skyscrapers"
          >
            <Compass size={13} />
            <span>Street View</span>
          </button>

          <button
            className={`view-mode-tab ${mapViewMode === 'dark' ? 'active' : ''}`}
            onClick={() => setMapViewMode('dark')}
            title="Dark-themed map view with glowing height-coded building envelopes"
          >
            <Moon size={13} />
            <span>Dark View</span>
          </button>
        </div>

        <div className="toolbar-divider" />

        {/* 1. Show/Hide Buildings */}
        <button
          className={`city-ctrl-btn ${showBuildings ? 'active' : ''}`}
          onClick={() => setShowBuildings(!showBuildings)}
          title="Toggle 3D City Buildings visibility"
        >
          <Building2 size={14} />
          {showBuildings ? 'Buildings: ON' : 'Buildings: OFF'}
        </button>

        {/* 2. Color by Height */}
        <button
          className={`city-ctrl-btn ${colorByHeight ? 'active-flame' : ''}`}
          onClick={() => setColorByHeight(!colorByHeight)}
          title="Toggle height-based gradient heatmap colors"
        >
          <Flame size={14} color={colorByHeight ? '#ffea00' : '#f97316'} />
          Height Heatmap
        </button>

        {/* 3. 3D Strata */}
        <button
          className={`city-ctrl-btn ${show3DStrata ? 'active' : ''}`}
          onClick={() => setShow3DStrata(!show3DStrata)}
          title="Toggle vertical floor strata division and Sub-ULPINs"
        >
          <Layers size={14} />
          3D Strata {show3DStrata ? 'ON' : 'OFF'}
        </button>

        {/* 4. Zoom to City */}
        <button
          className="city-ctrl-btn"
          onClick={onZoomToDataset}
          title="Fit camera to frame full 3D city skyline"
        >
          <Maximize2 size={13} />
          Zoom to City
        </button>

        {/* 5. Reset View */}
        <button
          className="city-ctrl-btn"
          onClick={onResetView}
          title="Reset camera to default view angle"
        >
          <RotateCcw size={13} />
          Reset View
        </button>
      </div>

      {/* Street View Mode Active Floating Indicator */}
      {mapViewMode === 'street' && (
        <div className="street-view-indicator glass-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="pulsing-street-dot" />
            <div>
              <div style={{ fontWeight: 700, fontSize: '13px', color: '#38bdf8' }}>
                Street-Level 3D View (Pedestrian Perspective)
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                Navigating Lower Manhattan skyscraper canyons at street grade (~3.5m elev)
              </div>
            </div>
          </div>
          <button
            className="exit-street-btn"
            onClick={() => setMapViewMode('standard')}
            title="Return to aerial overview"
          >
            <ArrowLeft size={13} />
            Return to Standard View
          </button>
        </div>
      )}

      {/* Height-Based Color Legend (Consistent across Standard & Dark Views) */}
      {colorByHeight && (
        <div className={`height-legend-bar ${mapViewMode === 'dark' ? 'dark-mode-legend' : ''}`}>
          <span style={{ fontWeight: 700, color: '#f8fafc', marginRight: '4px' }}>
            Building Height:
          </span>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: '#3b82f6' }} />
            &lt; 60m
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: '#06b6d4' }} />
            60m - 120m
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: '#eab308' }} />
            120m - 200m
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: '#f97316' }} />
            200m - 300m
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: '#ef4444' }} />
            &gt; 300m (Supertalls)
          </div>
        </div>
      )}
    </>
  );
}
