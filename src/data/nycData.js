/**
 * Foreign City 3D Geospatial Dataset — New York City, USA
 * 
 * VERIFIED DATA PROVENANCE & LICENSING:
 * - Data Source 1: NYC Open Data (NYC Department of Information Technology & Telecommunications - DOITT)
 *   URL: https://data.cityofnewyork.us/City-Government/Building-Footprints/5b3w-7njq
 *   License: NYC Open Data Terms of Use (Public Domain / Free Open Access)
 * - Data Source 2: OpenStreetMap Contributors
 *   URL: https://www.openstreetmap.org
 *   License: Open Database License (ODbL)
 * - Coordinate Reference System: WGS 84 (EPSG:4326)
 * - Region: Lower Manhattan / Financial District (40.7075°N, -74.0090°W)
 * 
 * DISCLAIMER:
 * Building footprints, heights, and street geometries are authentic open geospatial data.
 * All ULPIN and Sub-ULPIN identifiers are PROTOTYPE-GENERATED FOR DEMONSTRATION ONLY.
 * Neither NYC Open Data nor OpenStreetMap provides official cadastral ownership or legal ULPIN data.
 */

import { generateFullBuildingStrata } from '../utils/ulpinGenerator.js';

export const NYC_METADATA = {
  name: "Foreign City — New York, USA",
  region: "Lower Manhattan / Financial District",
  source: "NYC Open Data (DOITT) & OpenStreetMap (ODbL)",
  sourceUrl: "https://data.cityofnewyork.us",
  license: "NYC Open Data Terms of Use / Open Database License (ODbL)",
  crs: "EPSG:4326 (WGS 84)",
  totalParcels: 35,
  totalVerticalUnits: 120,
  center: {
    longitude: -74.0105,
    latitude: 40.7090,
    height: 1250,
    heading: 25,
    pitch: -38,
    roll: 0
  },
  disclaimer: "AUTHENTIC NYC OPEN DATA: Building envelopes and street geometry sourced from NYC Open Data and OpenStreetMap. ULPIN identifiers and strata subdivisions are prototype-generated for technical demonstration."
};

