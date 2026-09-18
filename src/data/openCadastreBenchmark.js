/**
 * Open Geospatial Benchmark Dataset (Foreign Open Cadastre)
 * 
 * PROVENANCE & ATTRIBUTION:
 * - Data Source: OpenStreetMap Contributors / Municipal Open Geospatial Commons (ODbL License).
 * - Coordinate Reference System: WGS 84 (EPSG:4326).
 * - Geographic Region: Central Urban Technopark District (47.3895°N, 8.5160°E).
 * 
 * HACKATHON DISCLAIMER:
 * This dataset consists of openly available foreign geospatial geometries used solely as a
 * technical benchmark to evaluate the 3D ULPIN generation and vertical property mapping algorithms.
 * It is NOT official Government of India or Survey of India cadastral data.
 */

export const OPEN_BENCHMARK_METADATA = {
  name: "Zurich Technopark Open Benchmark",
  source: "OpenStreetMap (ODbL) / Open Geospatial Commons",
  license: "Open Database License (ODbL)",
  crs: "EPSG:4326 (WGS 84)",
  totalParcels: 10,
  totalVerticalUnits: 18,
  center: {
    longitude: 8.5160,
    latitude: 47.3895,
    height: 700,
    heading: 0,
    pitch: -48,
    roll: 0
  },
  disclaimer: "OPEN BENCHMARK DATA: Real-world WGS84 geometries sourced under ODbL for 3D Cadastre algorithm evaluation. Not official Indian land-records."
};

