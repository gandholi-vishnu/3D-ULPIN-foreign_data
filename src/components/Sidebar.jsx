import React, { useState, useMemo } from 'react';
import { Layers, ChevronRight, Building, Trees, Landmark } from 'lucide-react';

export default function Sidebar({
  parcels = [],
  selectedParcel,
  onSelectParcel,
  searchTerm
}) {
  const [filterType, setFilterType] = useState('ALL');

  const filteredParcels = useMemo(() => {
    return parcels.filter((parcel) => {
      // Search filter
      const matchesSearch =
        !searchTerm ||
        parcel.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parcel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parcel.ulpin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parcel.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
        parcel.landType.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      // Category filter
      if (filterType === 'VERTICAL') return parcel.isVerticalProperty;
      if (filterType === 'AGRI') return parcel.landType.toLowerCase().includes('agri');
      if (filterType === 'COMM') return parcel.landType.toLowerCase().includes('comm') || parcel.landType.toLowerCase().includes('tech');
      if (filterType === 'PUBLIC') return !parcel.landType.toLowerCase().includes('agri') && !parcel.isVerticalProperty;
      return true;
    });
  }, [parcels, searchTerm, filterType]);

  const totalCount = parcels.length;
  const verticalCount = parcels.filter(p => p.isVerticalProperty).length;

  return (
    <aside className="sidebar glass-panel">
      <div className="sidebar-header">
        <div className="sidebar-title-row">
          <span className="sidebar-title">
            <Layers size={16} color="#38bdf8" />
            Cadastral Parcels ({filteredParcels.length})
          </span>
          <span style={{ fontSize: '11px', color: 'var(--text-subtle)' }}>
            Total: {totalCount}
          </span>
        </div>

        {/* Filter Pills */}
        <div className="filter-pills">
          <button
            className={`pill ${filterType === 'ALL' ? 'active' : ''}`}
            onClick={() => setFilterType('ALL')}
          >
            All ({totalCount})
          </button>
          <button
            className={`pill ${filterType === 'VERTICAL' ? 'active' : ''}`}
            onClick={() => setFilterType('VERTICAL')}
          >
            3D Vertical ({verticalCount})
          </button>
          <button
            className={`pill ${filterType === 'AGRI' ? 'active' : ''}`}
            onClick={() => setFilterType('AGRI')}
          >
            Agricultural
          </button>
          <button
            className={`pill ${filterType === 'COMM' ? 'active' : ''}`}
            onClick={() => setFilterType('COMM')}
          >
            Commercial
          </button>
          <button
            className={`pill ${filterType === 'PUBLIC' ? 'active' : ''}`}
            onClick={() => setFilterType('PUBLIC')}
          >
            Public / Commons
          </button>
        </div>
      </div>

      {/* Parcels List */}
      <div className="parcel-list">
        {filteredParcels.length === 0 ? (
          <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-subtle)', fontSize: '13px' }}>
            No parcels match your search filter.
          </div>
        ) : (
          filteredParcels.map((parcel) => {
            const isSelected = selectedParcel?.id === parcel.id;
            return (
              <div
                key={parcel.id}
                className={`parcel-card ${isSelected ? 'selected' : ''}`}
                onClick={() => onSelectParcel(parcel)}
              >
                <div className="card-top">
                  <span className="parcel-id-chip">{parcel.id}</span>
                  {parcel.isVerticalProperty ? (
                    <span className="badge-tag badge-vertical">
                      3D Vertical ({parcel.totalFloors}L)
                    </span>
                  ) : parcel.landType.toLowerCase().includes('agri') ? (
                    <span className="badge-tag badge-agri">
                      Agricultural
                    </span>
                  ) : (
                    <span className="badge-tag badge-govt">
                      {parcel.landType.split('/')[0].split('(')[0].trim()}
                    </span>
                  )}
                </div>

                <div className="card-name" title={parcel.name}>
                  {parcel.name}
                </div>

                <div className="card-ulpin">
                  <span>ULPIN:</span>
                  <span style={{ color: '#e2e8f0' }}>{parcel.ulpin}</span>
                </div>

                <div className="card-meta">
                  <span>{parcel.areaDisplay}</span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '3px', color: isSelected ? '#38bdf8' : 'var(--text-subtle)' }}>
                    Fly to <ChevronRight size={12} />
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}
