import React, { useEffect, useRef, useState } from 'react';
import * as Cesium from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';
import { SAMPLE_PARCELS, VILLAGE_ROADS, VILLAGE_METADATA } from '../data/villageData';

/**
 * Returns height-based color corresponding to Cesium 3D city styling
 */
export function getBuildingHeightColor(height) {
  if (height >= 300) return '#ef4444'; // Red for Supertalls (e.g. One WTC 541m, 3 WTC 329m)
  if (height >= 200) return '#f97316'; // Orange for High-rises (e.g. 70 Pine 290m, 40 Wall 283m, Woolworth 241m)
  if (height >= 120) return '#eab308'; // Amber/Gold for Mid-High (e.g. One NY Plaza 195m, 120 Broadway 164m)
  if (height >= 60) return '#06b6d4';  // Cyan for Mid-rise (e.g. Trinity Church 86m, Gateway 95m)
  return '#3b82f6';                    // Blue for Lower structures (e.g. Federal Hall 19m, NYSE 38m)
}

/**
 * Inset polygon relative to centroid so 3D building sits realistically inside land parcel
 */
function getInsetPolygon(polygon, centroid, scale = 0.74) {
  return polygon.map(([lon, lat]) => [
    centroid[0] + (lon - centroid[0]) * scale,
    centroid[1] + (lat - centroid[1]) * scale
  ]);
}

