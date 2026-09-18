/**
 * 3D ULPIN Generation and Vertical Property Mapping System
 * Smart India Hackathon (SIH) Prototype
 * 
 * DISCLAIMER:
 * All parcel boundaries, owner names, land types, and ULPIN numbers in this file
 * are 100% SYNTHETIC SAMPLE DEMONSTRATION DATA generated solely for software
 * prototyping and evaluation. They do NOT represent official Government of India records,
 * Department of Land Resources (DoLR) data, or actual cadastral surveys.
 */

export const VILLAGE_METADATA = {
  name: "Adarshgram Model Panchayat",
  district: "Demo District",
  state: "Maharashtra (Sample State)",
  pinCode: "431001",
  totalParcels: 10,
  totalVerticalUnits: 14,
  center: {
    longitude: 74.7510,
    latitude: 19.1205,
    height: 750, // Viewing camera altitude in meters
    heading: 0,
    pitch: -50,
    roll: 0
  },
  disclaimer: "SYNTHETIC DEMO DATA: Designed for SIH 2026 technical prototype evaluation. Not an official cadastral record."
};

export const SAMPLE_PARCELS = [
  {
    id: "PARCEL-101",
    name: "Plot 101 - Krishi Kshetra North (Sugarcane)",
    ulpin: "MH19-101-7475-AGRI",
    surveyNumber: "101/A",
    landType: "Agricultural",
    subType: "Cash Crop (Sugarcane)",
    owner: "Kisanrao V. Patil & Family",
    ownerContact: "+91 98765 00101 (Demo)",
    areaSqM: 5420,
    areaDisplay: "1.34 Acres (~53.6 Gunthas)",
    taxStatus: "Paid (FY 2025-26)",
    color: "#2E7D32", // Forest Green
    isVerticalProperty: false,
    extrudedHeight: 0.5,
    polygon: [
      [74.7475, 19.1215],
      [74.7505, 19.1215],
      [74.7505, 19.1245],
      [74.7475, 19.1245]
    ],
    centroid: [74.7490, 19.1230],
    description: "Fertile agricultural land with drip irrigation pipeline connection along West boundary canal."
  },
  {
    id: "PARCEL-102",
    name: "Plot 102 - Krishi Kshetra East (Wheat & Pulses)",
    ulpin: "MH19-102-7475-AGRI",
    surveyNumber: "102/B",
    landType: "Agricultural",
    subType: "Grain Cultivation",
    owner: "Sunanda Tukaram Jadhav",
    ownerContact: "+91 98765 00102 (Demo)",
    areaSqM: 4800,
    areaDisplay: "1.18 Acres (~47.4 Gunthas)",
    taxStatus: "Paid (FY 2025-26)",
    color: "#689F38", // Light Olive
    isVerticalProperty: false,
    extrudedHeight: 0.5,
    polygon: [
      [74.7515, 19.1215],
      [74.7545, 19.1215],
      [74.7545, 19.1245],
      [74.7515, 19.1245]
    ],
    centroid: [74.7530, 19.1230],
    description: "Double-cropped seasonal agricultural parcel with fertile alluvial soil."
  },
  {
    id: "PARCEL-103",
    name: "Plot 103 - Amrai Organic Mango Orchard",
    ulpin: "MH19-103-7475-HORT",
    surveyNumber: "103/C",
    landType: "Agricultural",
    subType: "Horticulture (Mango & Guava)",
    owner: "Babasaheb Thorat",
    ownerContact: "+91 98765 00103 (Demo)",
    areaSqM: 6100,
    areaDisplay: "1.50 Acres (~60 Gunthas)",
    taxStatus: "Paid (FY 2025-26)",
    color: "#1B5E20", // Deep Jungle Green
    isVerticalProperty: false,
    extrudedHeight: 0.5,
    polygon: [
      [74.7475, 19.1250],
      [74.7545, 19.1250],
      [74.7545, 19.1275],
      [74.7475, 19.1275]
    ],
    centroid: [74.7510, 19.1262],
    description: "Perennial horticultural grove registered under State Organic Farming initiative."
  },
  {
    id: "PARCEL-104",
    name: "Plot 104 - Gram Panchayat Bhavan & e-Seva Complex",
    ulpin: "MH19-104-7475-GOVT",
    surveyNumber: "104/Govt",
    landType: "Public Administration",
    subType: "Administrative & Public Services",
    owner: "Gram Panchayat Adarshgram (Govt of State)",
    ownerContact: "panchayat.demo@sih2026.gov.in",
    areaSqM: 1200,
    areaDisplay: "0.29 Acres (~11.8 Gunthas)",
    taxStatus: "Exempt (Government Public Asset)",
    color: "#1976D2", // Blue
    isVerticalProperty: true,
    totalFloors: 3,
    extrudedHeight: 11,
    polygon: [
      [74.7480, 19.1190],
      [74.7505, 19.1190],
      [74.7505, 19.1205],
      [74.7480, 19.1205]
    ],
    centroid: [74.7492, 19.1197],
    description: "Three-tier village administrative headquarters featuring vertical strata division for public citizen services.",
    verticalStrata: [
      {
        unitId: "UNIT-104-G0",
        floorNumber: 0,
        floorLabel: "Ground Level",
        name: "Common Citizen Service Center (CSC)",
        subUlpin: "MH19-104-7475-V-L0",
        owner: "Directorate of Citizen e-Services",
        areaSqM: 380,
        usage: "Aadhaar / Land Records / e-District Counter",
        heightRange: "0m - 3.5m",
        color: "#2196F3"
      },
      {
        unitId: "UNIT-104-F1",
        floorNumber: 1,
        floorLabel: "1st Floor",
        name: "Sarpanch & VDO Secretariat",
        subUlpin: "MH19-104-7475-V-L1",
        owner: "Village Development Officer & Council",
        areaSqM: 380,
        usage: "Executive Panchayat Offices",
        heightRange: "3.5m - 7.0m",
        color: "#42A5F5"
      },
      {
        unitId: "UNIT-104-F2",
        floorNumber: 2,
        floorLabel: "2nd Floor",
        name: "Digital Gram Sabha Conference Hall",
        subUlpin: "MH19-104-7475-V-L2",
        owner: "Gram Sabha Community Council",
        areaSqM: 380,
        usage: "Public Hearing & Training Hall",
        heightRange: "7.0m - 10.5m",
        color: "#64B5F6"
      }
    ]
  },
  {
    id: "PARCEL-105",
    name: "Plot 105 - Shanti Niwas Co-Op Multi-Storey Apartments",
    ulpin: "MH19-105-7475-RESI",
    surveyNumber: "105/1",
    landType: "Residential (Vertical Strata)",
    subType: "Multi-Storey Co-Operative Housing",
    owner: "Shanti Niwas Co-Op Housing Society (5 Strata Titles)",
    ownerContact: "+91 98765 00105 (Society Office)",
    areaSqM: 1600,
    areaDisplay: "0.39 Acres (~15.8 Gunthas)",
    taxStatus: "Paid (FY 2025-26)",
    color: "#E65100", // Warm Terracotta Orange
    isVerticalProperty: true,
    totalFloors: 5,
    extrudedHeight: 16,
    polygon: [
      [74.7515, 19.1190],
      [74.7538, 19.1190],
      [74.7538, 19.1205],
      [74.7515, 19.1205]
    ],
    centroid: [74.7526, 19.1197],
    description: "Ground + 4 Storey residential co-operative building demonstrating vertical property ownership and 3D sub-ULPIN allocation.",
    verticalStrata: [
      {
        unitId: "UNIT-105-G0",
        floorNumber: 0,
        floorLabel: "Ground Floor",
        name: "Commercial Retail & Covered Parking",
        subUlpin: "MH19-105-7475-V-L0",
        owner: "Anil R. Shinde",
        areaSqM: 280,
        usage: "Convenience Store & Resident Parking",
        heightRange: "0m - 3.2m",
        color: "#FF9800"
      },
      {
        unitId: "UNIT-105-F1",
        floorNumber: 1,
        floorLabel: "1st Floor",
        name: "Residential Flat 101 & 102",
        subUlpin: "MH19-105-7475-V-L1",
        owner: "Meera & Rajesh Kulkarni",
        areaSqM: 280,
        usage: "Private Residential Apartment",
        heightRange: "3.2m - 6.4m",
        color: "#FFA726"
      },
      {
        unitId: "UNIT-105-F2",
        floorNumber: 2,
        floorLabel: "2nd Floor",
        name: "Residential Flat 201 & 202",
        subUlpin: "MH19-105-7475-V-L2",
        owner: "Dr. Vikram Deshpande",
        areaSqM: 280,
        usage: "Private Residential Apartment",
        heightRange: "6.4m - 9.6m",
        color: "#FFB74D"
      },
      {
        unitId: "UNIT-105-F3",
        floorNumber: 3,
        floorLabel: "3rd Floor",
        name: "Residential Flat 301 & 302",
        subUlpin: "MH19-105-7475-V-L3",
        owner: "Prof. S. N. Gaikwad",
        areaSqM: 280,
        usage: "Private Residential Apartment",
        heightRange: "9.6m - 12.8m",
        color: "#FFCC80"
      },
      {
        unitId: "UNIT-105-F4",
        floorNumber: 4,
        floorLabel: "4th Floor",
        name: "Penthouse & Solar Terrace Title 401",
        subUlpin: "MH19-105-7475-V-L4",
        owner: "Kavita R. Joshi",
        areaSqM: 280,
        usage: "Residential Penthouse & Solar Rooftop",
        heightRange: "12.8m - 16.0m",
        color: "#FFE0B2"
      }
    ]
  },
  {
    id: "PARCEL-106",
    name: "Plot 106 - Kisan Krishi Kendra & Agri-Market",
    ulpin: "MH19-106-7475-COMM",
    surveyNumber: "106/M",
    landType: "Commercial (Vertical Strata)",
    subType: "Rural Commercial & Cold Storage",
    owner: "Farmers Producer Organization (FPO)",
    ownerContact: "+91 98765 00106 (Demo)",
    areaSqM: 1800,
    areaDisplay: "0.44 Acres (~17.8 Gunthas)",
    taxStatus: "Paid (FY 2025-26)",
    color: "#6A1B9A", // Purple
    isVerticalProperty: true,
    totalFloors: 3,
    extrudedHeight: 10,
    polygon: [
      [74.7515, 19.1172],
      [74.7542, 19.1172],
      [74.7542, 19.1186],
      [74.7515, 19.1186]
    ],
    centroid: [74.7528, 19.1179],
    description: "Modern rural agro-market with ground level seed/fertilizer distribution and upper-level micro cold storage.",
    verticalStrata: [
      {
        unitId: "UNIT-106-G0",
        floorNumber: 0,
        floorLabel: "Ground Floor",
        name: "Retail Agri-Inputs & Farm Implements",
        subUlpin: "MH19-106-7475-V-L0",
        owner: "Kisan Suvidha Kendra Ltd.",
        areaSqM: 320,
        usage: "Agricultural Supplies Retail",
        heightRange: "0m - 3.3m",
        color: "#8E24AA"
      },
      {
        unitId: "UNIT-106-F1",
        floorNumber: 1,
        floorLabel: "1st Floor",
        name: "Perishable Sorting & Cold Chamber",
        subUlpin: "MH19-106-7475-V-L1",
        owner: "Adarshgram FPO Cooperative",
        areaSqM: 320,
        usage: "Solar Cold Storage Unit",
        heightRange: "3.3m - 6.6m",
        color: "#AB47BC"
      },
      {
        unitId: "UNIT-106-F2",
        floorNumber: 2,
        floorLabel: "2nd Floor",
        name: "Rural Cooperative Credit Society",
        subUlpin: "MH19-106-7475-V-L2",
        owner: "District Central Co-Op Bank Branch",
        areaSqM: 320,
        usage: "Banking & Financial Services",
        heightRange: "6.6m - 10.0m",
        color: "#BA68C8"
      }
    ]
  },
  {
    id: "PARCEL-107",
    name: "Plot 107 - Ayushman Arogya Mandir (Health Sub-Centre)",
    ulpin: "MH19-107-7475-HLTH",
    surveyNumber: "107/PHC",
    landType: "Healthcare / Public Utility",
    subType: "Primary Health Center",
    owner: "Department of Public Health & Family Welfare",
    ownerContact: "phc.adarshgram@sih2026.gov.in",
    areaSqM: 2100,
    areaDisplay: "0.52 Acres (~20.8 Gunthas)",
    taxStatus: "Exempt (Public Healthcare)",
    color: "#00838F", // Teal
    isVerticalProperty: false,
    extrudedHeight: 5,
    polygon: [
      [74.7480, 19.1172],
      [74.7505, 19.1172],
      [74.7505, 19.1186],
      [74.7480, 19.1186]
    ],
    centroid: [74.7492, 19.1179],
    description: "Public primary healthcare facility with OPD, vaccination cold room, and 24/7 maternal delivery room."
  },
  {
    id: "PARCEL-108",
    name: "Plot 108 - Zilla Parishad Model School & Playground",
    ulpin: "MH19-108-7475-SCHL",
    surveyNumber: "108/Edu",
    landType: "Educational / Public Facility",
    subType: "Government Primary School",
    owner: "District Education Council (Zilla Parishad)",
    ownerContact: "zp.school@sih2026.gov.in",
    areaSqM: 4200,
    areaDisplay: "1.04 Acres (~41.5 Gunthas)",
    taxStatus: "Exempt (State Educational Asset)",
    color: "#D84315", // Warm Brick Red
    isVerticalProperty: true,
    totalFloors: 2,
    extrudedHeight: 8,
    polygon: [
      [74.7475, 19.1145],
      [74.7505, 19.1145],
      [74.7505, 19.1168],
      [74.7475, 19.1168]
    ],
    centroid: [74.7490, 19.1156],
    description: "Two-floor primary educational center with adjacent open athletic grounds and midday-meal dining complex.",
    verticalStrata: [
      {
        unitId: "UNIT-108-G0",
        floorNumber: 0,
        floorLabel: "Ground Level",
        name: "Primary Classrooms 1st-4th & Staff Room",
        subUlpin: "MH19-108-7475-V-L0",
        owner: "Zilla Parishad Primary Education Dept",
        areaSqM: 450,
        usage: "Classrooms & Administrative Office",
        heightRange: "0m - 4.0m",
        color: "#F4511E"
      },
      {
        unitId: "UNIT-108-F1",
        floorNumber: 1,
        floorLabel: "1st Floor",
        name: "Atal Tinkering STEM Lab & Smart Library",
        subUlpin: "MH19-108-7475-V-L1",
        owner: "National STEM Education Mission",
        areaSqM: 450,
        usage: "Digital Computer Lab & Science Center",
        heightRange: "4.0m - 8.0m",
        color: "#FF7043"
      }
    ]
  },
  {
    id: "PARCEL-109",
    name: "Plot 109 - Jal Sanrakshan Village Water Reservoir",
    ulpin: "MH19-109-7475-WATR",
    surveyNumber: "109/Water",
    landType: "Water Body / Public Commons",
    subType: "Percolation Pond & Lake",
    owner: "Minor Irrigation & Groundwater Authority",
    ownerContact: "water.authority@sih2026.gov.in",
    areaSqM: 5600,
    areaDisplay: "1.38 Acres (~55.4 Gunthas)",
    taxStatus: "Protected Natural Water Body",
    color: "#0277BD", // Vibrant Water Blue
    isVerticalProperty: false,
    extrudedHeight: 0.1,
    polygon: [
      [74.7515, 19.1145],
      [74.7545, 19.1145],
      [74.7545, 19.1168],
      [74.7515, 19.1168]
    ],
    centroid: [74.7530, 19.1156],
    description: "Community rainwater harvesting percolation tank enhancing groundwater table for neighboring farms."
  },
  {
    id: "PARCEL-110",
    name: "Plot 110 - More Gurukul Homestead & Micro-Dairy",
    ulpin: "MH19-110-7475-RESI",
    surveyNumber: "110/D",
    landType: "Mixed Residential & Dairy",
    subType: "Homestead with G+1 Residential Villa",
    owner: "Santosh G. More",
    ownerContact: "+91 98765 00110 (Demo)",
    areaSqM: 2500,
    areaDisplay: "0.62 Acres (~24.7 Gunthas)",
    taxStatus: "Paid (FY 2025-26)",
    color: "#795548", // Earth Brown
    isVerticalProperty: true,
    totalFloors: 2,
    extrudedHeight: 7,
    polygon: [
      [74.7548, 19.1190],
      [74.7570, 19.1190],
      [74.7570, 19.1215],
      [74.7548, 19.1215]
    ],
    centroid: [74.7559, 19.1202],
    description: "Two-story private residential homestead with ground dairy processing shed and residential living quarters on upper floor.",
    verticalStrata: [
      {
        unitId: "UNIT-110-G0",
        floorNumber: 0,
        floorLabel: "Ground Level",
        name: "Dairy Storage & Cattle Care Facility",
        subUlpin: "MH19-110-7475-V-L0",
        owner: "Santosh G. More",
        areaSqM: 220,
        usage: "Micro-Dairy Processing & Parking",
        heightRange: "0m - 3.5m",
        color: "#8D6E63"
      },
      {
        unitId: "UNIT-110-F1",
        floorNumber: 1,
        floorLabel: "1st Floor",
        name: "Private Family Residence",
        subUlpin: "MH19-110-7475-V-L1",
        owner: "Santosh & Anita More",
        areaSqM: 220,
        usage: "Residential Living Quarters",
        heightRange: "3.5m - 7.0m",
        color: "#A1887F"
      }
    ]
  }
];

export const VILLAGE_ROADS = [
  {
    id: "ROAD-01",
    name: "Gram Panchayat Main Spine Road (North-South)",
    width: 8.0, // meters
    color: "#37474F", // Dark Asphalt Grey
    coordinates: [
      [74.7510, 19.1135],
      [74.7510, 19.1280]
    ]
  },
  {
    id: "ROAD-02",
    name: "Krishi Marg / North Cross Road (East-West)",
    width: 6.0,
    color: "#455A64",
    coordinates: [
      [74.7470, 19.1210],
      [74.7575, 19.1210]
    ]
  },
  {
    id: "ROAD-03",
    name: "Vikas Path / Central Cross Road (East-West)",
    width: 6.0,
    color: "#455A64",
    coordinates: [
      [74.7470, 19.1170],
      [74.7575, 19.1170]
    ]
  },
  {
    id: "ROAD-04",
    name: "Shiksha & Arogya Access Loop",
    width: 5.0,
    color: "#546E7A",
    coordinates: [
      [74.7508, 19.1142],
      [74.7475, 19.1142],
      [74.7475, 19.1170]
    ]
  }
];
