import React, { useState, useMemo } from 'react';
import Navbar from './components/Navbar';
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
      metadata: { ...VILLAGE_METADATA, name: "Synthetic Demo — Not Official Data", source: "Synthetic Rural Cadastral Model" },
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
  const [mapViewMode, setMapViewMode] = useState('standard');

  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const [customToken, setCustomToken] = useState(() => {
    return localStorage.getItem('sih_cesium_token') || '';
  });

  const handleSaveToken = (newToken) => {
    setCustomToken(newToken);
    if (newToken) { localStorage.setItem('sih_cesium_token', newToken); }
    else { localStorage.removeItem('sih_cesium_token'); }
  };

  const handleSelectDataset = (key) => {
    setCurrentDatasetKey(key); setSelectedParcel(null); setSelectedUnitId(null);
    setFlyToTrigger((p) => p + 1);
  };
  const handleImportSuccess = (parsedCadastre) => {
    setImportedDataset(parsedCadastre); setCurrentDatasetKey('imported');
    setSelectedParcel(parsedCadastre.parcels[0] || null); setSelectedUnitId(null);
    setFlyToTrigger((p) => p + 1);
  };
  const handleSelectParcel = (parcel) => { setSelectedParcel(parcel); setSelectedUnitId(null); };
  const handleResetView = () => { setSelectedParcel(null); setSelectedUnitId(null); setFlyToTrigger((p) => p + 1); };
  const handleZoomToDataset = () => { setSelectedParcel(null); setSelectedUnitId(null); setFlyToTrigger((p) => p + 1); };

  return (
    <div className="app-container">
      <Navbar
        searchTerm={searchTerm} setSearchTerm={setSearchTerm} onResetView={handleResetView}
        onOpenTokenModal={() => setIsTokenModalOpen(true)}
        onOpenAboutModal={() => setIsAboutModalOpen(true)}
        onOpenImportModal={() => setIsImportModalOpen(true)}
        hasCustomToken={Boolean(customToken || import.meta.env.VITE_CESIUM_ION_TOKEN)}
        currentDatasetKey={currentDatasetKey} onSelectDataset={handleSelectDataset}
        activeMetadata={activeDataset.metadata}
      />

      <CityControlsToolbar
        showBuildings={showBuildings} setShowBuildings={setShowBuildings}
        colorByHeight={colorByHeight} setColorByHeight={setColorByHeight}
        onZoomToDataset={handleZoomToDataset}
        show3DStrata={show3DStrata} setShow3DStrata={setShow3DStrata}
        mapViewMode={mapViewMode} setMapViewMode={setMapViewMode}
        onResetView={handleResetView}
      />

      <CesiumViewer
        parcels={activeDataset.parcels} roads={activeDataset.roads}
        metadata={activeDataset.metadata}
        selectedParcel={selectedParcel} onSelectParcel={handleSelectParcel}
        selectedUnitId={selectedUnitId} onSelectUnit={setSelectedUnitId}
        showBuildings={showBuildings} colorByHeight={colorByHeight}
        show3DStrata={show3DStrata} mapViewMode={mapViewMode}
        customToken={customToken} flyToTrigger={flyToTrigger}
      />

      {selectedParcel && (
        <ParcelDetailPanel
          parcel={selectedParcel}
          onClose={() => { setSelectedParcel(null); setSelectedUnitId(null); }}
          selectedUnitId={selectedUnitId} onSelectUnit={setSelectedUnitId}
        />
      )}

      <footer className="bottom-disclaimer-bar">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span className="disclaimer-pill">
            <ShieldAlert size={13} />
            {currentDatasetKey === 'nyc' ? 'OPEN DATA BENCHMARK' : 'SYNTHETIC DEMO'}
          </span>
          <span>{activeDataset.metadata.name} ({activeDataset.metadata.source})</span>
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

      <TokenModal isOpen={isTokenModalOpen} onClose={() => setIsTokenModalOpen(false)} currentToken={customToken} onSaveToken={handleSaveToken} />
      <AboutModal isOpen={isAboutModalOpen} onClose={() => setIsAboutModalOpen(false)} activeDatasetMetadata={activeDataset.metadata} />
      <ImportGeoJsonModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} onImportSuccess={handleImportSuccess} />
    </div>
  );
}
