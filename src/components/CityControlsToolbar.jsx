import React from 'react';
import {
  Building2,
  Flame,
  Maximize2,
  Layers,
  Eye,
  RotateCcw,
  Palette
} from 'lucide-react';

export default function CityControlsToolbar({
  showBuildings,
  setShowBuildings,
  colorByHeight,
  setColorByHeight,
  onZoomToDataset,
  show3DStrata,
  setShow3DStrata,
  is2DView,
  setIs2DView,
  onResetView
}) {
  return (
    <>
      {/* Floating 3D City Controls Toolbar */}
      <div className="city-controls-bar">
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
          Color by Height
        </button>

        {/* 3. Zoom to Dataset */}
        <button
          className="city-ctrl-btn"
          onClick={onZoomToDataset}
          title="Fit camera to frame full 3D city skyline"
        >
          <Maximize2 size={13} />
          Zoom to City
        </button>

        {/* 4. 3D Strata */}
        <button
          className={`city-ctrl-btn ${show3DStrata ? 'active' : ''}`}
          onClick={() => setShow3DStrata(!show3DStrata)}
          title="Toggle vertical floor strata division and Sub-ULPINs"
        >
          <Layers size={14} />
          3D Strata {show3DStrata ? 'ON' : 'OFF'}
        </button>

        {/* 5. 2D / 3D View */}
        <button
          className={`city-ctrl-btn ${is2DView ? 'active' : ''}`}
          onClick={() => setIs2DView(!is2DView)}
          title="Switch between 3D Perspective Globe and 2D Cadastral Plan"
        >
          <Eye size={13} />
          {is2DView ? '2D Plan View' : '3D City View'}
        </button>

        {/* 6. Reset View */}
        <button
          className="city-ctrl-btn"
          onClick={onResetView}
          title="Reset camera to default view angle"
        >
          <RotateCcw size={13} />
          Reset View
        </button>
      </div>

      {/* Height-Based Color Legend (Shown when Color by Height is active) */}
      {colorByHeight && (
        <div className="height-legend-bar">
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