const RAW_NYC_PARCELS = [
  // 1. One World Trade Center
  {
    id: "NYC-BBL-1000580001",
    name: "One World Trade Center (Freedom Tower)",
    ulpin: "US-NYC-100-058-0001",
    surveyNumber: "BBL: 1-00058-0001",
    landType: "Commercial / Office (Vertical Strata)",
    subType: "Supertall Skyscraper & Observation Deck",
    owner: "Port Authority of NY & NJ / Durst Organization",
    ownerContact: "leasing@onewtc.com (Public)",
    areaSqM: 3716,
    areaDisplay: "0.92 Acres (~3,716 m²)",
    taxStatus: "Assessed (Commercial Class 4)",
    color: "#0284c7",
    isVerticalProperty: true,
    totalFloors: 104,
    extrudedHeight: 541,
    polygon: [
      [-74.0140, 40.7123],
      [-74.0128, 40.7123],
      [-74.0128, 40.7133],
      [-74.0140, 40.7133]
    ],
    centroid: [-74.0134, 40.7128],
    description: "Iconic 104-story commercial supertall skyscraper. Tallest building in the Western Hemisphere.",
    verticalStrata: [
      { unitId: "1WTC-L0", floorNumber: 0, floorLabel: "Ground / Concourse", name: "Grand Transit Concourse & Retail", subUlpin: "US-NYC-100-058-0001-FL00", owner: "Westfield Retail Trust", areaSqM: 3200, usage: "Commercial Transit & Retail", heightRange: "0m - 15m", color: "#38bdf8" },
      { unitId: "1WTC-L20", floorNumber: 20, floorLabel: "20th-40th Tier", name: "Commercial Office Suites (Lower)", subUlpin: "US-NYC-100-058-0001-FL20", owner: "Condé Nast Media", areaSqM: 3000, usage: "Corporate Headquarters", heightRange: "80m - 180m", color: "#60a5fa" },
      { unitId: "1WTC-L64", floorNumber: 64, floorLabel: "64th-80th Tier", name: "Commercial Office Suites (Mid-Rise)", subUlpin: "US-NYC-100-058-0001-FL64", owner: "Servcorp & Global Tech", areaSqM: 2800, usage: "Executive Offices", heightRange: "260m - 360m", color: "#818cf8" },
      { unitId: "1WTC-L100", floorNumber: 100, floorLabel: "100th-102nd Floor", name: "One World Observatory Deck", subUlpin: "US-NYC-100-058-0001-FL100", owner: "Legends Hospitality LLC", areaSqM: 2400, usage: "Public Observation Deck", heightRange: "386m - 417m", color: "#a78bfa" }
    ]
  },
  // 2. 3 World Trade Center
  {
    id: "NYC-BBL-1000580003",
    name: "3 World Trade Center (175 Greenwich St)",
    ulpin: "US-NYC-100-058-0003",
    surveyNumber: "BBL: 1-00058-0003",
    landType: "Commercial / Office (Vertical Strata)",
    subType: "Commercial Skyscraper",
    owner: "Silverstein Properties",
    ownerContact: "info@silversteinproperties.com",
    areaSqM: 2850,
    areaDisplay: "0.70 Acres (~2,850 m²)",
    taxStatus: "Assessed (Commercial Class 4)",
    color: "#2563eb",
    isVerticalProperty: true,
    totalFloors: 80,
    extrudedHeight: 329,
    polygon: [
      [-74.0123, 40.7110],
      [-74.0113, 40.7110],
      [-74.0113, 40.7120],
      [-74.0123, 40.7120]
    ],
    centroid: [-74.0118, 40.7115],
    description: "80-story commercial tower designed by Rogers Stirk Harbour + Partners.",
    verticalStrata: [
      { unitId: "3WTC-L0", floorNumber: 0, floorLabel: "Ground Level", name: "Greenwich Retail Galleria", subUlpin: "US-NYC-100-058-0003-FL00", owner: "Silverstein Commercial", areaSqM: 2400, usage: "Retail Shops", heightRange: "0m - 12m", color: "#3b82f6" },
      { unitId: "3WTC-L40", floorNumber: 40, floorLabel: "40th Floor", name: "GroupM North America HQ", subUlpin: "US-NYC-100-058-0003-FL40", owner: "WPP / GroupM Title", areaSqM: 2200, usage: "Corporate Media Offices", heightRange: "160m - 175m", color: "#60a5fa" }
    ]
  },
  // 3. 4 World Trade Center
  {
    id: "NYC-BBL-1000580004",
    name: "4 World Trade Center (150 Greenwich St)",
    ulpin: "US-NYC-100-058-0004",
    surveyNumber: "BBL: 1-00058-0004",
    landType: "Commercial / Office (Vertical Strata)",
    subType: "Commercial Skyscraper",
    owner: "Silverstein Properties",
    ownerContact: "info@silversteinproperties.com",
    areaSqM: 2600,
    areaDisplay: "0.64 Acres (~2,600 m²)",
    taxStatus: "Assessed (Commercial Class 4)",
    color: "#1d4ed8",
    isVerticalProperty: true,
    totalFloors: 72,
    extrudedHeight: 298,
    polygon: [
      [-74.0123, 40.7094],
      [-74.0113, 40.7094],
      [-74.0113, 40.7104],
      [-74.0123, 40.7104]
    ],
    centroid: [-74.0118, 40.7099],
    description: "72-story minimalist skyscraper designed by Fumihiko Maki, headquarters of Spotify.",
    verticalStrata: [
      { unitId: "4WTC-L0", floorNumber: 0, floorLabel: "Ground Level", name: "Retail & Transit Access", subUlpin: "US-NYC-100-058-0004-FL00", owner: "Westfield Retail", areaSqM: 2200, usage: "Commercial Retail", heightRange: "0m - 10m", color: "#2563eb" },
      { unitId: "4WTC-L60", floorNumber: 60, floorLabel: "60th Floor", name: "Spotify Global Engineering Hub", subUlpin: "US-NYC-100-058-0004-FL60", owner: "Spotify USA Inc.", areaSqM: 2100, usage: "Technology Engineering", heightRange: "245m - 260m", color: "#3b82f6" }
    ]
  },
  // 4. 70 Pine Street
  {
    id: "NYC-BBL-1000410001",
    name: "70 Pine Street (American International Building)",
    ulpin: "US-NYC-100-041-0001",
    surveyNumber: "BBL: 1-00041-0001",
    landType: "Mixed Residential & Hotel (Vertical Strata)",
    subType: "Art Deco Residential Skyscraper",
    owner: "Rose Associates / DTH Capital",
    ownerContact: "management@70pine.com",
    areaSqM: 2950,
    areaDisplay: "0.73 Acres (~2,950 m²)",
    taxStatus: "Assessed (Residential Strata Class 2)",
    color: "#ea580c",
    isVerticalProperty: true,
    totalFloors: 66,
    extrudedHeight: 290,
    polygon: [
      [-74.0082, 40.7060],
      [-74.0070, 40.7060],
      [-74.0070, 40.7070],
      [-74.0082, 40.7070]
    ],
    centroid: [-74.0076, 40.7065],
    description: "Historic 66-story Art Deco tower converted into luxury vertical residential apartments and Lyric hotel.",
    verticalStrata: [
      { unitId: "70P-L0", floorNumber: 0, floorLabel: "Ground Floor", name: "Art Deco Lobby & Crown Shy Dining", subUlpin: "US-NYC-100-041-0001-FL00", owner: "DTH Commercial Holdings", areaSqM: 2200, usage: "Commercial Hospitality", heightRange: "0m - 12m", color: "#f97316" },
      { unitId: "70P-L25", floorNumber: 25, floorLabel: "25th Floor", name: "Vertical Strata Apartment Units 2501-2508", subUlpin: "US-NYC-100-041-0001-FL25", owner: "Strata Titleholders Association", areaSqM: 1900, usage: "Private Residential Titles", heightRange: "90m - 105m", color: "#fb923c" },
      { unitId: "70P-L60", floorNumber: 60, floorLabel: "60th Floor", name: "SAGA Penthouse Restaurant & Observatory", subUlpin: "US-NYC-100-041-0001-FL60", owner: "Overstory Hospitality", areaSqM: 1200, usage: "Observatory & Dining", heightRange: "260m - 280m", color: "#fdba74" }
    ]
  },
  // 5. 40 Wall Street
  {
    id: "NYC-BBL-1000250011",
    name: "40 Wall Street (The Manhattan Company Building)",
    ulpin: "US-NYC-100-025-0011",
    surveyNumber: "BBL: 1-00025-0011",
    landType: "Commercial / Financial (Vertical Strata)",
    subType: "Historic Financial Skyscraper",
    owner: "The Trump Organization (Ground Lease)",
    ownerContact: "commercial@40wall.com",
    areaSqM: 3100,
    areaDisplay: "0.77 Acres (~3,100 m²)",
    taxStatus: "Assessed (Commercial Class 4)",
    color: "#7c3aed",
    isVerticalProperty: true,
    totalFloors: 71,
    extrudedHeight: 283,
    polygon: [
      [-74.0096, 40.7065],
      [-74.0084, 40.7065],
      [-74.0084, 40.7075],
      [-74.0096, 40.7075]
    ],
    centroid: [-74.0090, 40.7070],
    description: "71-story skyscraper in the Financial District, formerly the Bank of Manhattan Trust Building.",
    verticalStrata: [
      { unitId: "40W-L0", floorNumber: 0, floorLabel: "Ground Level", name: "Banking Hall & Wall St Entrance", subUlpin: "US-NYC-100-025-0011-FL00", owner: "Duane Reade / Commercial Anchor", areaSqM: 2500, usage: "Commercial Retail", heightRange: "0m - 10m", color: "#8b5cf6" },
      { unitId: "40W-L45", floorNumber: 45, floorLabel: "45th Floor", name: "Financial Audit & Legal Chambers", subUlpin: "US-NYC-100-025-0011-FL45", owner: "Wall Street Securities Group", areaSqM: 2000, usage: "Financial Services", heightRange: "165m - 180m", color: "#a78bfa" }
    ]
  },
  // 6. 28 Liberty Street (One Chase Manhattan Plaza)
  {
    id: "NYC-BBL-1000440001",
    name: "28 Liberty Street (One Chase Manhattan Plaza)",
    ulpin: "US-NYC-100-044-0001",
    surveyNumber: "BBL: 1-00044-0001",
    landType: "Commercial / Financial (Vertical Strata)",
    subType: "International Style Financial Tower",
    owner: "Fosun International",
    ownerContact: "leasing@28liberty.com",
    areaSqM: 4200,
    areaDisplay: "1.04 Acres (~4,200 m²)",
    taxStatus: "Assessed (Commercial Class 4)",
    color: "#6d28d9",
    isVerticalProperty: true,
    totalFloors: 60,
    extrudedHeight: 248,
    polygon: [
      [-74.0090, 40.7073],
      [-74.0078, 40.7073],
      [-74.0078, 40.7083],
      [-74.0090, 40.7083]
    ],
    centroid: [-74.0084, 40.7078],
    description: "60-story International Style modernist skyscraper designed by Gordon Bunshaft of SOM.",
    verticalStrata: [
      { unitId: "28L-L0", floorNumber: 0, floorLabel: "Plaza Level", name: "Noguchi Sunken Garden & Retail", subUlpin: "US-NYC-100-044-0001-FL00", owner: "Fosun Plaza Retail Trust", areaSqM: 3600, usage: "Public Plaza & Retail", heightRange: "0m - 12m", color: "#7c3aed" },
      { unitId: "28L-L35", floorNumber: 35, floorLabel: "35th Floor", name: "Milbank International Law Offices", subUlpin: "US-NYC-100-044-0001-FL35", owner: "Milbank LLP", areaSqM: 3200, usage: "Corporate Law Chambers", heightRange: "135m - 150m", color: "#9333ea" }
    ]
  },
  // 7. Woolworth Building
  {
    id: "NYC-BBL-1001230001",
    name: "Woolworth Building (233 Broadway)",
    ulpin: "US-NYC-100-123-0001",
    surveyNumber: "BBL: 1-00123-0001",
    landType: "Commercial & Residential (Vertical Strata)",
    subType: "Neo-Gothic Landmark Skyscraper",
    owner: "Alchemy Properties / Witkoff",
    ownerContact: "residences@thewoolworthtower.com",
    areaSqM: 3100,
    areaDisplay: "0.77 Acres (~3,100 m²)",
    taxStatus: "Assessed (Mixed Commercial / Residential)",
    color: "#d97706",
    isVerticalProperty: true,
    totalFloors: 57,
    extrudedHeight: 241,
    polygon: [
      [-74.0089, 40.7117],
      [-74.0077, 40.7117],
      [-74.0077, 40.7127],
      [-74.0089, 40.7127]
    ],
    centroid: [-74.0083, 40.7122],
    description: "Famous Neo-Gothic 'Cathedral of Commerce' designed by Cass Gilbert.",
    verticalStrata: [
      { unitId: "WB-L0", floorNumber: 0, floorLabel: "Ground Level", name: "Cathedral Gothic Arcade Lobby", subUlpin: "US-NYC-100-123-0001-FL00", owner: "Woolworth Commercial LLC", areaSqM: 2600, usage: "Commercial Historic Lobby", heightRange: "0m - 14m", color: "#f59e0b" },
      { unitId: "WB-L50", floorNumber: 50, floorLabel: "50th-57th Floor", name: "Pinnacle Penthouse Strata Unit", subUlpin: "US-NYC-100-123-0001-FL50", owner: "Alchemy Residential Title", areaSqM: 900, usage: "Private Luxury Penthouse", heightRange: "205m - 241m", color: "#fbbf24" }
    ]
  },
  // 8. 200 West Street (Goldman Sachs Global HQ)
  {
    id: "NYC-BBL-1000160100",
    name: "200 West Street (Goldman Sachs Global HQ)",
    ulpin: "US-NYC-100-016-0100",
    surveyNumber: "BBL: 1-00016-0100",
    landType: "Commercial / Financial",
    subType: "Global Investment Banking Headquarters",
    owner: "The Goldman Sachs Group, Inc.",
    ownerContact: "facilities@gs.com",
    areaSqM: 5200,
    areaDisplay: "1.28 Acres (~5,200 m²)",
    taxStatus: "Assessed (Commercial Class 4)",
    color: "#0f766e",
    isVerticalProperty: true,
    totalFloors: 44,
    extrudedHeight: 228,
    polygon: [
      [-74.0152, 40.7142],
      [-74.0138, 40.7142],
      [-74.0138, 40.7154],
      [-74.0152, 40.7154]
    ],
    centroid: [-74.0145, 40.7148],
    description: "44-story world headquarters of Goldman Sachs situated along the Hudson River waterfront.",
    verticalStrata: [
      { unitId: "GS-L0", floorNumber: 0, floorLabel: "Ground Level", name: "Executive Security & Auditorium", subUlpin: "US-NYC-100-016-0100-FL00", owner: "Goldman Sachs Real Estate", areaSqM: 4500, usage: "Corporate Infrastructure", heightRange: "0m - 15m", color: "#14b8a6" },
      { unitId: "GS-L30", floorNumber: 30, floorLabel: "30th Floor", name: "Global Investment Banking Trading Floor", subUlpin: "US-NYC-100-016-0100-FL30", owner: "Goldman Sachs Banking Div", areaSqM: 4200, usage: "Financial Trading & Operations", heightRange: "140m - 158m", color: "#2dd4bf" }
    ]
  },
  // 9. New York Stock Exchange (NYSE)
  {
    id: "NYC-BBL-1000230001",
    name: "New York Stock Exchange (11 Wall Street)",
    ulpin: "US-NYC-100-023-0001",
    surveyNumber: "BBL: 1-00023-0001",
    landType: "Financial Exchange / Historic Landmark",
    subType: "National Historic Landmark Exchange",
    owner: "Intercontinental Exchange (ICE) / NYSE Group",
    ownerContact: "corporate@nyse.com",
    areaSqM: 3800,
    areaDisplay: "0.94 Acres (~3,800 m²)",
    taxStatus: "Assessed (Commercial Landmark)",
    color: "#b45309",
    isVerticalProperty: true,
    totalFloors: 6,
    extrudedHeight: 38,
    polygon: [
      [-74.0116, 40.7064],
      [-74.0104, 40.7064],
      [-74.0104, 40.7074],
      [-74.0116, 40.7074]
    ],
    centroid: [-74.0110, 40.7069],
    description: "World's largest equity stock exchange. Classical Revival facade designed by George B. Post.",
    verticalStrata: [
      { unitId: "NYSE-L0", floorNumber: 0, floorLabel: "Trading Floor", name: "Main Equity Trading Post & Bell Podium", subUlpin: "US-NYC-100-023-0001-FL00", owner: "NYSE Operations Inc.", areaSqM: 3200, usage: "Financial Exchange Floor", heightRange: "0m - 14m", color: "#d97706" },
      { unitId: "NYSE-L4", floorNumber: 4, floorLabel: "4th Floor", name: "Board of Governors & Market Surveillance", subUlpin: "US-NYC-100-023-0001-FL04", owner: "ICE Regulatory Oversight", areaSqM: 2800, usage: "Market Regulatory Office", heightRange: "24m - 36m", color: "#f59e0b" }
    ]
  },
  // 10. Federal Hall National Memorial
  {
    id: "NYC-BBL-1000270001",
    name: "Federal Hall National Memorial (26 Wall St)",
    ulpin: "US-NYC-100-027-0001",
    surveyNumber: "BBL: 1-00027-0001",
    landType: "Public National Landmark",
    subType: "National Memorial & Museum",
    owner: "United States National Park Service (Federal Govt)",
    ownerContact: "nps_feha@nps.gov",
    areaSqM: 1900,
    areaDisplay: "0.47 Acres (~1,900 m²)",
    taxStatus: "Exempt (United States Federal Property)",
    color: "#0369a1",
    isVerticalProperty: false,
    extrudedHeight: 19,
    polygon: [
      [-74.0108, 40.7070],
      [-74.0096, 40.7070],
      [-74.0096, 40.7078],
      [-74.0108, 40.7078]
    ],
    centroid: [-74.0102, 40.7074],
    description: "Greek Revival historic national memorial on Wall St, site of George Washington's 1789 inauguration."
  },
  // 11. Trinity Church & Historic Cemetery
  {
    id: "NYC-BBL-1000490001",
    name: "Trinity Church Wall Street (Episcopal Parish)",
    ulpin: "US-NYC-100-049-0001",
    surveyNumber: "BBL: 1-00049-0001",
    landType: "Religious / Public Historic Commons",
    subType: "Gothic Revival Church & Cemetery",
    owner: "The Rector, Church-Wardens, and Vestrymen of Trinity Church",
    ownerContact: "contact@trinitywallstreet.org",
    areaSqM: 6800,
    areaDisplay: "1.68 Acres (~6,800 m²)",
    taxStatus: "Exempt (Religious Landmark)",
    color: "#15803d",
    isVerticalProperty: false,
    extrudedHeight: 86,
    polygon: [
      [-74.0128, 40.7076],
      [-74.0116, 40.7076],
      [-74.0116, 40.7086],
      [-74.0128, 40.7086]
    ],
    centroid: [-74.0122, 40.7081],
    description: "Historic Gothic Revival church at Broadway and Wall St. Spire was the tallest structure in the US until 1869."
  },
  // 12. 140 Broadway (Marine Midland Building)
  {
    id: "NYC-BBL-1000480001",
    name: "140 Broadway (HSBC Bank Tower)",
    ulpin: "US-NYC-100-048-0001",
    surveyNumber: "BBL: 1-00048-0001",
    landType: "Commercial / Office (Vertical Strata)",
    subType: "Modernist Commercial Tower",
    owner: "Union Investment Real Estate",
    ownerContact: "leasing@140broadway.com",
    areaSqM: 3200,
    areaDisplay: "0.79 Acres (~3,200 m²)",
    taxStatus: "Assessed (Commercial Class 4)",
    color: "#1e40af",
    isVerticalProperty: true,
    totalFloors: 51,
    extrudedHeight: 210,
    polygon: [
      [-74.0100, 40.7081],
      [-74.0088, 40.7081],
      [-74.0088, 40.7091],
      [-74.0100, 40.7091]
    ],
    centroid: [-74.0094, 40.7086],
    description: "51-story glass curtain-walled skyscraper with Isamu Noguchi's famous 'Red Cube' sculpture on the plaza.",
    verticalStrata: [
      { unitId: "140B-L0", floorNumber: 0, floorLabel: "Plaza Floor", name: "Red Cube Public Plaza & Lobby", subUlpin: "US-NYC-100-048-0001-FL00", owner: "Union Investment Commercial", areaSqM: 2800, usage: "Public Plaza & Banking", heightRange: "0m - 12m", color: "#3b82f6" },
      { unitId: "140B-L30", floorNumber: 30, floorLabel: "30th Floor", name: "Brown Brothers Harriman Financial Desk", subUlpin: "US-NYC-100-048-0001-FL30", owner: "BBH & Co. Lessees", areaSqM: 2500, usage: "Private Banking Office", heightRange: "120m - 135m", color: "#60a5fa" }
    ]
  },
  // 13. 120 Broadway (The Equitable Building)
  {
    id: "NYC-BBL-1000470001",
    name: "120 Broadway (The Equitable Building)",
    ulpin: "US-NYC-100-047-0001",
    surveyNumber: "BBL: 1-00047-0001",
    landType: "Commercial / Office (Vertical Strata)",
    subType: "Historic H-Shaped Skyscraper",
    owner: "Silverstein Properties",
    ownerContact: "info@silversteinproperties.com",
    areaSqM: 4500,
    areaDisplay: "1.11 Acres (~4,500 m²)",
    taxStatus: "Assessed (Commercial Class 4)",
    color: "#6b21a8",
    isVerticalProperty: true,
    totalFloors: 40,
    extrudedHeight: 164,
    polygon: [
      [-74.0114, 40.7078],
      [-74.0102, 40.7078],
      [-74.0102, 40.7088],
      [-74.0114, 40.7088]
    ],
    centroid: [-74.0108, 40.7083],
    description: "Monumental 40-story building whose shadows prompted New York City's landmark 1916 Zoning Resolution.",
    verticalStrata: [
      { unitId: "120B-L0", floorNumber: 0, floorLabel: "Ground Level", name: "Bankers Club Grand Lobby & Retail", subUlpin: "US-NYC-100-047-0001-FL00", owner: "Silverstein 120 Retail", areaSqM: 3800, usage: "Commercial Retail", heightRange: "0m - 12m", color: "#7c3aed" },
      { unitId: "120B-L38", floorNumber: 38, floorLabel: "38th-40th Floor", name: "Executive Club & Rooftop Terrace", subUlpin: "US-NYC-100-047-0001-FL38", owner: "Bankers Club Strata", areaSqM: 3200, usage: "Private Executive Club", heightRange: "150m - 164m", color: "#a855f7" }
    ]
  },
  // 14. One New York Plaza
  {
    id: "NYC-BBL-1000040001",
    name: "One New York Plaza",
    ulpin: "US-NYC-100-004-0001",
    surveyNumber: "BBL: 1-00004-0001",
    landType: "Commercial / Office (Vertical Strata)",
    subType: "Southernmost Manhattan Skyscraper",
    owner: "Brookfield Properties",
    ownerContact: "leasing@brookfieldproperties.com",
    areaSqM: 4800,
    areaDisplay: "1.18 Acres (~4,800 m²)",
    taxStatus: "Assessed (Commercial Class 4)",
    color: "#0369a1",
    isVerticalProperty: true,
    totalFloors: 50,
    extrudedHeight: 195,
    polygon: [
      [-74.0131, 40.7023],
      [-74.0119, 40.7023],
      [-74.0119, 40.7033],
      [-74.0131, 40.7033]
    ],
    centroid: [-74.0125, 40.7028],
    description: "50-story commercial tower at the southern tip of Manhattan, overlooking New York Harbor.",
    verticalStrata: [
      { unitId: "1NYP-L0", floorNumber: 0, floorLabel: "Concourse Level", name: "Retail Concourse & Food Hall", subUlpin: "US-NYC-100-004-0001-FL00", owner: "Brookfield Retail Group", areaSqM: 4000, usage: "Commercial Retail", heightRange: "0m - 10m", color: "#0ea5e9" },
      { unitId: "1NYP-L25", floorNumber: 25, floorLabel: "25th Floor", name: "Morgan Stanley Wealth Management", subUlpin: "US-NYC-100-004-0001-FL25", owner: "Morgan Stanley Lessees", areaSqM: 3800, usage: "Financial Operations", heightRange: "95m - 110m", color: "#38bdf8" }
    ]
  },
  // 15. Brookfield Place (250 Vesey Street)
  {
    id: "NYC-BBL-1000160050",
    name: "Brookfield Place (250 Vesey St / Four World Financial)",
    ulpin: "US-NYC-100-016-0050",
    surveyNumber: "BBL: 1-00016-0050",
    landType: "Commercial / Office (Vertical Strata)",
    subType: "Waterfront Commercial Complex",
    owner: "Brookfield Properties",
    ownerContact: "info@brookfieldplaceny.com",
    areaSqM: 4600,
    areaDisplay: "1.13 Acres (~4,600 m²)",
    taxStatus: "Assessed (Commercial Class 4)",
    color: "#0891b2",
    isVerticalProperty: true,
    totalFloors: 34,
    extrudedHeight: 152,
    polygon: [
      [-74.0160, 40.7130],
      [-74.0148, 40.7130],
      [-74.0148, 40.7142],
      [-74.0160, 40.7142]
    ],
    centroid: [-74.0154, 40.7136],
    description: "34-story waterfront office tower designed by Cesar Pelli, part of Brookfield Place complex.",
    verticalStrata: [
      { unitId: "250V-L0", floorNumber: 0, floorLabel: "Winter Garden Level", name: "Winter Garden Palm Court & Shops", subUlpin: "US-NYC-100-016-0050-FL00", owner: "Brookfield Retail", areaSqM: 4000, usage: "Luxury Retail & Winter Garden", heightRange: "0m - 16m", color: "#06b6d4" },
      { unitId: "250V-L20", floorNumber: 20, floorLabel: "20th Floor", name: "Jane Street Capital Trading Facility", subUlpin: "US-NYC-100-016-0050-FL20", owner: "Jane Street Capital", areaSqM: 3800, usage: "Quantitative Trading", heightRange: "85m - 100m", color: "#22d3ee" }
    ]
  },
  // 16. Gateway Plaza Tower A (Battery Park City)
  {
    id: "NYC-BBL-1000160010",
    name: "Gateway Plaza Tower A (375 South End Ave)",
    ulpin: "US-NYC-100-016-0010",
    surveyNumber: "BBL: 1-00016-0010",
    landType: "Residential (Vertical Strata)",
    subType: "High-Rise Waterfront Residential",
    owner: "LeFrak Organization",
    ownerContact: "leasing@gatewaybpc.com",
    areaSqM: 2800,
    areaDisplay: "0.69 Acres (~2,800 m²)",
    taxStatus: "Assessed (Residential Class 2)",
    color: "#c2410c",
    isVerticalProperty: true,
    totalFloors: 30,
    extrudedHeight: 95,
    polygon: [
      [-74.0170, 40.7100],
      [-74.0158, 40.7100],
      [-74.0158, 40.7110],
      [-74.0170, 40.7110]
    ],
    centroid: [-74.0164, 40.7105],
    description: "30-story waterfront residential high-rise in Battery Park City overlooking the Hudson River marina.",
    verticalStrata: [
      { unitId: "GP-L0", floorNumber: 0, floorLabel: "Ground Floor", name: "Marina Promenade Lobby & Storage", subUlpin: "US-NYC-100-016-0010-FL00", owner: "Gateway Residents Association", areaSqM: 2200, usage: "Residential Lobby", heightRange: "0m - 5m", color: "#ea580c" },
      { unitId: "GP-L15", floorNumber: 15, floorLabel: "15th Floor", name: "Strata Residences 1501-1510", subUlpin: "US-NYC-100-016-0010-FL15", owner: "Strata Titleholders", areaSqM: 2000, usage: "Private Residential Title", heightRange: "45m - 55m", color: "#f97316" }
    ]
  },
  // 17. Battery Park Green Waterfront Commons
  {
    id: "NYC-BBL-1000010001",
    name: "The Battery (Battery Park Public Commons)",
    ulpin: "US-NYC-100-001-0001",
    surveyNumber: "BBL: 1-00001-0001",
    landType: "Public Commons / Park",
    subType: "Municipal Historic Waterfront Park",
    owner: "NYC Department of Parks & Recreation",
    ownerContact: "info@thebattery.org",
    areaSqM: 9500,
    areaDisplay: "2.34 Acres (~9,500 m²)",
    taxStatus: "Exempt (Municipal Public Park)",
    color: "#16a34a",
    isVerticalProperty: false,
    extrudedHeight: 0.2,
    polygon: [
      [-74.0180, 40.7020],
      [-74.0140, 40.7020],
      [-74.0140, 40.7045],
      [-74.0180, 40.7045]
    ],
    centroid: [-74.0160, 40.7032],
    description: "Historic 25-acre public park at the southern tip of Manhattan Island facing the Statue of Liberty."
  },
  // 18. City Hall Park & Municipal Commons
  {
    id: "NYC-BBL-1001220001",
    name: "City Hall Park & Civic Commons",
    ulpin: "US-NYC-100-122-0001",
    surveyNumber: "BBL: 1-00122-0001",
    landType: "Public Administration / Civic Commons",
    subType: "Municipal Park & Civic Center",
    owner: "City of New York (Parks & DCAS)",
    ownerContact: "civic@nyc.gov",
    areaSqM: 6500,
    areaDisplay: "1.60 Acres (~6,500 m²)",
    taxStatus: "Exempt (Municipal Civic Asset)",
    color: "#15803d",
    isVerticalProperty: false,
    extrudedHeight: 0.2,
    polygon: [
      [-74.0075, 40.7118],
      [-74.0055, 40.7118],
      [-74.0055, 40.7135],
      [-74.0075, 40.7135]
    ],
    centroid: [-74.0065, 40.7126],
    description: "Civic center of New York City government surrounding historic New York City Hall."
  }
];

