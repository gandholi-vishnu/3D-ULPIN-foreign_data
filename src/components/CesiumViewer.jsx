import React, { useEffect, useRef, useState } from 'react';
import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import { getBuildingHeightColor, generateFullBuildingStrata } from '../utils/ulpinGenerator.js';
import { NYC_PARCELS, NYC_METADATA } from '../data/nycData.js';
import { SAMPLE_PARCELS, VILLAGE_ROADS, VILLAGE_METADATA } from '../data/villageData.js';

export { getBuildingHeightColor };

/**
 * Applies height-based styling to Cesium 3D Tileset (Asset 75343 & OSM Buildings)
 * Ensures 100% of buildings receive consistent height colors matching the legend.
 */
export function applyTilesetHeightStyle(tileset, isDarkMode = false) {
  if (!tileset) return;

  if (isDarkMode) {
    // Dark View mode: Luminous, high-contrast neon height colors
    tileset.style = new Cesium.Cesium3DTileStyle({
      color: {
        conditions: [
          ['${Height} >= 300 || ${cesium#estimatedHeight} >= 300 || ${HEIGHTROOF} >= 300', 'color("#ff1744", 0.98)'],
          ['${Height} >= 200 || ${cesium#estimatedHeight} >= 200 || ${HEIGHTROOF} >= 200', 'color("#ff9100", 0.98)'],
          ['${Height} >= 120 || ${cesium#estimatedHeight} >= 120 || ${HEIGHTROOF} >= 120', 'color("#ffd600", 0.98)'],
          ['${Height} >= 60 || ${cesium#estimatedHeight} >= 60 || ${HEIGHTROOF} >= 60', 'color("#00e5ff", 0.98)'],
          ['true', 'color("#2979ff", 0.92)']
        ]
      }
    });
  } else {
    // Standard Map View: Colors matching the 5-tier SIH height legend exactly
    tileset.style = new Cesium.Cesium3DTileStyle({
      color: {
        conditions: [
          ['${Height} >= 300 || ${cesium#estimatedHeight} >= 300 || ${HEIGHTROOF} >= 300', 'color("#ef4444", 0.95)'],
          ['${Height} >= 200 || ${cesium#estimatedHeight} >= 200 || ${HEIGHTROOF} >= 200', 'color("#f97316", 0.95)'],
          ['${Height} >= 120 || ${cesium#estimatedHeight} >= 120 || ${HEIGHTROOF} >= 120', 'color("#eab308", 0.95)'],
          ['${Height} >= 60 || ${cesium#estimatedHeight} >= 60 || ${HEIGHTROOF} >= 60', 'color("#06b6d4", 0.95)'],
          ['true', 'color("#3b82f6", 0.90)']
        ]
      }
    });
  }
}

/**
 * Insets a polygon slightly relative to centroid for floor strata slicing
 */
function getInsetPolygon(polygon, centroid, scale = 0.80) {
  if (!polygon || !centroid) return [];
  return polygon.map(([lon, lat]) => [
    centroid[0] + (lon - centroid[0]) * scale,
    centroid[1] + (lat - centroid[1]) * scale
  ]);
}

