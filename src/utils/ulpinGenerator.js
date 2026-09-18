/**
 * ULPIN & Sub-ULPIN Standardized Generator
 * Smart India Hackathon 2026 — 3D ULPIN & Vertical Property Mapping System
 * 
 * Rules:
 * 1. Base ULPIN format: e.g. US-NYC-100-058-0004 or US-NYC-BIN-1001004
 * 2. Floor Sub-ULPIN format: ${parentUlpin}-FL${String(floorNumber).padStart(2, '0')}
 *    Example: US-NYC-100-058-0004-FL00 (Ground Level 0)
 *             US-NYC-100-058-0004-FL01 (Level 1)
 *             ...
 *             US-NYC-100-058-0004-FL60 (Level 60)
 * 3. All generated identifiers are clearly labeled as Prototype-generated Sub-ULPINs.
 */

/**
 * Generates a unique, standardized Sub-ULPIN for any floor number.
 * @param {string} parentUlpin - Parent building ULPIN
 * @param {number} floorNumber - Floor index (0 for Ground Floor)
 * @returns {string} - e.g. "US-NYC-100-058-0004-FL00"
 */
export function generateFloorSubUlpin(parentUlpin, floorNumber) {
  const safeParent = parentUlpin || 'US-NYC-GEN-0001';
  const safeFloor = Math.max(0, parseInt(floorNumber, 10) || 0);
  const floorPad = String(safeFloor).padStart(2, '0');
  return `${safeParent}-FL${floorPad}`;
}

/**
 * Returns height-based color corresponding to the 5-tier SIH building height legend:
 * - < 60m: Blue (#3b82f6)
 * - 60m - 120m: Cyan (#06b6d4)
 * - 120m - 200m: Amber/Gold (#eab308)
 * - 200m - 300m: Orange (#f97316)
 * - > 300m (Supertall): Red (#ef4444)
 */
export function getBuildingHeightColor(height) {
  const h = Number(height) || 20;
  if (h >= 300) return '#ef4444'; // Red: Supertalls (> 300m)
  if (h >= 200) return '#f97316'; // Orange: High-rises (200m - 300m)
  if (h >= 120) return '#eab308'; // Amber/Gold: Mid-High (120m - 200m)
  if (h >= 60) return '#06b6d4';  // Cyan: Mid-rise (60m - 120m)
  return '#3b82f6';               // Blue: Lower structures (< 60m)
}

/**
 * Generates a complete array of floor strata records for ALL floors of a building.
 * If the building already has specific custom floor records (e.g. Level 60 Spotify Hub on 4 WTC),
 * those custom details are preserved while generating all other floors seamlessly.
 *
 * @param {Object} building - Building object with id, ulpin, extrudedHeight, totalFloors, etc.
 * @returns {Array} - Array of floor strata records for all floors [0, ..., totalFloors - 1]
 */
export function generateFullBuildingStrata(building) {
  if (!building) return [];

  const parentUlpin = building.ulpin || `US-NYC-BLDG-${building.id || '1001'}`;
  const totalFloors = Math.max(1, parseInt(building.totalFloors, 10) || Math.round((building.extrudedHeight || 40) / 3.8));
  const buildingHeight = Number(building.extrudedHeight) || (totalFloors * 3.8);
  const floorHeight = buildingHeight / totalFloors;
  const baseArea = Number(building.areaSqM) || 2200;

  // Map of existing custom floor entries if present
  const existingMap = new Map();
  if (Array.isArray(building.verticalStrata)) {
    building.verticalStrata.forEach((unit) => {
      existingMap.set(unit.floorNumber, unit);
    });
  }

  const result = [];
  for (let f = 0; f < totalFloors; f++) {
    const existing = existingMap.get(f);
    const subUlpin = generateFloorSubUlpin(parentUlpin, f);
    const floorBaseElev = (f * floorHeight);
    const floorTopElev = ((f + 1) * floorHeight);

    let floorLabel;
    if (f === 0) {
      floorLabel = 'Ground Level (Level 0)';
    } else if (f === totalFloors - 1) {
      floorLabel = `Top Floor (Level ${f})`;
    } else {
      floorLabel = `Level ${f}`;
    }

    let defaultUsage;
    let defaultOwner;
    if (f === 0) {
      defaultUsage = 'Retail & Transit Access / Ground Concourse';
      defaultOwner = building.owner ? `${building.owner} (Ground Title)` : 'Street Level Commercial Lessee';
    } else if (f === totalFloors - 1) {
      defaultUsage = 'Executive Penthouse / Rooftop Observation Title';
      defaultOwner = building.owner ? `${building.owner} (Crown Title)` : 'Penthouse Strata Titleholder';
    } else if (f % 5 === 0) {
      defaultUsage = 'Multi-Tenant Commercial Office Suites';
      defaultOwner = `Strata Titleholder (Suite ${f}00-${f}12)`;
    } else {
      defaultUsage = 'Commercial Office / Strata Title Unit';
      defaultOwner = `Strata Titleholder (Level ${f})`;
    }

    result.push({
      unitId: `${building.id}-FL${String(f).padStart(2, '0')}`,
      floorNumber: f,
      floorLabel: existing?.floorLabel || floorLabel,
      name: existing?.name || (f === 0 ? 'Ground Concourse & Retail' : `Strata Unit Level ${f}`),
      subUlpin: subUlpin, // Guaranteed valid, matching parent-FLxx
      owner: existing?.owner || defaultOwner,
      areaSqM: existing?.areaSqM || Math.round(baseArea * (1 - (f / (totalFloors * 3)))),
      usage: existing?.usage || defaultUsage,
      heightRange: `${floorBaseElev.toFixed(1)}m - ${floorTopElev.toFixed(1)}m`,
      elevation: (floorBaseElev + floorTopElev) / 2,
      color: existing?.color || getBuildingHeightColor(floorTopElev)
    });
  }

  return result;
}