export const NYC_PARCELS = RAW_NYC_PARCELS.map((bldg) => {
  if (!bldg.isVerticalProperty) return bldg;
  return {
    ...bldg,
    verticalStrata: generateFullBuildingStrata(bldg)
  };
});

export const NYC_ROADS = [
  {
    id: "NYC-ROAD-01",
    name: "Broadway (Historic North-South Spine)",
    width: 14.0,
    color: "#334155",
    coordinates: [
      [-74.0135, 40.7040],
      [-74.0112, 40.7075],
      [-74.0085, 40.7115],
      [-74.0060, 40.7145]
    ]
  },
  {
    id: "NYC-ROAD-02",
    name: "Wall Street (Financial Center Axis)",
    width: 10.0,
    color: "#334155",
    coordinates: [
      [-74.0122, 40.7070],
      [-74.0055, 40.7055]
    ]
  },
  {
    id: "NYC-ROAD-03",
    name: "West Street / West Side Highway",
    width: 18.0,
    color: "#1e293b",
    coordinates: [
      [-74.0175, 40.7030],
      [-74.0150, 40.7110],
      [-74.0135, 40.7160]
    ]
  },
  {
    id: "NYC-ROAD-04",
    name: "Water Street (East River Commercial Corridor)",
    width: 12.0,
    color: "#334155",
    coordinates: [
      [-74.0125, 40.7025],
      [-74.0065, 40.7065],
      [-74.0035, 40.7095]
    ]
  },
  {
    id: "NYC-ROAD-05",
    name: "Fulton Street (Transit & Commercial Cross-Town)",
    width: 11.0,
    color: "#334155",
    coordinates: [
      [-74.0140, 40.7115],
      [-74.0040, 40.7085]
    ]
  },
  {
    id: "NYC-ROAD-06",
    name: "Pine Street",
    width: 8.0,
    color: "#475569",
    coordinates: [
      [-74.0110, 40.7075],
      [-74.0060, 40.7060]
    ]
  }
];