export default function CesiumViewer({
  parcels = SAMPLE_PARCELS,
  roads = VILLAGE_ROADS,
  metadata = VILLAGE_METADATA,
  selectedParcel,
  onSelectParcel,
  selectedUnitId,
  onSelectUnit,
  showBuildings = true,
  colorByHeight = false,
  show3DStrata = true,
  is2DView = false,
  customToken,
  flyToTrigger
}) {
  const containerRef = useRef(null);
  const viewerRef = useRef(null);
  const osmTilesetRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);

  // Initialize Cesium Viewer
  useEffect(() => {
    if (!containerRef.current) return;

    // --- Ion Token (project token — hardcoded for SIH demo) ---
    const ION_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6Ik5HYlF5RGNZOXB4bDc1X2YiLCJqdGkiOiI2NzMyMTRjNi0wMDRhLTQ3M2EtYmJhOC0yMjU2YTg4ODI3YWQiLCJpZCI6NDk5MDY5LCJpc3MiOiJodHRwczovL2FwaS5jZXNpdW0uY29tIiwiYXVkIjoidW5kZWZpbmVkX2RlZmF1bHQiLCJpYXQiOjE3ODk2Njk2MTV9.MSL-kXcRUrxSBhqKmbWvknmVpt49jfipQmMDesWKtQU";
    Cesium.Ion.defaultAccessToken = customToken || ION_TOKEN;

    // 1. Guaranteed reliable base imagery: OpenStreetMap (never blank, works worldwide)
    const osmProvider = new Cesium.OpenStreetMapImageryProvider({
      url: 'https://tile.openstreetmap.org/'
    });

    // 2. Initialize viewer with OSM baseLayer
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
      baseLayer: new Cesium.ImageryLayer(osmProvider)
    });

    viewerRef.current = viewer;

    // Fixed solar daylight (12:00 PM NYC solar midday time = 16:00 UTC)
    const daylightTime = Cesium.JulianDate.fromDate(new Date('2026-09-17T16:00:00Z'));
    viewer.clock.currentTime = daylightTime;
    viewer.clock.shouldAnimate = false;

    // Globe visual settings - depthTestAgainstTerrain must be FALSE to avoid blue occlusion of the surface
    viewer.scene.globe.depthTestAgainstTerrain = false;
    viewer.scene.globe.enableLighting = false;
    viewer.scene.skyBox.show = true;

    // Try to load Cesium World Imagery (Ion Asset 2 satellite layer) on top if available
    Cesium.IonImageryProvider.fromAssetId(2).then((ionProvider) => {
      viewer.imageryLayers.addImageryProvider(ionProvider);
    }).catch(() => {
      console.log('Using OpenStreetMap base map layer.');
    });

    // Load Cesium World Terrain (Ion Asset 1)
    Cesium.CesiumTerrainProvider.fromIonAssetId(1).then((terrainProvider) => {
      viewer.terrainProvider = terrainProvider;
    }).catch((err) => {
      console.warn('Terrain load warning:', err);
    });

    // Load Ion Asset 75343 — New York City 3D Buildings tileset
    Cesium.Cesium3DTileset.fromIonAssetId(75343).then((tileset) => {
      osmTilesetRef.current = tileset;
      viewer.scene.primitives.add(tileset);

      // Apply the default style bundled with the Ion asset (if present)
      const extras = tileset.asset?.extras;
      if (
        Cesium.defined(extras) &&
        Cesium.defined(extras.ion) &&
        Cesium.defined(extras.ion.defaultStyle)
      ) {
        tileset.style = new Cesium.Cesium3DTileStyle(extras.ion.defaultStyle);
      }

      // Initial zoom to frame the NYC 3D buildings if no parcel was selected
      viewer.zoomTo(tileset).catch(() => {});
    }).catch((err) => {
      console.warn('Ion Asset 75343 load warning — falling back to OSM Buildings:', err);
      Cesium.createOsmBuildingsAsync().then((tileset) => {
        osmTilesetRef.current = tileset;
        viewer.scene.primitives.add(tileset);
      }).catch(() => {
        console.log('Using local 3D city dataset only.');
      });
    });

    // Initial camera position
    const center = metadata.center || VILLAGE_METADATA.center;
    viewer.camera.setView({
      destination: Cesium.Cartesian3.fromDegrees(
        center.longitude,
        center.latitude - 0.008,
        center.height || 1200
      ),
      orientation: {
        heading: Cesium.Math.toRadians(center.heading || 25),
        pitch: Cesium.Math.toRadians(center.pitch || -38),
        roll: Cesium.Math.toRadians(center.roll || 0)
      }
    });

    // Mouse interaction handler
    const handler = new Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);

    // Left click to select parcel / unit / 3D tile
    handler.setInputAction((movement) => {
      const pickedObject = viewer.scene.pick(movement.position);

      if (Cesium.defined(pickedObject)) {
        // 1. Picked an Entity building or parcel
        if (pickedObject.id && pickedObject.id.properties) {
          const parcelData = pickedObject.id.properties.parcelData?.getValue();
          const unitData = pickedObject.id.properties.unitData?.getValue();

          if (parcelData) {
            onSelectParcel(parcelData);
            if (unitData) {
              onSelectUnit(unitData.unitId);
            } else {
              onSelectUnit(null);
            }
            return;
          }
        }

        // 2. Picked a Cesium 3D Tile feature (NYC Asset 75343 / Global 3D Buildings)
        if (pickedObject instanceof Cesium.Cesium3DTileFeature) {
          const height = pickedObject.getProperty('Height') || pickedObject.getProperty('cesium#estimatedHeight') || 45;
          const bin = pickedObject.getProperty('BIN');
          const doittId = pickedObject.getProperty('DOITT_ID');
          const year = pickedObject.getProperty('Year');
          const ownerType = pickedObject.getProperty('Majority_Ownership_Type') || 'Urban Titleholder';
          const levels = pickedObject.getProperty('building:levels') || Math.max(1, Math.round(height / 3.6));
          const name = pickedObject.getProperty('name') || (bin ? `NYC Building (BIN ${bin})` : 'New York City 3D Building');
          
          // Generate a dynamic prototype parcel model from picked 3D Tile
          const dynamicUlpin = bin ? `US-NYC-BIN-${bin}` : `US-NYC-3D-${Math.abs(Math.round(height * 10))}`;
          const dynamicParcel = {
            id: bin ? `NYC-BIN-${bin}` : `3D-BLDG-${Math.round(height * 10)}`,
            name: name,
            ulpin: dynamicUlpin,
            surveyNumber: bin ? `NYC DoB BIN: ${bin}${doittId ? ` (DoITT: ${doittId})` : ''}` : `Survey Height: ${Math.round(height)}m`,
            landType: `Commercial / Urban Property (${ownerType})`,
            subType: year ? `Constructed in ${year} (${Math.round(height)}m Elevation)` : `3D Building (${Math.round(height)}m Elevation)`,
            owner: `Majority Ownership: ${ownerType}`,
            ownerContact: 'NYC Department of Buildings Registry',
            areaSqM: Math.round(levels * 320),
            areaDisplay: `~${Math.round(levels * 320)} m² Estimated Floor Space`,
            taxStatus: 'NYC Municipal Property Registry',
            color: getBuildingHeightColor(height),
            isVerticalProperty: levels > 1,
            totalFloors: levels,
            extrudedHeight: Math.round(height),
            centroid: [
              pickedObject.getProperty('Longitude') || center.longitude,
              pickedObject.getProperty('Latitude') || center.latitude
            ],
            description: `Authentic NYC 3D Building (Cesium Ion Asset 75343 / NYC DoITT). Surveyed Height: ${Math.round(height)}m.${year ? ` Built ${year}.` : ''} Owner Category: ${ownerType}.`,
            verticalStrata: levels > 1 ? [
              { unitId: `BIN-${bin || 'G0'}-G0`, floorNumber: 0, floorLabel: 'Ground Floor', name: 'Street Level Commercial / Lobby', subUlpin: `${dynamicUlpin}-FL00`, owner: `${ownerType} (Ground Floor)`, areaSqM: 320, usage: 'Commercial Ground Unit', heightRange: '0m - 4.0m', color: '#38bdf8' },
              { unitId: `BIN-${bin || 'F1'}-F${Math.round(levels / 2)}`, floorNumber: Math.round(levels / 2), floorLabel: `Floor ${Math.round(levels / 2)}`, name: `Mid-Rise Strata Unit (Floor ${Math.round(levels / 2)})`, subUlpin: `${dynamicUlpin}-FL${String(Math.round(levels / 2)).padStart(2, '0')}`, owner: `${ownerType} Unit Holder`, areaSqM: 320, usage: 'Office / Strata Title', heightRange: `${Math.round(height / 2)}m - ${Math.round(height / 2) + 4}m`, color: '#60a5fa' },
              { unitId: `BIN-${bin || 'TOP'}-F${levels}`, floorNumber: levels, floorLabel: `Top Floor (${levels})`, name: `Upper Strata / Penthouse Title`, subUlpin: `${dynamicUlpin}-FL${String(levels).padStart(2, '0')}`, owner: `${ownerType} Titleholder`, areaSqM: 320, usage: 'Executive / Upper Title', heightRange: `${Math.round(height - 4)}m - ${Math.round(height)}m`, color: '#a78bfa' }
            ] : null
          };

          onSelectParcel(dynamicParcel);
          onSelectUnit(null);
          return;
        }
      }

      // Clicked on empty ground
      onSelectParcel(null);
      onSelectUnit(null);
    }, Cesium.ScreenSpaceEventType.LEFT_CLICK);

    // Mouse move for hover tooltip & pointer cursor
    handler.setInputAction((movement) => {
      const pickedObject = viewer.scene.pick(movement.endPosition);

      if (Cesium.defined(pickedObject)) {
        if (pickedObject.id && pickedObject.id.properties) {
          const parcelData = pickedObject.id.properties.parcelData?.getValue();
          const unitData = pickedObject.id.properties.unitData?.getValue();

          if (parcelData) {
            containerRef.current.style.cursor = 'pointer';
            setTooltip({
              x: movement.endPosition.x,
              y: movement.endPosition.y,
              parcel: parcelData,
              unit: unitData
            });
            return;
          }
        } else if (pickedObject instanceof Cesium.Cesium3DTileFeature) {
          const height = pickedObject.getProperty('Height') || pickedObject.getProperty('cesium#estimatedHeight') || 40;
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

  // Handle 2D / 3D View Morphing
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    if (is2DView && viewer.scene.mode !== Cesium.SceneMode.SCENE2D) {
      viewer.scene.morphTo2D(1.0);
    } else if (!is2DView && viewer.scene.mode !== Cesium.SceneMode.SCENE3D) {
      viewer.scene.morphTo3D(1.0);
    }
  }, [is2DView]);

  // Style 3D Tileset with height-based gradient if loaded
  useEffect(() => {
    const tileset = osmTilesetRef.current;
    if (!tileset) return;

    const isNyc = metadata?.name?.includes('New York') || metadata?.name?.includes('Foreign City');
    tileset.show = isNyc && showBuildings;

    if (!isNyc) return;

    if (colorByHeight) {
      tileset.style = new Cesium.Cesium3DTileStyle({
        color: {
          conditions: [
            ['${Height} >= 300 || ${cesium#estimatedHeight} >= 300', 'color("#ef4444", 0.95)'],
            ['${Height} >= 200 || ${cesium#estimatedHeight} >= 200', 'color("#f97316", 0.95)'],
            ['${Height} >= 120 || ${cesium#estimatedHeight} >= 120', 'color("#eab308", 0.95)'],
            ['${Height} >= 60 || ${cesium#estimatedHeight} >= 60', 'color("#06b6d4", 0.95)'],
            ['true', 'color("#3b82f6", 0.9)']
          ]
        }
      });
    } else {
      const extras = tileset.asset?.extras;
      if (
        Cesium.defined(extras) &&
        Cesium.defined(extras.ion) &&
        Cesium.defined(extras.ion.defaultStyle)
      ) {
        tileset.style = new Cesium.Cesium3DTileStyle(extras.ion.defaultStyle);
      } else {
        tileset.style = new Cesium.Cesium3DTileStyle({
          color: 'color("#f8fafc", 0.9)'
        });
      }
    }
  }, [metadata, colorByHeight, showBuildings]);

  // When active dataset changes, fly camera to new dataset center or zoom to tileset
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer || !metadata?.center) return;
    if (selectedParcel) return;

    const isNyc = metadata?.name?.includes('New York') || metadata?.name?.includes('Foreign City');
    const tileset = osmTilesetRef.current;

    if (isNyc && tileset) {
      viewer.zoomTo(tileset).catch(() => {});
    } else {
      const center = metadata.center;
      viewer.camera.flyTo({
        destination: Cesium.Cartesian3.fromDegrees(
          center.longitude,
          center.latitude - 0.008,
          center.height || 1200
        ),
        orientation: {
          heading: Cesium.Math.toRadians(center.heading || 25),
          pitch: Cesium.Math.toRadians(center.pitch || -38),
          roll: Cesium.Math.toRadians(center.roll || 0)
        },
        duration: 1.5
      });
    }
  }, [metadata]);

  // Re-draw Entities (Parcels, Roads, Strata Floors, Survey Corner Pillars)
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;

    viewer.entities.removeAll();

    const isNyc = metadata?.name?.includes('New York') || metadata?.name?.includes('Foreign City');

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
          outlineColor: Cesium.Color.fromCssColorString('#ffffff').withAlpha(0.4),
          outlineWidth: 1
        }
      });

      // Dashed yellow road centerline
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

    // 2. Draw Parcels and 3D Extruded Buildings
    (parcels || []).forEach((parcel) => {
      const isParcelSelected = selectedParcel?.id === parcel.id;
      const parcelPositions = Cesium.Cartesian3.fromDegreesArray(parcel.polygon.flat());

      // Base Land-Use color vs Height-Based Color
      const buildingColorHex = colorByHeight 
        ? getBuildingHeightColor(parcel.extrudedHeight || 20)
        : (parcel.color || '#2563eb');

      const baseColor = Cesium.Color.fromCssColorString(buildingColorHex);
      const polygonFill = isParcelSelected
        ? baseColor.withAlpha(0.85)
        : baseColor.withAlpha(0.6);

      const outlineColor = isParcelSelected
        ? Cesium.Color.fromCssColorString('#38bdf8')
        : Cesium.Color.WHITE.withAlpha(0.9);

      // Base 2D Land Parcel Boundary on Ground
      viewer.entities.add({
        id: `parcel-${parcel.id}`,
        name: parcel.name,
        polygon: {
          hierarchy: parcelPositions,
          material: polygonFill,
          outline: true,
          outlineColor: outlineColor,
          outlineWidth: isParcelSelected ? 3 : 2,
          height: 0,
          extrudedHeight: 0.2
        },
        properties: {
          parcelData: parcel,
          type: 'parcel'
        }
      });

      // 3. 3D City Buildings & Vertical Strata
      // In Foreign City (New York City), 3D buildings are provided authentically by Cesium 3D Tileset (Asset 75343).
      // We do NOT render old manual extruded building boxes in NYC to prevent clutter and overlap.
      // Only render 3D strata if a parcel is specifically selected by the user for strata dissection.
      const shouldRenderBuilding = !isNyc && showBuildings && parcel.extrudedHeight > 0.5;
      const shouldRenderStrata = showBuildings && parcel.isVerticalProperty && parcel.verticalStrata && (!isNyc || isParcelSelected);

      if ((shouldRenderBuilding || shouldRenderStrata) && parcel.extrudedHeight > 0.5) {
        const buildingPolygon = getInsetPolygon(parcel.polygon, parcel.centroid, 0.76);
        const buildingPositions = Cesium.Cartesian3.fromDegreesArray(buildingPolygon.flat());

        if (show3DStrata && parcel.isVerticalProperty && parcel.verticalStrata && (!isNyc || isParcelSelected)) {
          // Render discrete vertical floor strata slabs
          const floorHeight = parcel.extrudedHeight / parcel.totalFloors;

          parcel.verticalStrata.forEach((unit, idx) => {
            const isUnitSelected = selectedUnitId === unit.unitId;
            const floorBase = idx * floorHeight + 0.35;
            const floorTop = (idx + 1) * floorHeight;
            const slabSeparatorBase = floorBase - 0.2;

            // Structural slab edge separator
            viewer.entities.add({
              id: `slab-separator-${parcel.id}-${unit.unitId}`,
              polygon: {
                hierarchy: buildingPositions,
                material: Cesium.Color.fromCssColorString('#0f172a').withAlpha(0.95),
                height: slabSeparatorBase,
                extrudedHeight: floorBase,
                outline: true,
                outlineColor: Cesium.Color.fromCssColorString('#64748b').withAlpha(0.6),
                outlineWidth: 1
              }
            });

            // Strata floor volume
            let floorColor;
            let floorOutlineColor;
            let floorOutlineWidth = 1;

            if (isUnitSelected) {
              floorColor = Cesium.Color.fromCssColorString('#00f2fe').withAlpha(0.95);
              floorOutlineColor = Cesium.Color.fromCssColorString('#ffea00');
              floorOutlineWidth = 3;
            } else if (colorByHeight) {
              floorColor = Cesium.Color.fromCssColorString(getBuildingHeightColor(floorTop)).withAlpha(0.85);
              floorOutlineColor = Cesium.Color.WHITE.withAlpha(0.8);
            } else if (isParcelSelected) {
              floorColor = Cesium.Color.fromCssColorString(unit.color || parcel.color).withAlpha(0.88);
              floorOutlineColor = Cesium.Color.WHITE.withAlpha(0.85);
            } else {
              floorColor = Cesium.Color.fromCssColorString(unit.color || parcel.color).withAlpha(0.72);
              floorOutlineColor = Cesium.Color.WHITE.withAlpha(0.65);
            }

            viewer.entities.add({
              id: `strata-${parcel.id}-${unit.unitId}`,
              name: `${unit.floorLabel} - ${unit.name}`,
              polygon: {
                hierarchy: buildingPositions,
                material: floorColor,
                outline: true,
                outlineColor: floorOutlineColor,
                outlineWidth: floorOutlineWidth,
                height: floorBase,
                extrudedHeight: floorTop
              },
              properties: {
                parcelData: parcel,
                unitData: unit,
                type: 'strata_unit'
              }
            });

            // Active floor 3D tag
            if (isUnitSelected) {
              const unitCentroidPos = Cesium.Cartesian3.fromDegrees(
                parcel.centroid[0],
                parcel.centroid[1],
                floorTop + 2.5
              );

              viewer.entities.add({
                id: `unit-label-${unit.unitId}`,
                position: unitCentroidPos,
                label: {
                  text: `📌 ${unit.floorLabel}: ${unit.subUlpin}\nElev: ${unit.heightRange}`,
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
        } else if (shouldRenderBuilding) {
          // Solid 3D Building Massing Envelope (Synthetic demo village only)
          viewer.entities.add({
            id: `solid-bldg-${parcel.id}`,
            name: parcel.name,
            polygon: {
              hierarchy: buildingPositions,
              material: baseColor.withAlpha(0.85),
              outline: true,
              outlineColor: Cesium.Color.WHITE.withAlpha(0.9),
              outlineWidth: 1.5,
              height: 0.2,
              extrudedHeight: parcel.extrudedHeight
            },
            properties: {
              parcelData: parcel,
              type: 'building'
            }
          });
        }
      }

      // 4. Centroid 3D Tag / Parcel Label (show for village or selected NYC parcel)
      if (!isNyc || isParcelSelected) {
        const labelAltitude = (parcel.extrudedHeight > 0.5 && showBuildings)
          ? (parcel.extrudedHeight + 6)
          : 6;

        const centroidPos = Cesium.Cartesian3.fromDegrees(
          parcel.centroid[0],
          parcel.centroid[1],
          labelAltitude
        );

        viewer.entities.add({
          id: `label-${parcel.id}`,
          position: centroidPos,
          label: {
            text: `${parcel.id}\n${parcel.extrudedHeight > 50 ? `🏢 ${Math.round(parcel.extrudedHeight)}m` : parcel.landType.split(' ')[0]}`,
            font: 'bold 11px Inter, sans-serif',
            fillColor: isParcelSelected ? Cesium.Color.fromCssColorString('#38bdf8') : Cesium.Color.WHITE,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 3,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(0, 4500),
            disableDepthTestDistance: Number.POSITIVE_INFINITY
          },
          properties: {
            parcelData: parcel,
            type: 'label'
          }
        });
      }
    });


    // 5. Cadastral Survey Boundary Corner Markers for selected parcel
    if (selectedParcel && selectedParcel.polygon) {
      selectedParcel.polygon.forEach(([lon, lat], vIdx) => {
        const markerPos = Cesium.Cartesian3.fromDegrees(lon, lat, 0.4);

        viewer.entities.add({
          id: `survey-pillar-${selectedParcel.id}-${vIdx}`,
          position: markerPos,
          cylinder: {
            length: 1.8,
            topRadius: 0.7,
            bottomRadius: 0.9,
            material: Cesium.Color.fromCssColorString('#ff9933'),
            outline: true,
            outlineColor: Cesium.Color.WHITE,
            outlineWidth: 1.5
          }
        });

        viewer.entities.add({
          id: `survey-label-${selectedParcel.id}-${vIdx}`,
          position: Cesium.Cartesian3.fromDegrees(lon, lat, 2.2),
          label: {
            text: `M${vIdx + 1}`,
            font: 'bold 10px JetBrains Mono, monospace',
            fillColor: Cesium.Color.WHITE,
            outlineColor: Cesium.Color.BLACK,
            outlineWidth: 2,
            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
            disableDepthTestDistance: Number.POSITIVE_INFINITY
          }
        });
      });
    }

  }, [parcels, roads, selectedParcel, selectedUnitId, showBuildings, colorByHeight, show3DStrata]);

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
          center.height || 1200
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
      {/* Cesium canvas target */}
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
            <div style={{ fontSize: '11px', color: '#ffb74d', fontWeight: 600, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '2px', marginTop: '2px' }}>
              Strata: {tooltip.unit.floorLabel} ({tooltip.unit.name})
            </div>
          )}

          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#94a3b8' }}>
            ULPIN: {tooltip.unit ? tooltip.unit.subUlpin : tooltip.parcel.ulpin}
          </div>

          <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px' }}>
            Click to inspect Cadastral Title
          </div>
        </div>
      )}
    </div>
  );
}
