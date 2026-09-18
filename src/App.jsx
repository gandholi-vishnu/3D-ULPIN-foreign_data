import React, { useState, useMemo } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import ParcelDetailPanel from './components/ParcelDetailPanel';
import CesiumViewer from './components/CesiumViewer';
import CityControlsToolbar from './components/CityControlsToolbar';
import TokenModal from './components/TokenModal';
import AboutModal from './components/AboutModal';
import ImportGeoJsonModal from './components/ImportGeoJsonModal';

import { NYC_PARCELS, NYC_ROADS, NYC_METADATA } from './data/nycData';
import { SAMPLE_PARCELS, VILLAGE_ROADS, VILLAGE_METADATA } from './data/villageData';
import { ShieldAlert, Compass, Database } from 'lucide-react';

export default function App() {
  // Dataset Management: 'nyc' (Foreign City - New York) | 'synthetic' (Synthetic Demo) | 'imported'
  const [currentDatasetKey, setCurrentDatasetKey] = useState('nyc');
  const [importedDataset, setImportedDataset] = useState(null);

  // Active dataset resolver
  const activeDataset = useMemo(() => {
    if (currentDatasetKey === 'nyc') {
      return {
        metadata: NYC_METADATA,
        parcels: NYC_PARCELS,
        roads: NYC_ROADS
      };
    }
    if (currentDatasetKey === 'imported' && importedDataset) {
      return importedDataset;
    }
    return {
      metadata: {
        ...VILLAGE_METADATA,
        name: "Synthetic Demo — Not Official Data",
        source: "Synthetic Rural Cadastral Model"
      },
      parcels: SAMPLE_PARCELS,
      roads: VILLAGE_ROADS
    };
  }, [currentDatasetKey, importedDataset]);

  // Parcel & Strata selection state (starts null for unobstructed 3D skyline overview)
  const [selectedParcel, setSelectedParcel] = useState(null);
  const [selectedUnitId, setSelectedUnitId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [flyToTrigger, setFlyToTrigger] = useState(0);

  // 3D City Visualization Controls
  const [showBuildings, setShowBuildings] = useState(true);
  const [colorByHeight, setColorByHeight] = useState(true); // Default ON to match the 3D City Height Visualization screenshot!
  const [show3DStrata, setShow3DStrata] = useState(true);
  const [is2DView, setIs2DView] = useState(false);

  // Modals state
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Cesium Ion Token
  const [customToken, setCustomToken] = useState(() => {
    return localStorage.getItem('sih_cesium_token') || '';
  });

  const handleSaveToken = (newToken) => {
    setCustomToken(newToken);
    if (newToken) {
      localStorage.setItem('sih_cesium_token', newToken);
    } else {
      localStorage.removeItem('sih_cesium_token');
    }
  };

  const handleSelectDataset = (key) => {
    setCurrentDatasetKey(key);
    setSelectedParcel(null);
    setSelectedUnitId(null);
    setFlyToTrigger((prev) => prev + 1);
  };

  const handleImportSuccess = (parsedCadastre) => {
    setImportedDataset(parsedCadastre);
    setCurrentDatasetKey('imported');
    setSelectedParcel(parsedCadastre.parcels[0] || null);
    setSelectedUnitId(null);
    setFlyToTrigger((prev) => prev + 1);
  };

  const handleSelectParcel = (parcel) => {
    setSelectedParcel(parcel);
    setSelectedUnitId(null);
  };

  const handleResetView = () => {
    setSelectedParcel(null);
    setSelectedUnitId(null);
    setFlyToTrigger((prev) => prev + 1);
  };

  const handleZoomToDataset = () => {
    setSelectedParcel(null);
    setSelectedUnitId(null);
    setFlyToTrigger((prev) => prev + 1);
  };

  return (
    <div className="app-container">
      {/* Top Header Bar */}
      <Navbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        onResetView={handleResetView}
        onOpenTokenModal={() => setIsTokenModalOpen(true)}
        onOpenAboutModal={() => setIsAboutModalOpen(true)}
        onOpenImportModal={() => setIsImportModalOpen(true)}
        hasCustomToken={Boolean(customToken || import.meta.env.VITE_CESIUM_ION_TOKEN)}
        currentDatasetKey={currentDatasetKey}
        onSelectDataset={handleSelectDataset}
        activeMetadata={activeDataset.metadata}
      />

      {/* Floating 3D City Controls Toolbar */}
      <CityControlsToolbar
        showBuildings={showBuildings}
        setShowBuildings={setShowBuildings}
        colorByHeight={colorByHeight}
        setColorByHeight={setColorByHeight}
        onZoomToDataset={handleZoomToDataset}
        show3DStrata={show3DStrata}
        setShow3DStrata={setShow3DStrata}
        is2DView={is2DView}
        setIs2DView={setIs2DView}
        onResetView={handleResetView}
      />

      {/* 3D Cesium Cadastral Globe */}
      <CesiumViewer
        parcels={activeDataset.parcels}
        roads={activeDataset.roads}
        metadata={activeDataset.metadata}
        selectedParcel={selectedParcel}
        onSelectParcel={handleSelectParcel}
        selectedUnitId={selectedUnitId}
        onSelectUnit={setSelectedUnitId}
        showBuildings={showBuildings}
        colorByHeight={colorByHeight}
        show3DStrata={show3DStrata}
        is2DView={is2DView}
        customToken={customToken}
        flyToTrigger={flyToTrigger}
      />

      {/* Left Sidebar - Cadastral Parcel Explorer */}
      <Sidebar
        parcels={activeDataset.parcels}
        selectedParcel={selectedParcel}
        onSelectParcel={handleSelectParcel}
        searchTerm={searchTerm}
      />

      {/* Right Details Panel - Selected Parcel & Vertical Strata Units */}
      {selectedParcel && (
        <ParcelDetailPanel
          parcel={selectedParcel}
          onClose={() => {
            setSelectedParcel(null);
            setSelectedUnitId(null);
          }}
          selectedUnitId={selectedUnitId}
          onSelectUnit={setSelectedUnitId}
        />
      )}

      {/* Bottom Status & Data Source Bar */}
      <footer className="bottom-disclaimer-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="disclaimer-pill">
            <ShieldAlert size={13} />
            {currentDatasetKey === 'nyc' ? 'OPEN DATA BENCHMARK' : 'SYNTHETIC DEMO'}
          </span>
          <span>
            {activeDataset.metadata.name} ({activeDataset.metadata.source})
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Compass size={13} color="#38bdf8" />
            {activeDataset.metadata.center.latitude.toFixed(4)}°N, {Math.abs(activeDataset.metadata.center.longitude).toFixed(4)}°W (WGS 84)
          </span>
          <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>
            {activeDataset.parcels.length} Mapped Features • {activeDataset.metadata.totalVerticalUnits || 120} Strata Units
          </span>
        </div>
      </footer>

      {/* Modals */}
      <TokenModal
        isOpen={isTokenModalOpen}
        onClose={() => setIsTokenModalOpen(false)}
        currentToken={customToken}
        onSaveToken={handleSaveToken}
      />

      <AboutModal
        isOpen={isAboutModalOpen}
        onClose={() => setIsAboutModalOpen(false)}
        activeDatasetMetadata={activeDataset.metadata}
      />

      <ImportGeoJsonModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportSuccess={handleImportSuccess}
      />
    </div>
  );
}
