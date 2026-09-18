import React, { useState, useMemo } from 'react';
import Navbar from './components/Navbar';
import DashboardHud from './components/DashboardHud';
import ParcelDetailPanel from './components/ParcelDetailPanel';
import CesiumViewer from './components/CesiumViewer';
import CityControlsToolbar from './components/CityControlsToolbar';
import TokenModal from './components/TokenModal';
import AboutModal from './components/AboutModal';
import ImportGeoJsonModal from './components/ImportGeoJsonModal';

import { NYC_PARCELS, NYC_ROADS, NYC_METADATA } from './data/nycData';
import { SAMPLE_PARCELS, VILLAGE_ROADS, VILLAGE_METADATA } from './data/villageData';
import { ShieldAlert, Compass } from 'lucide-react';

export default function App() {
  const [currentDatasetKey, setCurrentDatasetKey] = useState('nyc');
  const [importedDataset, setImportedDataset] = useState(null);

  const activeDataset = useMemo(() => {
    if (currentDatasetKey === 'nyc') {
      return { metadata: NYC_METADATA, parcels: NYC_PARCELS, roads: NYC_ROADS };
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

  const [selectedParcel, setSelectedParcel] = useState(null);
  const [selectedUnitId, setSelectedUnitId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [flyToTrigger, setFlyToTrigger] = useState(0);

  const [showBuildings, setShowBuildings] = useState(true);
  const [colorByHeight, setColorByHeight] = useState(true);
  const [show3DStrata, setShow3DStrata] = useState(true);
  const [mapViewMode, setMapViewMode] = useState('standard'); // 'standard' | 'street' | 'dark'

  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

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
    setFlyToTrigger((p) => p + 1);
  };

  const handleImportSuccess = (parsedCadastre) => {
    setImportedDataset(parsedCadastre);
    setCurrentDatasetKey('imported');
    setSelectedParcel(parsedCadastre.parcels[0] || null);
    setSelectedUnitId(null);
    setFlyToTrigger((p) => p + 1);
  };

  const handleSelectParcel = (parcel) => {
    setSelectedParcel(parcel);
    setSelectedUnitId(null);
  };

  const handleResetView = () => {
    setSelectedParcel(null);
    setSelectedUnitId(null);
    setFlyToTrigger((p) => p + 1);
  };

  const handleZoomToDataset = () => {
    setSelectedParcel(null);
    setSelectedUnitId(null);
    setFlyToTrigger((p) => p + 1);
  };

  // Search matching
  const matchingParcel = useMemo(() => {
    if (!searchTerm.trim()) return null;
    const q = searchTerm.toLowerCase();
    return activeDataset.parcels.find(
      (p) =>
        p.name?.toLowerCase().includes(q) ||
        p.id?.toLowerCase().includes(q) ||
        p.ulpin?.toLowerCase().includes(q) ||
        p.surveyNumber?.toLowerCase().includes(q)
    );
  }, [searchTerm, activeDataset.parcels]);

  // When search matches a building, automatically select it
  React.useEffect(() => {
    if (matchingParcel) {
      setSelectedParcel(matchingParcel);
      setSelectedUnitId(null);
    }
  }, [matchingParcel]);

  // Total strata units count
  const totalStrataCount = useMemo(() => {
    return activeDataset.parcels.reduce((acc, p) => {
      return acc + (p.verticalStrata?.length || p.totalFloors || 0);
    }, 0);
  }, [activeDataset.parcels]);

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
        mapViewMode={mapViewMode}
        setMapViewMode={setMapViewMode}
        onResetView={handleResetView}
      />

      {/* Modern Dashboard HUD Stats Cards */}
      <DashboardHud
        totalBuildings={activeDataset.parcels.length}
        totalStrataUnits={totalStrataCount}
        selectedParcel={selectedParcel}
        selectedUnitId={selectedUnitId}
        mapViewMode={mapViewMode}
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
        mapViewMode={mapViewMode}
        customToken={customToken}
        flyToTrigger={flyToTrigger}
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
            <ShieldAlert size={12} />
            {currentDatasetKey === 'nyc' ? 'OPEN DATA BENCHMARK' : 'SYNTHETIC DEMO'}
          </span>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>
            {activeDataset.metadata.name}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#94a3b8' }}>
            <Compass size={12} color="#38bdf8" />
            {activeDataset.metadata.center.latitude.toFixed(4)}°N, {Math.abs(activeDataset.metadata.center.longitude).toFixed(4)}°W (WGS 84)
          </span>
          <span style={{ color: '#00f2fe', fontWeight: 600, fontSize: '11px' }}>
            {activeDataset.parcels.length} Mapped Features • {totalStrataCount} Strata Levels
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
