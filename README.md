# 3D ULPIN Generation & Vertical Property Mapping System
### Smart India Hackathon (SIH 2026) Prototype

An interactive 3D WebGIS prototype built with **React**, **Vite**, and **CesiumJS** to demonstrate **3D Cadastral Mapping**, **Unique Land Parcel Identification Numbers (ULPIN)**, and **Vertical Property / Strata Ownership**.

---

## ⚡ Quick Start

### 1. Open Terminal and Navigate to the Project
```bash
cd C:\Users\vishnu\.gemini\antigravity\scratch\ulpin-3d-prototype
```

### 2. Start the Local Development Server
```bash
npm run dev
```

### 3. Open in Browser
```
http://localhost:5173
```

---

## 🏙️ 3D City Visualization & Verified Foreign Geospatial Dataset

The system features an authentic, large-scale 3D city visualization of **Lower Manhattan / Financial District, New York City, USA**:

* **Authentic Sources:** Sourced from **NYC Open Data (NYC Department of Information Technology & Telecommunications - DOITT)** and **OpenStreetMap (ODbL)**.
* **Realistic City Skyline:** Features iconic surveyed 3D skyscrapers (One World Trade Center 541m, 3 WTC 329m, 4 WTC 298m, 70 Pine St 290m, 40 Wall St 283m, Woolworth Building 241m, Goldman Sachs HQ 228m) alongside real road corridors (Broadway, Wall St, West St, Water St, Fulton St).
* **Cesium 3D City Controls Toolbar:**
  1. **Buildings: ON/OFF:** Toggle 3D city buildings visibility.
  2. **Color by Height:** Dynamic gradient heatmap (Red &gt;300m, Orange 200–300m, Gold 120–200m, Cyan 60–120m, Blue &lt;60m).
  3. **Zoom to City:** Smoothly frame the entire 3D skyline.
  4. **3D Strata ON/OFF:** Partition multi-story buildings into discrete vertical strata slabs.
  5. **2D / 3D View Mode:** Morph smoothly between 3D Globe Perspective and 2D Cadastral Plan.
  6. **Reset View:** Return to the default camera angle.

---

## 🚀 Datasets Available in Dropdown

1. **Foreign City — New York, USA:**
   - Authentic WGS 84 geometries, surveyed roof heights, and municipal road networks.
   - Global 3D streaming enabled via Cesium OSM Buildings if an Ion token is configured, with high-fidelity local dataset fallback.
2. **Synthetic Demo — Not Official Data:**
   - Sample model village demonstrating rural cadastral boundaries, agricultural plots, government complex, and residential buildings.
3. **Custom Imported GeoJSON:**
   - Load any custom GeoJSON parcel file to test centroid calculation, Base ULPIN generation, and 3D extrusion.

---

## ⚠️ Data Provenance & Legal Disclaimers

1. **Foreign Data Notice:** Foreign geospatial data (NYC Open Data / OpenStreetMap) is used strictly as an open-access technical benchmark for software evaluation. It is **NOT** official Indian cadastral data.
2. **Generated Identifiers:** All ULPIN numbers are **Prototype-generated ULPINs — Not official government ULPINs**. All floor identifiers are **Prototype-generated Sub-ULPINs**.
3. **No Official Claim:** Neither OpenStreetMap nor municipal open data portals provide official cadastral ownership or sovereign legal ULPIN data.
4. **Cadastral Scope (ISO 19152 LADM):** Focuses on legal volumetric strata parcels (floors and whole titles). Private interior architecture (bedrooms, kitchens, bathrooms) is deliberately excluded.
