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
            title="Standard aerial 3D city view"
          >
            <Globe size={13} />
            <span>Standard</span>
          </button>

          <button
            className={`view-mode-tab ${mapViewMode === 'street' ? 'active' : ''}`}
            onClick={() => setMapViewMode('street')}
            title="Street-Level pedestrian perspective"
          >
            <Compass size={13} />
            <span>Street View</span>
          </button>

          <button
            className={`view-mode-tab ${mapViewMode === 'dark' ? 'active' : ''}`}
            onClick={() => setMapViewMode('dark')}
            title="Dark GIS theme with luminous height colors"
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
          title="Toggle 3D Buildings visibility"
        >
          <Building2 size={13} />
          <span>Buildings</span>
        </button>

        {/* 2. Color by Height */}
        <button
          className={`city-ctrl-btn ${colorByHeight ? 'active-flame' : ''}`}
          onClick={() => setColorByHeight(!colorByHeight)}
          title="Toggle height-based gradient heatmap colors"
        >
          <Flame size={13} color={colorByHeight ? '#ffea00' : '#f97316'} />
          <span>Height Heatmap</span>
        </button>

        {/* 3. 3D Strata */}
        <button
          className={`city-ctrl-btn ${show3DStrata ? 'active' : ''}`}
          onClick={() => setShow3DStrata(!show3DStrata)}
          title="Toggle vertical floor strata division"
        >
          <Layers size={13} />
          <span>3D Strata</span>
        </button>

        <div className="toolbar-divider" />

        {/* 4. Zoom to City */}
        <button
          className="city-ctrl-btn"
          onClick={onZoomToDataset}
          title="Fit camera to frame full 3D city skyline"
        >
          <Maximize2 size={13} />
          <span>Fit City</span>
        </button>

        {/* 5. Reset View */}
        <button
          className="city-ctrl-btn"
          onClick={onResetView}
          title="Reset camera to default perspective"
        >
          <RotateCcw size={13} />
          <span>Reset</span>
        </button>
      </div>

      {/* Street View Mode Indicator */}
      {mapViewMode === 'street' && (
        <div className="street-view-indicator glass-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="pulsing-street-dot" />
            <div>
              <div style={{ fontWeight: 700, fontSize: '12px', color: '#38bdf8' }}>
                Street-Level Perspective
              </div>
              <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                Ground grade view navigating Lower Manhattan skyscraper canyons
              </div>
            </div>
          </div>
          <button
            className="exit-street-btn"
            onClick={() => setMapViewMode('standard')}
            title="Return to aerial overview"
          >
            <ArrowLeft size={12} />
            Exit Street View
          </button>
        </div>
      )}

      {/* Height-Based Color Legend */}
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
            60m – 120m
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: '#eab308' }} />
            120m – 200m
          </div>
          <div className="legend-item">
            <span className="legend-dot" style={{ background: '#f97316' }} />
            200m – 300m
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
