import React, { useEffect, useRef, useState } from 'react';
import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import { getBuildingHeightColor, generateFullBuildingStrata } from '../utils/ulpinGenerator.js';
import { NYC_PARCELS, NYC_METADATA } from '../data/nycData.js';

export { getBuildingHeightColor };

/**
 * Applies height-based styling to Cesium 3D Tileset (Asset 75343 & OSM Buildings)
 * Provides distinct height categorization matching the legend.
 */
export function applyTilesetHeightStyle(tileset, isDarkMode = false, selectedBin = null) {
  if (!tileset) return;

  const baseConditions = isDarkMode
    ? [
        ['${Height} >= 300 || ${cesium#estimatedHeight} >= 300 || ${HEIGHTROOF} >= 300', 'color("#ff1744", 0.98)'],
        ['${Height} >= 200 || ${cesium#estimatedHeight} >= 200 || ${HEIGHTROOF} >= 200', 'color("#ff9100", 0.98)'],
        ['${Height} >= 120 || ${cesium#estimatedHeight} >= 120 || ${HEIGHTROOF} >= 120', 'color("#ffd600", 0.98)'],
        ['${Height} >= 60 || ${cesium#estimatedHeight} >= 60 || ${HEIGHTROOF} >= 60', 'color("#00e5ff", 0.98)'],
        ['true', 'color("#2979ff", 0.92)']
      ]
    : [
        ['${Height} >= 300 || ${cesium#estimatedHeight} >= 300 || ${HEIGHTROOF} >= 300', 'color("#ef4444", 0.95)'],
        ['${Height} >= 200 || ${cesium#estimatedHeight} >= 200 || ${HEIGHTROOF} >= 200', 'color("#f97316", 0.95)'],
        ['${Height} >= 120 || ${cesium#estimatedHeight} >= 120 || ${HEIGHTROOF} >= 120', 'color("#eab308", 0.95)'],
        ['${Height} >= 60 || ${cesium#estimatedHeight} >= 60 || ${HEIGHTROOF} >= 60', 'color("#06b6d4", 0.95)'],
        ['true', 'color("#3b82f6", 0.90)']
      ];

  // If a building BIN is selected, prioritize highlighting it in bright cyan
  const conditions = selectedBin
    ? [
        [`\${BIN} === ${selectedBin} || String(\${BIN}) === "${selectedBin}"`, 'color("#00f2fe", 1.0)'],
        ...baseConditions
      ]
    : baseConditions;

  try {
    tileset.style = new Cesium.Cesium3DTileStyle({
      color: { conditions }
    });
  } catch (err) {
    console.warn('Tileset styling note:', err);
  }
}

/**
 * Insets a polygon slightly relative to centroid for floor strata slicing
 */