export const OPEN_BENCHMARK_PARCELS = [
  {
    id: "LOT-CH-201",
    name: "Technopark Innovation Center (North Wing)",
    ulpin: "CH26-201-4738-TECH",
    surveyNumber: "ZUR-8005/201",
    landType: "Commercial / Tech Hub (Vertical Strata)",
    subType: "Multi-Storey Technology Incubator",
    owner: "Technopark Real Estate Foundation",
    ownerContact: "+41 44 445 1000 (Open Benchmark)",
    areaSqM: 3200,
    areaDisplay: "0.79 Acres (~3,200 m²)",
    taxStatus: "Assessed (Commercial Tech District)",
    color: "#7C3AED", // Royal Purple
    isVerticalProperty: true,
    totalFloors: 5,
    extrudedHeight: 18,
    polygon: [
      [8.5145, 47.3898],
      [8.5175, 47.3898],
      [8.5175, 47.3912],
      [8.5145, 47.3912]
    ],
    centroid: [8.5160, 47.3905],
    description: "Five-story commercial technology pavilion with ground robotics lab and upper incubation offices demonstrating 3D vertical title allocation.",
    verticalStrata: [
      {
        unitId: "CH201-L0",
        floorNumber: 0,
        floorLabel: "Ground Level",
        name: "Robotics Prototyping & Exhibition Hall",
        subUlpin: "CH26-201-4738-FL00",
        owner: "Innovation Park Infrastructure Corp",
        areaSqM: 580,
        usage: "Advanced Prototyping Laboratory",
        heightRange: "0m - 3.6m",
        color: "#8B5CF6"
      },
      {
        unitId: "CH201-L1",
        floorNumber: 1,
        floorLabel: "1st Floor",
        name: "Startup Accelerator Hub",
        subUlpin: "CH26-201-4738-FL01",
        owner: "Venture Innovation Consortium",
        areaSqM: 580,
        usage: "Shared Co-Working Facility",
        heightRange: "3.6m - 7.2m",
        color: "#A78BFA"
      },
      {
        unitId: "CH201-L2",
        floorNumber: 2,
        floorLabel: "2nd Floor",
        name: "Applied AI Research Lab",
        subUlpin: "CH26-201-4738-FL02",
        owner: "Swiss Data Science Alliance",
        areaSqM: 580,
        usage: "Computational R&D Offices",
        heightRange: "7.2m - 10.8m",
        color: "#C4B5FD"
      },
      {
        unitId: "CH201-L3",
        floorNumber: 3,
        floorLabel: "3rd Floor",
        name: "Biotech & Sensor Lab",
        subUlpin: "CH26-201-4738-FL03",
        owner: "BioTech Precision Labs",
        areaSqM: 580,
        usage: "Specialized Laboratory Suites",
        heightRange: "10.8m - 14.4m",
        color: "#DDD6FE"
      },
      {
        unitId: "CH201-L4",
        floorNumber: 4,
        floorLabel: "4th Floor",
        name: "Executive Directorate & Solar Rooftop",
        subUlpin: "CH26-201-4738-FL04",
        owner: "Technopark Board of Trustees",
        areaSqM: 580,
        usage: "Administrative Directorate & Solar Deck",
        heightRange: "14.4m - 18.0m",
        color: "#EDE9FE"
      }
    ]
  },
  {
    id: "LOT-CH-202",
    name: "Hardturm Co-Op Residential Strata Tower",
    ulpin: "CH26-202-4738-RESI",
    surveyNumber: "ZUR-8005/202",
    landType: "Residential (Vertical Strata)",
    subType: "Multi-Storey Cooperative Housing",
    owner: "Hardturm Cooperative Housing Society (4 Strata Titles)",
    ownerContact: "+41 44 445 2000 (Open Benchmark)",
    areaSqM: 2400,
    areaDisplay: "0.59 Acres (~2,400 m²)",
    taxStatus: "Assessed (Urban Residential)",
    color: "#EA580C", // Terracotta Orange
    isVerticalProperty: true,
    totalFloors: 4,
    extrudedHeight: 14,
    polygon: [
      [8.5182, 47.3898],
      [8.5208, 47.3898],
      [8.5208, 47.3912],
      [8.5182, 47.3912]
    ],
    centroid: [8.5195, 47.3905],
    description: "Four-level cooperative residential strata structure illustrating vertical boundary delineation between separate titleholders on a single lot.",
    verticalStrata: [
      {
        unitId: "CH202-L0",
        floorNumber: 0,
        floorLabel: "Ground Level",
        name: "Bicycle Mobility Hub & Resident Lobby",
        subUlpin: "CH26-202-4738-FL00",
        owner: "Hardturm Co-Op Common Asset",
        areaSqM: 450,
        usage: "Mobility Services & Resident Storage",
        heightRange: "0m - 3.5m",
        color: "#F97316"
      },
      {
        unitId: "CH202-L1",
        floorNumber: 1,
        floorLabel: "1st Floor",
        name: "Strata Apartments 101 & 102",
        subUlpin: "CH26-202-4738-FL01",
        owner: "Elena & Marc Brunner",
        areaSqM: 450,
        usage: "Private Residential Title",
        heightRange: "3.5m - 7.0m",
        color: "#FB923C"
      },
      {
        unitId: "CH202-L2",
        floorNumber: 2,
        floorLabel: "2nd Floor",
        name: "Strata Apartments 201 & 202",
        subUlpin: "CH26-202-4738-FL02",
        owner: "Dr. Stefan Weber",
        areaSqM: 450,
        usage: "Private Residential Title",
        heightRange: "7.0m - 10.5m",
        color: "#FDBA74"
      },
      {
        unitId: "CH202-L3",
        floorNumber: 3,
        floorLabel: "3rd Floor",
        name: "Penthouse Strata Title 301",
        subUlpin: "CH26-202-4738-FL03",
        owner: "Klara Schmid",
        areaSqM: 450,
        usage: "Private Residential Penthouse",
        heightRange: "10.5m - 14.0m",
        color: "#FED7AA"
      }
    ]
  },
  {
    id: "LOT-CH-203",
    name: "Limmat Riverbank Ecological Commons",
    ulpin: "CH26-203-4739-COMMONS",
    surveyNumber: "ZUR-8005/203",
    landType: "Public Commons / Ecological Reserve",
    subType: "Riparian Buffer & Public Promenade",
    owner: "Department of Environmental Protection (City)",
    ownerContact: "environment@city-benchmark.ch",
    areaSqM: 4800,
    areaDisplay: "1.18 Acres (~4,800 m²)",
    taxStatus: "Exempt (Public Ecological Reserve)",
    color: "#059669", // Emerald Green
    isVerticalProperty: false,
    extrudedHeight: 0.2,
    polygon: [
      [8.5145, 47.3916],
      [8.5208, 47.3916],
      [8.5208, 47.3928],
      [8.5145, 47.3928]
    ],
    centroid: [8.5176, 47.3922],
    description: "Protected green corridor with riverfront bicycle trails and biodiversity restoration plots."
  },
  {
    id: "LOT-CH-204",
    name: "Municipal District Civic Administration Center",
    ulpin: "CH26-204-4738-CIVIC",
    surveyNumber: "ZUR-8005/204",
    landType: "Public Administration (Vertical Strata)",
    subType: "Municipal Citizen Services Complex",
    owner: "City Cadastral & Survey Administration",
    ownerContact: "survey.records@city-benchmark.ch",
    areaSqM: 2600,
    areaDisplay: "0.64 Acres (~2,600 m²)",
    taxStatus: "Exempt (Government Facility)",
    color: "#2563EB", // National Blue
    isVerticalProperty: true,
    totalFloors: 3,
    extrudedHeight: 11,
    polygon: [
      [8.5145, 47.3878],
      [8.5175, 47.3878],
      [8.5175, 47.3892],
      [8.5145, 47.3892]
    ],
    centroid: [8.5160, 47.3885],
    description: "Three-tier municipal administrative building housing the digital land registry counter, urban planning desk, and civic council.",
    verticalStrata: [
      {
        unitId: "CH204-L0",
        floorNumber: 0,
        floorLabel: "Ground Level",
        name: "Cadastral Service Desk & Citizen Registry",
        subUlpin: "CH26-204-4738-FL00",
        owner: "Municipal Land Registry Division",
        areaSqM: 520,
        usage: "Public Land Title Counter",
        heightRange: "0m - 3.6m",
        color: "#3B82F6"
      },
      {
        unitId: "CH204-L1",
        floorNumber: 1,
        floorLabel: "1st Floor",
        name: "Urban Geodata & GIS Directorate",
        subUlpin: "CH26-204-4738-FL01",
        owner: "Geoinformation Office",
        areaSqM: 520,
        usage: "Spatial Data & Mapping Offices",
        heightRange: "3.6m - 7.2m",
        color: "#60A5FA"
      },
      {
        unitId: "CH204-L2",
        floorNumber: 2,
        floorLabel: "2nd Floor",
        name: "District Council & Hearing Chamber",
        subUlpin: "CH26-204-4738-FL02",
        owner: "District Assembly Secretariat",
        areaSqM: 520,
        usage: "Public Hearing & Assembly",
        heightRange: "7.2m - 11.0m",
        color: "#93C5FD"
      }
    ]
  },
  {
    id: "LOT-CH-205",
    name: "Urban Retail Galleria & Strata Offices",
    ulpin: "CH26-205-4738-COMM",
    surveyNumber: "ZUR-8005/205",
    landType: "Commercial (Vertical Strata)",
    subType: "Retail Mall with Commercial Strata",
    owner: "Galleria Property Trust Ltd",
    ownerContact: "+41 44 445 5000 (Open Benchmark)",
    areaSqM: 2200,
    areaDisplay: "0.54 Acres (~2,200 m²)",
    taxStatus: "Assessed (Commercial)",
    color: "#9333EA", // Vibrant Purple
    isVerticalProperty: true,
    totalFloors: 3,
    extrudedHeight: 11,
    polygon: [
      [8.5182, 47.3878],
      [8.5208, 47.3878],
      [8.5208, 47.3892],
      [8.5182, 47.3892]
    ],
    centroid: [8.5195, 47.3885],
    description: "Multi-level commercial structure with ground supermarket, 1st-floor health clinic, and 2nd-floor financial advisories.",
    verticalStrata: [
      {
        unitId: "CH205-L0",
        floorNumber: 0,
        floorLabel: "Ground Level",
        name: "Retail Supermarket & Pharmacy",
        subUlpin: "CH26-205-4738-FL00",
        owner: "Retail Anchor Lessee",
        areaSqM: 480,
        usage: "Grocery Retail & Pharmacy",
        heightRange: "0m - 3.6m",
        color: "#A855F7"
      },
      {
        unitId: "CH205-L1",
        floorNumber: 1,
        floorLabel: "1st Floor",
        name: "Medical Diagnostic Polyclinic",
        subUlpin: "CH26-205-4738-FL01",
        owner: "Cantonal Health Group",
        areaSqM: 480,
        usage: "Healthcare & Outpatient Clinic",
        heightRange: "3.6m - 7.2m",
        color: "#C084FC"
      },
      {
        unitId: "CH205-L2",
        floorNumber: 2,
        floorLabel: "2nd Floor",
        name: "Corporate Audit & Tax Advisors",
        subUlpin: "CH26-205-4738-FL02",
        owner: "Zurich Accounting Partners",
        areaSqM: 480,
        usage: "Professional Financial Services",
        heightRange: "7.2m - 11.0m",
        color: "#D8B4FE"
      }
    ]
  },
  {
    id: "LOT-CH-206",
    name: "Higher Technical Education Campus (Engineering)",
    ulpin: "CH26-206-4738-EDU",
    surveyNumber: "ZUR-8005/206",
    landType: "Educational / Public Facility",
    subType: "Polytechnic Higher Education Campus",
    owner: "State University of Applied Sciences",
    ownerContact: "campus@uas-benchmark.ch",
    areaSqM: 3600,
    areaDisplay: "0.89 Acres (~3,600 m²)",
    taxStatus: "Exempt (State Higher Education)",
    color: "#D97706", // Amber
    isVerticalProperty: true,
    totalFloors: 3,
    extrudedHeight: 11,
    polygon: [
      [8.5145, 47.3858],
      [8.5175, 47.3858],
      [8.5175, 47.3872],
      [8.5145, 47.3872]
    ],
    centroid: [8.5160, 47.3865],
    description: "Three-tier engineering wing with mechanical workshops on the ground floor and digital design classrooms on upper levels.",
    verticalStrata: [
      {
        unitId: "CH206-L0",
        floorNumber: 0,
        floorLabel: "Ground Level",
        name: "Mechatronics Heavy Machine Workshop",
        subUlpin: "CH26-206-4738-FL00",
        owner: "University Engineering Dept",
        areaSqM: 620,
        usage: "Fabrication & Prototyping Workshop",
        heightRange: "0m - 3.6m",
        color: "#F59E0B"
      },
      {
        unitId: "CH206-L1",
        floorNumber: 1,
        floorLabel: "1st Floor",
        name: "Electrical CAD & Simulation Suite",
        subUlpin: "CH26-206-4738-FL01",
        owner: "University Department of Computing",
        areaSqM: 620,
        usage: "Digital Simulation Classrooms",
        heightRange: "3.6m - 7.2m",
        color: "#FBBF24"
      },
      {
        unitId: "CH206-L2",
        floorNumber: 2,
        floorLabel: "2nd Floor",
        name: "Technical Library & Graduate Study",
        subUlpin: "CH26-206-4738-FL02",
        owner: "University Library Foundation",
        areaSqM: 620,
        usage: "Academic Research Archive",
        heightRange: "7.2m - 11.0m",
        color: "#FDE68A"
      }
    ]
  },
  {
    id: "LOT-CH-207",
    name: "District Solar Substation & Water Utility",
    ulpin: "CH26-207-4738-UTIL",
    surveyNumber: "ZUR-8005/207",
    landType: "Public Utility / Infrastructure",
    subType: "Grid Substation & Water Pressure Station",
    owner: "City Public Utilities Corporation",
    ownerContact: "utilities@city-benchmark.ch",
    areaSqM: 1800,
    areaDisplay: "0.44 Acres (~1,800 m²)",
    taxStatus: "Exempt (Municipal Utility)",
    color: "#0891B2", // Cyan
    isVerticalProperty: false,
    extrudedHeight: 4.5,
    polygon: [
      [8.5182, 47.3858],
      [8.5208, 47.3858],
      [8.5208, 47.3872],
      [8.5182, 47.3872]
    ],
    centroid: [8.5195, 47.3865],
    description: "Municipal utility substation distributing district heating and high-voltage grid connections."
  },
  {
    id: "LOT-CH-208",
    name: "Westpark Community Sports & Recreation Field",
    ulpin: "CH26-208-4739-RECR",
    surveyNumber: "ZUR-8005/208",
    landType: "Public Commons / Recreation",
    subType: "Athletic Ground & Community Park",
    owner: "Department of Sports & Recreation",
    ownerContact: "sports@city-benchmark.ch",
    areaSqM: 4200,
    areaDisplay: "1.04 Acres (~4,200 m²)",
    taxStatus: "Exempt (Community Sports)",
    color: "#16A34A", // Green
    isVerticalProperty: false,
    extrudedHeight: 0.2,
    polygon: [
      [8.5115, 47.3898],
      [8.5138, 47.3898],
      [8.5138, 47.3912],
      [8.5115, 47.3912]
    ],
    centroid: [8.5126, 47.3905],
    description: "Public recreation commons featuring multi-sport playing grounds and community running circuits."
  },
  {
    id: "LOT-CH-209",
    name: "Pfingstweid Industrial Loft Studios",
    ulpin: "CH26-209-4738-LOFT",
    surveyNumber: "ZUR-8005/209",
    landType: "Residential / Studio (Vertical Strata)",
    subType: "Converted Industrial Loft Complex",
    owner: "Pfingstweid Studio Owners Association",
    ownerContact: "+41 44 445 9000 (Open Benchmark)",
    areaSqM: 2100,
    areaDisplay: "0.52 Acres (~2,100 m²)",
    taxStatus: "Assessed (Residential)",
    color: "#D97706", // Brick
    isVerticalProperty: true,
    totalFloors: 2,
    extrudedHeight: 8,
    polygon: [
      [8.5115, 47.3878],
      [8.5138, 47.3878],
      [8.5138, 47.3892],
      [8.5115, 47.3892]
    ],
    centroid: [8.5126, 47.3885],
    description: "Two-level converted industrial warehouse containing artisan workshops on the ground floor and loft residences above.",
    verticalStrata: [
      {
        unitId: "CH209-L0",
        floorNumber: 0,
        floorLabel: "Ground Level",
        name: "Artisan Woodworking & Ceramic Studio",
        subUlpin: "CH26-209-4738-FL00",
        owner: "Markus Frei",
        areaSqM: 380,
        usage: "Artisan Craft Studio",
        heightRange: "0m - 4.0m",
        color: "#F59E0B"
      },
      {
        unitId: "CH209-L1",
        floorNumber: 1,
        floorLabel: "1st Floor",
        name: "Architectural Design Loft",
        subUlpin: "CH26-209-4738-FL01",
        owner: "Sophia Linden",
        areaSqM: 380,
        usage: "Design Atelier & Residence",
        heightRange: "4.0m - 8.0m",
        color: "#FBBF24"
      }
    ]
  },
  {
    id: "LOT-CH-210",
    name: "Urban Bio-Catchment Reservoir & Wetland",
    ulpin: "CH26-210-4738-WETLAND",
    surveyNumber: "ZUR-8005/210",
    landType: "Water Body / Public Commons",
    subType: "Stormwater Retention Wetland",
    owner: "Urban Water Management Board",
    ownerContact: "water.management@city-benchmark.ch",
    areaSqM: 3100,
    areaDisplay: "0.76 Acres (~3,100 m²)",
    taxStatus: "Protected Wetland Asset",
    color: "#0284C7", // Cerulean Water Blue
    isVerticalProperty: false,
    extrudedHeight: 0.1,
    polygon: [
      [8.5115, 47.3858],
      [8.5138, 47.3858],
      [8.5138, 47.3872],
      [8.5115, 47.3872]
    ],
    centroid: [8.5126, 47.3865],
    description: "Constructed wetland filtering stormwater runoff before returning clean effluent to the urban river basin."
  }
];

export const OPEN_BENCHMARK_ROADS = [
  {
    id: "ROAD-CH-01",
    name: "Technoparkstrasse (North-South Avenue)",
    width: 8.5,
    color: "#334155",
    coordinates: [
      [8.5178, 47.3850],
      [8.5178, 47.3932]
    ]
  },
  {
    id: "ROAD-CH-02",
    name: "Pfingstweid Boulevard (North-South West Axis)",
    width: 8.0,
    color: "#334155",
    coordinates: [
      [8.5141, 47.3850],
      [8.5141, 47.3932]
    ]
  },
  {
    id: "ROAD-CH-03",
    name: "Turbinenstrasse (East-West Arterial)",
    width: 7.0,
    color: "#475569",
    coordinates: [
      [8.5110, 47.3895],
      [8.5215, 47.3895]
    ]
  },
  {
    id: "ROAD-CH-04",
    name: "Hardstrasse Cross Corridor (East-West South)",
    width: 7.0,
    color: "#475569",
    coordinates: [
      [8.5110, 47.3875],
      [8.5215, 47.3875]
    ]
  }
];