export default function CesiumViewer({
  parcels = NYC_PARCELS,
  roads = [],
  metadata = NYC_METADATA,
  selectedParcel,
  onSelectParcel,
  selectedUnitId,
  onSelectUnit,
  showBuildings = true,
  colorByHeight = true,
  show3DStrata = true,
  mapViewMode = 'standard', // 'standard' | 'street' | 'dark'
  customToken,
  flyToTrigger
}) {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);
  const osmTilesetRef = useRef(null);
  const darkLayerRef = useRef(null);
  const standardLayerRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);

  // Initialize Cesium Viewer
  useEffect(() => {
    if (!containerRef.current) return;

    // --- Cesium Ion Token ---
    const ION_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6Ik5HYlF5RGNZOXB4bDc1X2YiLCJqdGkiOiI2NzMyMTRjNi0wMDRhLTQ3M2EtYmJhOC0yMjU2YTg4ODI3YWQiLCJpZCI6NDk5MDY5LCJpc3MiOiJodHRwczovL2FwaS5jZXNpdW0uY29tIiwiYXVkIjoidW5kZWZpbmVkX2RlZmF1bHQiLCJpYXQiOjE3ODk2Njk2MTV9.MSL-kXcRUrxSBhqKmbWvknmVpt49jfipQmMDesWKtQU";
    Cesium.Ion.defaultAccessToken = customToken || ION_TOKEN;

    // 1. Standard Base Imagery Provider (OpenStreetMap — reliable, always visible)
    const osmProvider = new Cesium.OpenStreetMapImageryProvider({
      url: 'https://tile.openstreetmap.org/'
    });

    const standardBaseLayer = new Cesium.ImageryLayer(osmProvider);
    standardLayerRef.current = standardBaseLayer;

    // 2. Initialize Cesium Viewer
    const viewer = new Cesium.Viewer(containerRef.current, {
      animation: false,
      timeline: false,
      geocoder: false,
      homeButton: false,
      sceneModePicker: false,
      navigationHelpButton: false,
      baseLayerPicker: false,
      infoBox: false,
      selectionIndicator: false,
      shadows: false,
      baseLayer: standardBaseLayer
    });

    viewerRef.current = viewer;

    // 3. Sunlight Clock: 12:00 PM solar noon in NYC (16:00 UTC) for bright contrast
    const daylightTime = Cesium.JulianDate.fromDate(new Date('2026-09-17T16:00:00Z'));
    viewer.clock.currentTime = daylightTime;
    viewer.clock.shouldAnimate = false;

    // 4. Globe Visual Settings
    viewer.scene.globe.depthTestAgainstTerrain = false; // Prevents ground occlusion
    viewer.scene.globe.enableLighting = false;
    viewer.scene.skyBox.show = true;

    // 5. Try to add satellite imagery (Ion Asset 2) if available
    Cesium.IonImageryProvider.fromAssetId(2).then((ionProvider) => {
      viewer.imageryLayers.addImageryProvider(ionProvider);
    }).catch(() => {
      // Standard OSM layer is already active
    });

    // 6. Cesium World Terrain (Ion Asset 1)
    Cesium.CesiumTerrainProvider.fromIonAssetId(1).then((terrainProvider) => {
      viewer.terrainProvider = terrainProvider;
    }).catch((err) => {
      console.warn('Terrain notice:', err);
    });

    // 7. Load Cesium 3D Tileset (Ion Asset 75343 — New York City 3D Buildings)
    Cesium.Cesium3DTileset.fromIonAssetId(75343).then((tileset) => {
      osmTilesetRef.current = tileset;
      viewer.scene.primitives.add(tileset);

      // Apply height styling to all buildings immediately
      applyTilesetHeightStyle(tileset, false);

      // Frame the NYC skyline
      if (!selectedParcel) {
        viewer.zoomTo(tileset).catch(() => {});
      }
    }).catch((err) => {
      console.warn('Asset 75343 warning — fallback to OSM Buildings:', err);
      Cesium.createOsmBuildingsAsync().then((tileset) => {
        osmTilesetRef.current = tileset;
        viewer.scene.primitives.add(tileset);
        applyTilesetHeightStyle(tileset, false);
      }).catch(() => {});
    });

    // Initial camera position overlooking Lower Manhattan
    const center = metadata.center || NYC_METADATA.center;
    viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(
        center.longitude,
        center.latitude - 0.008,
        center.height || 1250
      ),
      orientation: {
        heading: Cesium.Math.toRadians(center.heading || 25),
        pitch: Cesium.Math.toRadians(center.pitch || -38),
        roll: 0
      }
    });

    // 8. Screen Space Event Handler (Click & Hover)
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

    // Left click handler: select building or specific floor pin
    handler.setInputAction((movement) => {
      const pickedObject = viewer.scene.pick(movement.position);

      if (Cesium.defined(pickedObject)) {
        // Case A: Picked a Clickable Floor Pin
        if (pickedObject.id?.properties?.type?.getValue() === 'floor_pin') {
          const unit = pickedObject.id.properties.unitData.getValue();
          const building = pickedObject.id.properties.parcelData.getValue();
          onSelectParcel(building);
          onSelectUnit(unit.unitId);
          return;
        }

        // Case B: Picked a 3D Strata Unit Floor Slab
        if (pickedObject.id?.properties?.type?.getValue() === 'strata_unit') {
          const unit = pickedObject.id.properties.unitData.getValue();
          const building = pickedObject.id.properties.parcelData.getValue();
          onSelectParcel(building);
          onSelectUnit(unit.unitId);
          return;
        }

        // Case C: Picked a Cesium 3D Tile feature (NYC Asset 75343)
        if (pickedObject instanceof Cesium.Cesium3DTileFeature) {
          const height = pickedObject.getProperty('Height') || pickedObject.getProperty('cesium#estimatedHeight') || 65;
          const bin = pickedObject.getProperty('BIN');
          const doittId = pickedObject.getProperty('DOITT_ID');
          const year = pickedObject.getProperty('Year');
          const ownerType = pickedObject.getProperty('Majority_Ownership_Type') || 'Urban Titleholder';
          const levels = pickedObject.getProperty('building:levels') || Math.max(2, Math.round(height / 3.8));
          const name = pickedObject.getProperty('name') || (bin ? `NYC Building (BIN ${bin})` : 'New York City 3D Building');
          const lon = pickedObject.getProperty('Longitude') || center.longitude;
          const lat = pickedObject.getProperty('Latitude') || center.latitude;

          // Check if this matches one of our indexed NYC landmark parcels (e.g. 4 WTC, 1 WTC, etc.)
          const matchedLandmark = (parcels || []).find((p) => {
            if (bin && p.surveyNumber?.includes(String(bin))) return true;
            if (p.centroid) {
              const dLon = Math.abs(p.centroid[0] - lon);
              const dLat = Math.abs(p.centroid[1] - lat);
              return dLon < 0.0008 && dLat < 0.0008;
            }
            return false;
          });

          if (matchedLandmark) {
            onSelectParcel(matchedLandmark);
            onSelectUnit(null);
            return;
          }

          // Otherwise generate a full dynamic building model with ALL floors
          const dynamicUlpin = bin ? `US-NYC-BIN-${bin}` : `US-NYC-3D-${Math.abs(Math.round(height * 10))}`;
          const rawDynamic = {
            id: bin ? `NYC-BIN-${bin}` : `3D-BLDG-${Math.round(height * 10)}`,
            name: name,
            ulpin: dynamicUlpin,
            surveyNumber: bin ? `NYC DoB BIN: ${bin}${doittId ? ` (DoITT: ${doittId})` : ''}` : `Surveyed Height: ${Math.round(height)}m`,
            landType: `Commercial / Urban Property (${ownerType})`,
            subType: year ? `Constructed in ${year} (${Math.round(height)}m Elevation)` : `3D Building (${Math.round(height)}m Elevation)`,
            owner: `Majority Ownership: ${ownerType}`,
            ownerContact: 'NYC Department of Buildings Registry',
            areaSqM: Math.round(levels * 280),
            areaDisplay: `~${Math.round(levels * 280)} m² Estimated Floor Space`,
            taxStatus: 'NYC Municipal Property Registry',
            color: getBuildingHeightColor(height),
            isVerticalProperty: levels > 1,
            totalFloors: levels,
            extrudedHeight: Math.round(height),
            centroid: [lon, lat],
            description: `Authentic NYC 3D Building (Cesium Ion Asset 75343 / NYC DoITT). Surveyed Height: ${Math.round(height)}m.${year ? ` Built ${year}.` : ''} Owner Category: ${ownerType}.`
          };

          const dynamicParcel = {
            ...rawDynamic,
            verticalStrata: generateFullBuildingStrata(rawDynamic)
          };

          onSelectParcel(dynamicParcel);
          onSelectUnit(null);
          return;
        }
      }

      // Clicked on empty terrain/sky — do not deselect if interacting with controls
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    // Mouse move handler: hover tooltip & cursor change
    handler.setInputAction((movement) => {
      const pickedObject = viewer.scene.pick(movement.endPosition);

      if (Cesium.defined(pickedObject)) {
        // Hover over floor pin
        if (pickedObject.id?.properties?.type?.getValue() === 'floor_pin') {
          const unit = pickedObject.id.properties.unitData.getValue();
          const building = pickedObject.id.properties.parcelData.getValue();
          containerRef.current.style.cursor = 'pointer';
          setTooltip({
            x: movement.endPosition.x,
            y: movement.endPosition.y,
            parcel: building,
            unit: unit
          });
          return;
        }

        // Hover over strata unit
        if (pickedObject.id?.properties?.type?.getValue() === 'strata_unit') {
          const unit = pickedObject.id.properties.unitData.getValue();
          const building = pickedObject.id.properties.parcelData.getValue();
          containerRef.current.style.cursor = 'pointer';
          setTooltip({
            x: movement.endPosition.x,
            y: movement.endPosition.y,
            parcel: building,
            unit: unit
          });
          return;
        }

        // Hover over 3D Tile building
        if (pickedObject instanceof Cesium.Cesium3DTileFeature) {
          const height = pickedObject.getProperty('Height') || pickedObject.getProperty('cesium#estimatedHeight') || 45;
          const bin = pickedObject.getProperty('BIN');
          const year = pickedObject.getProperty('Year');
          const ownerType = pickedObject.getProperty('Majority_Ownership_Type');
          containerRef.current.style.cursor = 'pointer';
          setTooltip({
            x: movement.endPosition.x,
            y: movement.endPosition.y,
            parcel: {
              id: bin ? `NYC BIN: ${bin}` : 'NYC 3D Building',
              surveyNumber: `${Math.round(height)}m Elevation${year ? ` • Built ${year}` : ''}`,
              name: ownerType ? `Owner: ${ownerType}` : (pickedObject.getProperty('name') || 'NYC 3D Building (DoITT)'),
              ulpin: bin ? `Prototype ULPIN: US-NYC-BIN-${bin}` : `Prototype ULPIN (${Math.round(height)}m)`
            }
          });
          return;
        }
      }

      containerRef.current.style.cursor = 'default';
      setTooltip(null);
    }, Cesium.ScreenSpaceEventType.MOUSE_MOVE);

    return () => {
      handler.destroy();
      if (!viewer.isDestroyed()) {
        viewer.destroy();
      }
      viewerRef.current = null;
    };
  }, [customToken]);

  // Handle Three Map View Modes (Standard Map | Street View | Dark View)
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    const tileset = osmTilesetRef.current;
    const isDark = mapViewMode === 'dark';
    const isStreet = mapViewMode === 'street';

    // 1. Dark View Basemap & Skybox
    if (isDark) {
      viewer.scene.globe.baseColor = Cesium.Color.fromCssColorString('#0a0f1d');
      viewer.scene.backgroundColor = Cesium.Color.fromCssColorString('#070b14');

      // Add CartoDB Dark Matter imagery if not already added
      if (!darkLayerRef.current) {
        try {
          const darkProvider = new Cesium.UrlTemplateImageryProvider({
            url: 'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
            maximumLevel: 19,
            credit: '© CartoDB Dark Matter'
          });
          darkLayerRef.current = viewer.imageryLayers.addImageryProvider(darkProvider);
        } catch (e) {
          console.warn('Dark basemap notice:', e);
        }
      } else {
        darkLayerRef.current.show = true;
      }

      // Reapply neon height styling
      if (tileset) {
        applyTilesetHeightStyle(tileset, true);
      }
    } else {
      // Standard or Street view
      if (darkLayerRef.current) {
        darkLayerRef.current.show = false;
      }
      viewer.scene.globe.baseColor = Cesium.Color.fromCssColorString('#1e293b');
      if (tileset && colorByHeight) {
        applyTilesetHeightStyle(tileset, false);
      }
    }

    // 2. Street-Level 3D View Camera Position
    if (isStreet) {
      // Position camera at pedestrian eye-level along Greenwich St / WTC Plaza
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(-74.0118, 40.7095, 3.5),
        orientation: {
          heading: Cesium.Math.toRadians(20),
          pitch: Cesium.Math.toRadians(14), // Looking slightly upwards between skyscrapers
          roll: 0
        },
        duration: 1.6
      });
    }
  }, [mapViewMode, colorByHeight]);

  // Handle Height-Based Coloring Toggle
  useEffect(() => {
    const tileset = osmTilesetRef.current;
    if (!tileset) return;

    const isNyc = metadata?.name?.includes('New York') || metadata?.name?.includes('Foreign City');
    tileset.show = isNyc && showBuildings;

    if (!isNyc) return;

    if (colorByHeight) {
      applyTilesetHeightStyle(tileset, mapViewMode === 'dark');
    } else {
      tileset.style = new Cesium.Cesium3DTileStyle({
        color: 'color("#f8fafc", 0.92)'
      });
    }
  }, [colorByHeight, showBuildings, metadata, mapViewMode]);

  // RENDER 3D ENTITIES (Roads, Floor Strata Slices, Clickable Floor Pins)
  // Note: Old colored demo parcel polygons on the ground have been REMOVED.
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    viewer.entities.removeAll();

    // 1. Draw Roads & Centerlines
    (roads || []).forEach((road) => {
      const positions = Cesium.Cartesian3.fromDegreesArray(road.coordinates.flat());

      viewer.entities.add({
        id: `road-${road.id}`,
        name: road.name,
        corridor: {
          positions: positions,
          width: road.width || 8.0,
          material: Cesium.Color.fromCssColorString(road.color || '#334155').withAlpha(0.95),
          cornerType: Cesium.CornerType.MITERED,
          outline: true,
          outlineColor: Cesium.Color.fromCssColorString('#ffffff').withAlpha(0.3),
          outlineWidth: 1
        }
      });

      viewer.entities.add({
        id: `road-line-${road.id}`,
        polyline: {
          positions: positions,
          width: 2,
          material: new Cesium.PolylineDashMaterialProperty({
            color: Cesium.Color.fromCssColorString('#facc15').withAlpha(0.85),
            dashLength: 14
          })
        }
      });
    });

    // 2. Render Vertical Floor Strata & CLICKABLE FLOOR PINS for the Selected Building
    // (Requirement 3, 4, 5: Every supported floor has its own separate pin at its exact elevation!)
    if (selectedParcel && show3DStrata && selectedParcel.isVerticalProperty) {
      const strataList = selectedParcel.verticalStrata || generateFullBuildingStrata(selectedParcel);
      const totalFloors = selectedParcel.totalFloors || strataList.length || 1;
      const bldgHeight = selectedParcel.extrudedHeight || (totalFloors * 3.8);
      const floorHeight = bldgHeight / totalFloors;

      // Base footprint for strata slabs
      let buildingPolygon = selectedParcel.polygon;
      if (!buildingPolygon && selectedParcel.centroid) {
        const cLon = selectedParcel.centroid[0];
        const cLat = selectedParcel.centroid[1];
        const d = 0.00035;
        buildingPolygon = [
          [cLon - d, cLat - d],
          [cLon + d, cLat - d],
          [cLon + d, cLat + d],
          [cLon - d, cLat + d]
        ];
      }
      const insetPolygon = getInsetPolygon(buildingPolygon, selectedParcel.centroid, 0.85);
      const slabPositions = Cesium.Cartesian3.fromDegreesArray(insetPolygon.flat());

      // Loop through EVERY floor of the building
      strataList.forEach((unit) => {
        const isFloorSelected = selectedUnitId === unit.unitId || selectedUnitId === unit.subUlpin;
        const floorIndex = unit.floorNumber;
        const floorBase = floorIndex * floorHeight + 0.2;
        const floorTop = (floorIndex + 1) * floorHeight;
        const floorElevation = (floorBase + floorTop) / 2;

        // A. 3D Strata Volume Slab (Highlighted distinctly when floor is selected)
        let slabMaterial;
        let slabOutlineColor;
        let slabOutlineWidth;

        if (isFloorSelected) {
          // Bright, highly distinct highlight for the selected floor (Requirement 4)
          slabMaterial = Cesium.Color.fromCssColorString('#00f2fe').withAlpha(0.95);
          slabOutlineColor = Cesium.Color.fromCssColorString('#ffd700');
          slabOutlineWidth = 3;
        } else {
          // Translucent strata volume colored by height tier
          const tierColor = getBuildingHeightColor(floorTop);
          slabMaterial = Cesium.Color.fromCssColorString(tierColor).withAlpha(0.55);
          slabOutlineColor = Cesium.Color.WHITE.withAlpha(0.4);
          slabOutlineWidth = 1;
        }

        viewer.entities.add({
          id: `strata-${selectedParcel.id}-${unit.unitId}`,
          name: `${unit.floorLabel} (${unit.subUlpin})`,
          polygon: {
            hierarchy: slabPositions,
            material: slabMaterial,
            outline: true,
            outlineColor: slabOutlineColor,
            outlineWidth: slabOutlineWidth,
            height: floorBase,
            extrudedHeight: floorTop
          },
          properties: {
            type: 'strata_unit',
            unitData: unit,
            parcelData: selectedParcel
          }
        });

        // B. CLICKABLE 3D FLOOR PIN (Requirement 4: Separate clickable pin for every floor at its elevation)
        // Position pin offset outward along the building facade so it's clearly clickable in 3D
        const pinLon = selectedParcel.centroid[0] + 0.00045;
        const pinLat = selectedParcel.centroid[1];
        const pinPos = Cesium.Cartesian3.fromDegrees(pinLon, pinLat, floorElevation);

        // Horizontal connecting line from building floor to pin
        viewer.entities.add({
          id: `pin-line-${unit.unitId}`,
          polyline: {
            positions: [
              Cesium.Cartesian3.fromDegrees(selectedParcel.centroid[0], selectedParcel.centroid[1], floorElevation),
              pinPos
            ],
            width: isFloorSelected ? 2.5 : 1,
            material: isFloorSelected
              ? Cesium.Color.fromCssColorString('#ffd700').withAlpha(0.95)
              : Cesium.Color.fromCssColorString('#38bdf8').withAlpha(0.4)
          }
        });

        // Floor Pin Marker Entity
        viewer.entities.add({
          id: `pin-${unit.unitId}`,
          name: `Floor Pin ${unit.floorLabel}`,
          position: pinPos,
          point: {
            pixelSize: isFloorSelected ? 15 : 9,
            color: isFloorSelected
              ? Cesium.Color.fromCssColorString('#ffd700')
              : Cesium.Color.fromCssColorString('#06b6d4'),
            outlineColor: isFloorSelected ? Cesium.Color.WHITE : Cesium.Color.BLACK,
            outlineWidth: isFloorSelected ? 3 : 1.5,
            disableDepthTestDistance: Number.POSITIVE_INFINITY
          },
          label: {
            text: isFloorSelected
              ? `★ Level ${unit.floorNumber}: ${unit.subUlpin}`
              : (unit.floorNumber === 0 || unit.floorNumber === 60 || unit.floorNumber === totalFloors - 1 || unit.floorNumber % 10 === 0 ? `L${unit.floorNumber}` : ''),
            font: isFloorSelected ? 'bold 12px JetBrains Mono, monospace' : 'bold 10px JetBrains Mono, monospace',
            fillColor: isFloorSelected ? Cesium.Color.fromCssColorString('#ffd700') : Cesium.Color.WHITE,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 3,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            pixelOffset: new Cesium.Cartesian2(18, 0),
            verticalOrigin: Cesium.VerticalOrigin.CENTER,
            disableDepthTestDistance: Number.POSITIVE_INFINITY,
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 5000)
          },
          properties: {
            type: 'floor_pin',
            unitData: unit,
            parcelData: selectedParcel
          }
        });

        // Active Floor 3D Overhead Tag (Floats above highlighted floor)
        if (isFloorSelected) {
          const tagPos = Cesium.Cartesian3.fromDegrees(
            selectedParcel.centroid[0],
            selectedParcel.centroid[1],
            floorTop + 3.0
          );

          viewer.entities.add({
            id: `active-tag-${unit.unitId}`,
            position: tagPos,
            label: {
              text: `📌 Level ${unit.floorNumber}: ${unit.subUlpin}\nElev: ${unit.heightRange} • ${unit.owner}`,
              font: 'bold 12px JetBrains Mono, monospace',
              fillColor: Cesium.Color.fromCssColorString('#ffd700'),
              outlineColor: Cesium.Color.BLACK,
              outlineWidth: 3,
              style: Cesium.LabelStyle.FILL_AND_OUTLINE,
              verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
              disableDepthTestDistance: Number.POSITIVE_INFINITY
            }
          });
        }
      });
    }

  }, [roads, selectedParcel, selectedUnitId, show3DStrata, colorByHeight]);

  // Smooth camera fly-to when parcel is selected or reset view triggered
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    if (selectedParcel) {
      const targetLon = selectedParcel.centroid[0];
      const targetLat = selectedParcel.centroid[1] - 0.0022;
      const targetHeight = Math.max(selectedParcel.extrudedHeight * 1.5, 260);

      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(targetLon, targetLat, targetHeight),
        orientation: {
          heading: Cesium.Math.toRadians(15),
          pitch: Cesium.Math.toRadians(-32),
          roll: 0
        },
        duration: 1.2
      });
    } else if (flyToTrigger > 0 && metadata?.center) {
      const center = metadata.center;
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
          center.longitude,
          center.latitude - 0.008,
          center.height || 1250
        ),
        orientation: {
          heading: Cesium.Math.toRadians(center.heading || 25),
          pitch: Cesium.Math.toRadians(center.pitch || -38),
          roll: Cesium.Math.toRadians(center.roll || 0)
        },
        duration: 1.4
      });
    }
  }, [selectedParcel, flyToTrigger]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* Cesium canvas */}
      <div ref={containerRef} className="cesium-container" />

      {/* Hover Tooltip */}
      {tooltip && (
        <div
          className="cesium-3d-tooltip"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
            <span style={{ fontWeight: 700, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
              {tooltip.parcel.id}
            </span>
            <span style={{ fontSize: '10px', color: '#94a3b8' }}>
              {tooltip.parcel.surveyNumber}
            </span>
          </div>

          <div style={{ fontWeight: 600, color: '#fff', fontSize: '12px' }}>
            {tooltip.parcel.name}
          </div>

          {tooltip.unit && (
            <div style={{ fontSize: '11px', color: '#ffd700', fontWeight: 600, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2px', marginTop: '2px' }}>
              Strata Pin: {tooltip.unit.floorLabel} ({tooltip.unit.subUlpin})
            </div>
          )}

          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#94a3b8' }}>
            ULPIN: {tooltip.unit ? tooltip.unit.subUlpin : tooltip.parcel.ulpin}
          </div>

          <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>
            Click to inspect Cadastral Title & Strata
          </div>
        </div>
      )}
    </div>
  );
}