function getInsetPolygon(polygon, centroid, scale = 0.85) {
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
  const standardLayerRef = useRef(null);
  const previousPickedFeatureRef = useRef(null);
  const previousPickedColorRef = useRef(null);
  const prevMapViewModeRef = useRef('standard');
  const [tooltip, setTooltip] = useState(null);

  // 1. Initialize Cesium Viewer ONCE
  useEffect(() => {
    if (!containerRef.current) return;

    const ION_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6Ik5HYlF5RGNZOXB4bDc1X2YiLCJqdGkiOiI2NzMyMTRjNi0wMDRhLTQ3M2EtYmJhOC0yMjU2YTg4ODI3YWQiLCJpZCI6NDk5MDY5LCJpc3MiOiJodHRwczovL2FwaS5jZXNpdW0uY29tIiwiYXVkIjoidW5kZWZpbmVkX2RlZmF1bHQiLCJpYXQiOjE3ODk2Njk2MTV9.MSL-kXcRUrxSBhqKmbWvknmVpt49jfipQmMDesWKtQU";
    Cesium.Ion.defaultAccessToken = customToken || ION_TOKEN;

    // Stable, high-availability OpenStreetMap base imagery
    const osmProvider = new Cesium.OpenStreetMapImageryProvider({
      url: 'https://tile.openstreetmap.org/'
    });

    const standardBaseLayer = new Cesium.ImageryLayer(osmProvider);
    standardLayerRef.current = standardBaseLayer;

    // Initialize viewer
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

    // Solar noon lighting for crisp building shadows & visibility
    viewer.clock.currentTime = Cesium.JulianDate.fromDate(new Date('2026-09-17T16:00:00Z'));
    viewer.clock.shouldAnimate = false;

    // Stable globe settings
    viewer.scene.globe.depthTestAgainstTerrain = false;
    viewer.scene.globe.enableLighting = false;
    viewer.scene.skyBox.show = true;

    // Optional satellite imagery underlay if available
    Cesium.IonImageryProvider.fromAssetId(2)
      .then((ionProvider) => {
        if (!viewer.isDestroyed()) {
          viewer.imageryLayers.addImageryProvider(ionProvider);
        }
      })
      .catch(() => {});

    // Cesium World Terrain
    Cesium.CesiumTerrainProvider.fromIonAssetId(1)
      .then((terrainProvider) => {
        if (!viewer.isDestroyed()) {
          viewer.terrainProvider = terrainProvider;
        }
      })
      .catch(() => {});

    // Load NYC 3D Buildings (Asset 75343) with fallback to OSM Buildings
    Cesium.Cesium3DTileset.fromIonAssetId(75343)
      .then((tileset) => {
        if (viewer.isDestroyed()) return;
        osmTilesetRef.current = tileset;
        viewer.scene.primitives.add(tileset);
        applyTilesetHeightStyle(tileset, false, null);
      })
      .catch(() => {
        Cesium.createOsmBuildingsAsync()
          .then((tileset) => {
            if (viewer.isDestroyed()) return;
            osmTilesetRef.current = tileset;
            viewer.scene.primitives.add(tileset);
            applyTilesetHeightStyle(tileset, false, null);
          })
          .catch(() => {});
      });

    // Initial camera view overlooking Lower Manhattan
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

    // Screen Space Event Handler for Building & Floor selection
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

    handler.setInputAction((movement) => {
      const pickedObject = viewer.scene.pick(movement.position);

      if (Cesium.defined(pickedObject)) {
        // A. Clicked a Clickable Floor Pin
        if (pickedObject.id?.properties?.type?.getValue() === 'floor_pin') {
          const unit = pickedObject.id.properties.unitData.getValue();
          const building = pickedObject.id.properties.parcelData.getValue();
          onSelectParcel(building);
          onSelectUnit(unit.unitId);
          return;
        }

        // B. Clicked a 3D Strata Unit Floor Slab
        if (pickedObject.id?.properties?.type?.getValue() === 'strata_unit') {
          const unit = pickedObject.id.properties.unitData.getValue();
          const building = pickedObject.id.properties.parcelData.getValue();
          onSelectParcel(building);
          onSelectUnit(unit.unitId);
          return;
        }

        // C. Clicked a 3D Tile Building
        if (pickedObject instanceof Cesium.Cesium3DTileFeature) {
          // Restore previous tile feature color
          if (previousPickedFeatureRef.current && previousPickedColorRef.current) {
            try {
              previousPickedFeatureRef.current.color = previousPickedColorRef.current;
            } catch (_) {}
          }

          // Highlight newly picked feature in glowing cyan
          try {
            previousPickedColorRef.current = pickedObject.color ? Cesium.Color.clone(pickedObject.color) : Cesium.Color.WHITE;
            pickedObject.color = Cesium.Color.fromCssColorString('#00f2fe');
            previousPickedFeatureRef.current = pickedObject;
          } catch (_) {}

          const height = pickedObject.getProperty('Height') || pickedObject.getProperty('cesium#estimatedHeight') || 65;
          const bin = pickedObject.getProperty('BIN');
          const doittId = pickedObject.getProperty('DOITT_ID');
          const year = pickedObject.getProperty('Year');
          const ownerType = pickedObject.getProperty('Majority_Ownership_Type') || 'Commercial / Mixed';
          const levels = pickedObject.getProperty('building:levels') || Math.max(2, Math.round(height / 3.8));
          const name = pickedObject.getProperty('name') || (bin ? `NYC Building (BIN ${bin})` : 'New York City 3D Building');
          const lon = pickedObject.getProperty('Longitude') || center.longitude;
          const lat = pickedObject.getProperty('Latitude') || center.latitude;

          // Check if matched in indexed parcels
          const matched = (parcels || []).find((p) => {
            if (bin && p.surveyNumber?.includes(String(bin))) return true;
            if (p.centroid) {
              const dLon = Math.abs(p.centroid[0] - lon);
              const dLat = Math.abs(p.centroid[1] - lat);
              return dLon < 0.0008 && dLat < 0.0008;
            }
            return false;
          });

          if (matched) {
            onSelectParcel(matched);
            onSelectUnit(null);
            return;
          }

          // Dynamic building model with full strata
          const dynamicUlpin = bin ? `US-NYC-BIN-${bin}` : `US-NYC-3D-${Math.abs(Math.round(height * 10))}`;
          const rawDynamic = {
            id: bin ? `NYC-BIN-${bin}` : `3D-BLDG-${Math.round(height * 10)}`,
            name: name,
            ulpin: dynamicUlpin,
            surveyNumber: bin ? `BIN: ${bin}${doittId ? ` • DoITT: ${doittId}` : ''}` : `Height: ${Math.round(height)}m`,
            landType: `Urban Commercial (${ownerType})`,
            subType: year ? `Built ${year} • ${Math.round(height)}m Elevation` : `High-Rise • ${Math.round(height)}m`,
            owner: ownerType,
            ownerContact: 'NYC Department of Buildings Registry',
            areaSqM: Math.round(levels * 280),
            areaDisplay: `~${Math.round(levels * 280)} m² Floor Area`,
            taxStatus: 'Active Cadastral Registry',
            color: getBuildingHeightColor(height),
            isVerticalProperty: levels > 1,
            totalFloors: levels,
            extrudedHeight: Math.round(height),
            centroid: [lon, lat],
            description: `NYC 3D Building • Surveyed Height: ${Math.round(height)}m.${year ? ` Built ${year}.` : ''}`
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
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    // Mouse hover handler
    handler.setInputAction((movement) => {
      const pickedObject = viewer.scene.pick(movement.endPosition);

      if (Cesium.defined(pickedObject)) {
        if (pickedObject.id?.properties?.type?.getValue() === 'floor_pin' || pickedObject.id?.properties?.type?.getValue() === 'strata_unit') {
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

        if (pickedObject instanceof Cesium.Cesium3DTileFeature) {
          const height = pickedObject.getProperty('Height') || pickedObject.getProperty('cesium#estimatedHeight') || 45;
          const bin = pickedObject.getProperty('BIN');
          const ownerType = pickedObject.getProperty('Majority_Ownership_Type');
          containerRef.current.style.cursor = 'pointer';
          setTooltip({
            x: movement.endPosition.x,
            y: movement.endPosition.y,
            parcel: {
              id: bin ? `BIN: ${bin}` : 'NYC 3D Building',
              surveyNumber: `${Math.round(height)}m Height`,
              name: ownerType || pickedObject.getProperty('name') || 'NYC 3D Building',
              ulpin: bin ? `ULPIN: US-NYC-BIN-${bin}` : `Height: ${Math.round(height)}m`
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

  // 2. Crash-Proof Map Mode Switching (Standard | Street-Level | Dark View)
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || viewer.isDestroyed()) return;

    const tileset = osmTilesetRef.current;
    const baseLayer = standardLayerRef.current;
    const isDark = mapViewMode === 'dark';
    const isStreet = mapViewMode === 'street';
    const wasStreet = prevMapViewModeRef.current === 'street';
    prevMapViewModeRef.current = mapViewMode;

    // A. Basemap Color Tuning (Zero network requests, zero provider crashes!)
    try {
      if (baseLayer) {
        if (isDark) {
          baseLayer.brightness = 0.28;
          baseLayer.contrast = 1.6;
          baseLayer.saturation = 0.12;
        } else {
          baseLayer.brightness = 1.0;
          baseLayer.contrast = 1.0;
          baseLayer.saturation = 1.0;
        }
      }

      if (isDark) {
        viewer.scene.globe.baseColor = Cesium.Color.fromCssColorString('#070b14');
        viewer.scene.backgroundColor = Cesium.Color.fromCssColorString('#05070d');
      } else {
        viewer.scene.globe.baseColor = Cesium.Color.fromCssColorString('#1e293b');
        viewer.scene.backgroundColor = Cesium.Color.fromCssColorString('#090d16');
      }
    } catch (e) {
      console.warn('Map styling notice:', e);
    }

    // B. Tileset Height Color Theme
    if (tileset) {
      const selectedBin = selectedParcel?.surveyNumber?.match(/\d{5,}/)?.[0] || null;
      applyTilesetHeightStyle(tileset, isDark, selectedBin);
    }

    // C. Camera Operations with Flight Cancellation Protection
    try {
      viewer.camera.cancelFlight();

      if (isStreet) {
        // Pedestrian canyon perspective at Greenwich St / WTC (~14m safe height, no ground clipping)
        viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(-74.0118, 40.7098, 14.0),
          orientation: {
            heading: Cesium.Math.toRadians(25),
            pitch: Cesium.Math.toRadians(12),
            roll: 0
          },
          duration: 1.5
        });
      } else if (wasStreet) {
        // Leaving street view: smoothly restore aerial skyline view
        const center = metadata.center || NYC_METADATA.center;
        viewer.camera.flyTo({
          destination: Cesium.Cartesian3.fromDegrees(
            center.longitude,
            center.latitude - 0.008,
            center.height || 1250
          ),
          orientation: {
            heading: Cesium.Math.toRadians(center.heading || 25),
            pitch: Cesium.Math.toRadians(center.pitch || -38),
            roll: 0
          },
          duration: 1.5
        });
      }
    } catch (e) {
      console.warn('Camera transition notice:', e);
    }
  }, [mapViewMode, metadata]);

  // 3. Buildings Visibility & Heatmap Coloring Toggle
  useEffect(() => {
    const tileset = osmTilesetRef.current;
    if (!tileset) return;

    tileset.show = showBuildings;

    if (colorByHeight) {
      const selectedBin = selectedParcel?.surveyNumber?.match(/\d{5,}/)?.[0] || null;
      applyTilesetHeightStyle(tileset, mapViewMode === 'dark', selectedBin);
    } else {
      tileset.style = new Cesium.Cesium3DTileStyle({
        color: 'color("#cbd5e1", 0.95)'
      });
    }
  }, [colorByHeight, showBuildings, mapViewMode, selectedParcel]);

  // 4. Premium 3D Highlighting & Strata Entity Rendering
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || viewer.isDestroyed()) return;

    viewer.entities.removeAll();

    // A. Draw Roads & Centerlines
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

    // B. PREMIUM BUILDING SELECTION HIGHLIGHT (Requirement PART 5)
    // Renders an extruded cyan highlight bounding footprint + roof beacon
    if (selectedParcel) {
      const bHeight = selectedParcel.extrudedHeight || 120;
      let buildingPolygon = selectedParcel.polygon;

      if (!buildingPolygon && selectedParcel.centroid) {
        const cLon = selectedParcel.centroid[0];
        const cLat = selectedParcel.centroid[1];
        const d = 0.00038;
        buildingPolygon = [
          [cLon - d, cLat - d],
          [cLon + d, cLat - d],
          [cLon + d, cLat + d],
          [cLon - d, cLat + d]
        ];
      }

      if (buildingPolygon) {
        const boundaryPositions = Cesium.Cartesian3.fromDegreesArray(buildingPolygon.flat());

        // 1. Translucent Volumetric Highlight Envelope
        viewer.entities.add({
          id: `selected-building-envelope-${selectedParcel.id}`,
          name: `Selected: ${selectedParcel.name}`,
          polygon: {
            hierarchy: boundaryPositions,
            material: Cesium.Color.fromCssColorString('#00f2fe').withAlpha(0.20),
            outline: true,
            outlineColor: Cesium.Color.fromCssColorString('#00f2fe'),
            outlineWidth: 3,
            height: 0.5,
            extrudedHeight: bHeight
          }
        });

        // 2. Glowing Roof Beacon & Cadastral Label
        if (selectedParcel.centroid) {
          const roofPos = Cesium.Cartesian3.fromDegrees(
            selectedParcel.centroid[0],
            selectedParcel.centroid[1],
            bHeight + 4.0
          );

          viewer.entities.add({
            id: `selected-building-roof-${selectedParcel.id}`,
            position: roofPos,
            point: {
              pixelSize: 10,
              color: Cesium.Color.fromCssColorString('#00f2fe'),
              outlineColor: Cesium.Color.WHITE,
              outlineWidth: 2,
              disableDepthTestDistance: Number.POSITIVE_INFINITY
            },
            label: {
              text: `★ ${selectedParcel.name} (${Math.round(bHeight)}m)`,
              font: 'bold 12px JetBrains Mono, sans-serif',
              fillColor: Cesium.Color.fromCssColorString('#00f2fe'),
              outlineColor: Cesium.Color.BLACK,
              outlineWidth: 3,
              style: Cesium.LabelStyle.FILL_AND_OUTLINE,
              verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
              pixelOffset: new Cesium.Cartesian2(0, -10),
              disableDepthTestDistance: Number.POSITIVE_INFINITY
            }
          });
        }
      }
    }

    // C. PREMIUM VERTICAL FLOOR STRATA & CLICKABLE FLOOR PINS (Requirement PART 6)
    if (selectedParcel && show3DStrata && selectedParcel.isVerticalProperty) {
      const strataList = selectedParcel.verticalStrata || generateFullBuildingStrata(selectedParcel);
      const totalFloors = selectedParcel.totalFloors || strataList.length || 1;
      const bldgHeight = selectedParcel.extrudedHeight || (totalFloors * 3.8);
      const floorHeight = bldgHeight / totalFloors;

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

      strataList.forEach((unit) => {
        const isFloorSelected = selectedUnitId === unit.unitId || selectedUnitId === unit.subUlpin;
        const floorIndex = unit.floorNumber;
        const floorBase = floorIndex * floorHeight + 0.3;
        const floorTop = (floorIndex + 1) * floorHeight;
        const floorElevation = (floorBase + floorTop) / 2;

        // 1. 3D Strata Volume Slab
        const slabMaterial = isFloorSelected
          ? Cesium.Color.fromCssColorString('#00f2fe').withAlpha(0.92)
          : Cesium.Color.fromCssColorString(getBuildingHeightColor(floorTop)).withAlpha(0.55);

        const slabOutlineColor = isFloorSelected
          ? Cesium.Color.fromCssColorString('#ffd700')
          : Cesium.Color.WHITE.withAlpha(0.35);

        viewer.entities.add({
          id: `strata-${selectedParcel.id}-${unit.unitId}`,
          name: `${unit.floorLabel} (${unit.subUlpin})`,
          polygon: {
            hierarchy: slabPositions,
            material: slabMaterial,
            outline: true,
            outlineColor: slabOutlineColor,
            outlineWidth: isFloorSelected ? 3 : 1,
            height: floorBase,
            extrudedHeight: floorTop
          },
          properties: {
            type: 'strata_unit',
            unitData: unit,
            parcelData: selectedParcel
          }
        });

        // 2. Clickable 3D Floor Pin
        const pinLon = selectedParcel.centroid[0] + 0.00045;
        const pinLat = selectedParcel.centroid[1];
        const pinPos = Cesium.Cartesian3.fromDegrees(pinLon, pinLat, floorElevation);

        // Leader line
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

        // Floor Pin Point Marker
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

        // 3. Active Floor 3D Overhead Floating Tag
        if (isFloorSelected) {
          const tagPos = Cesium.Cartesian3.fromDegrees(
            selectedParcel.centroid[0],
            selectedParcel.centroid[1],
            floorTop + 2.5
          );

          viewer.entities.add({
            id: `active-tag-${unit.unitId}`,
            position: tagPos,
            label: {
              text: `📌 Level ${unit.floorNumber} • ${unit.subUlpin}\nElevation: ${unit.heightRange} • ${unit.owner}`,
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

  // 5. Camera Fly-To on Selection or Trigger
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || viewer.isDestroyed()) return;

    try {
      viewer.camera.cancelFlight();

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
    } catch (e) {
      console.warn('Camera animation notice:', e);
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
              Floor: {tooltip.unit.floorLabel} ({tooltip.unit.subUlpin})
            </div>
          )}

          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#94a3b8' }}>
            ULPIN: {tooltip.unit ? tooltip.unit.subUlpin : tooltip.parcel.ulpin}
          </div>
        </div>
      )}
    </div>
  );
}
