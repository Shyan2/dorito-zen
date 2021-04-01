/*global Autodesk, THREE*/
import React, { useState, useMemo, useEffect, useRef, useContext } from 'react';
import {
  ResolutionValueContext,
  SelectedPropertyIdContext,
  ShowHeatMapContext,
} from './ForbiddenContext';

import Viewer from './Viewer';

import defaultSVG from '../../assets/icons/circle.svg';
import tempSVG from '../../assets/icons/thermometer.svg';
import cctvSVG from '../../assets/icons/cctv.svg';
import wspLogoPng from '../../assets/images/Asset 16.png';

import devices from './devices';
import sensorDescriptors from './sensorsList';

import HeatmapOptions from './HeatmapOptions/HeatmapOptions';
import ReactPanel from '../DigitalTwin/TestReactPanel/ReactPanel';
import ForbiddenCityToolbarExtension from './ToolbarClass';
import CustomToolTip from './CustomToolTip';

const SpriteSize = 32;

const SensorStyleDefinitions = {
  thermometer: {
    url: tempSVG,
    color: 0xffffff,
  },
  camera: {
    url: cctvSVG,
    color: 0xf53528,
  },
  default: {
    url: defaultSVG,
    color: 0xffffff,
  },
};

Autodesk.Viewing.theExtensionManager.registerExtension(
  'ForbiddenCityToolbarExtension',
  ForbiddenCityToolbarExtension
);

const getNormalizedSensorValue = function (sensorName, sensorType) {
  // Returns a normalized value based on the min/max temperatures
  return Math.random();
};

const ForbiddenCity = () => {
  // Context setup
  const [resolutionValue, setResolutionValue] = useState('PT1H');
  const [selectedPropertyId, setSelectedPropertyId] = useState('temperature');
  const [showHeatMap, setShowHeatMap] = useState(true);

  const resolutionVal = useMemo(() => ({ resolutionValue, setResolutionValue }), [
    resolutionValue,
    setResolutionValue,
  ]);
  const selectedPropertyIdVal = useMemo(() => ({ selectedPropertyId, setSelectedPropertyId }), [
    selectedPropertyId,
    setSelectedPropertyId,
  ]);
  const showHeatMapVal = useMemo(() => ({ showHeatMap, setShowHeatMap }), [
    showHeatMap,
    setShowHeatMap,
  ]);
  // End Context setup

  const [dataVizExt, setDataVizExt] = useState(null);
  const [camerasVisible, setCamerasVisible] = useState(true);
  const [hoveredDeviceInfo, setHoveredDeviceInfo] = useState({});

  const dataVizExtRef = useRef(null);
  dataVizExtRef.current = dataVizExt;

  const playbackTimerRef = useRef(null);
  const playbackCounterRef = useRef(0);

  const camerasVisiblityHandler = () => {
    setCamerasVisible((prevCamerasVisible) => !prevCamerasVisible);
  };

  function generateSimulationData() {
    const simulationData = {
      id: 'floor1',
      dbIds: [100],
      sensors: [],
    };

    for (let sensor in sensorDescriptors) {
      simulationData.sensors.push({
        id: sensor,
        position: sensorDescriptors[sensor].position,
        type: 'thermometer',
        sensorTypes: ['temperature'],
      });
    }
    console.log(simulationData);

    const copySimulationData = {
      id: 'floor1',
      dbIds: [100],
      sensors: [],
    };

    devices.forEach((device) => {
      if (device.type === 'thermometer') {
        copySimulationData.sensors.push({
          id: device.name,
          position: device.position,
          type: device.type,
          sensorTypes: device.sensorTypes,
        });
      }
    });

    console.log(copySimulationData);

    return [copySimulationData];
  }

  async function generateViewableData() {
    const dataVizExtn = Autodesk.DataVisualization.Core;

    var styleMap = {};
    // Create model-to-style map from style definitions
    Object.entries(SensorStyleDefinitions).forEach(([type, styleDef]) => {
      styleMap[type] = new dataVizExtn.ViewableStyle(
        dataVizExtn.ViewableType.SPRITE,
        new THREE.Color(styleDef.color),
        styleDef.url
      );
    });

    const viewableData = new dataVizExtn.ViewableData();
    viewableData.spriteSize = SpriteSize;

    devices.forEach((device, index) => {
      const dbId = 100 + index;
      let style = styleMap[device.type] || styleMap['default'];
      const viewable = new dataVizExtn.SpriteViewable(device.position, style, dbId);

      viewable.sensorType = device.type;
      viewable.remoteId = device.id;
      viewable.name = device.name;
      viewable.sensorTypes = device.sensorTypes;

      viewableData.addViewable(viewable);
    });

    await viewableData.finish();
    return viewableData;
  }

  function generateSurfaceShadingData(dataItems, model) {
    const {
      SurfaceShadingData,
      SurfaceShadingPoint,
      SurfaceShadingNode,
      SurfaceShadingGroup,
    } = Autodesk.DataVisualization.Core;

    function createNode(item) {
      const shadingNode = new SurfaceShadingNode(item.id, item.dbIds);

      item.sensors.forEach((sensor) => {
        // A `SurfaceShadingPoint` represents a physical device (i.e. thermometer) with a position.
        const shadingPoint = new SurfaceShadingPoint(
          sensor.id,
          sensor.position,
          sensor.sensorTypes
        );

        // If the position is not specified during construction, it can be derived from
        // the center of geometry of the sensor is being represented by a valid dbId.
        if (sensor.dbId != undefined && sensor.position == null) {
          shadingPoint.positionFromDBId(model, sensor.dbId);
        }

        shadingNode.addPoint(shadingPoint);
      });

      return shadingNode;
    }

    function createGroup(item) {
      const shadingGroup = new SurfaceShadingGroup(item.id);

      item.children.forEach((child) => {
        if (child.children) {
          shadingGroup.addChild(createGroup(child));
        } else {
          shadingGroup.addChild(createNode(child));
        }
      });

      return shadingGroup;
    }

    const heatmapData = new SurfaceShadingData();
    dataItems.forEach((item) => {
      if (item.children) {
        heatmapData.addChild(createGroup(item));
      } else {
        heatmapData.addChild(createNode(item));
      }
    });

    return heatmapData;
  }

  const maxPlaybackSteps = 100.0;
  function getSensorValue(shadingPoint, sensorType) {
    return getNormalizedSensorValue(shadingPoint.id, sensorType);
  }

  function startAnimation() {
    if (!playbackTimerRef.current && dataVizExtRef.current) {
      playbackCounterRef.current = maxPlaybackSteps - 1;
      playbackTimerRef.current = setInterval(() => {
        // Use 'updateSurfaceShading' for higher frequency updates.
        dataVizExtRef.current.updateSurfaceShading(getSensorValue);

        playbackCounterRef.current--;
        if (!playbackCounterRef.current) {
          clearInterval(playbackTimerRef.current);
          playbackTimerRef.current = null;
        }
      }, 200);
    }
  }
  // const onModelLoaded = async (viewer, data) => {
  //   const dataVizExt = await viewer.loadExtension('Autodesk.DataVisualization', {
  //     useInternal: true,
  //   });
  //   const DATAVIZEXTN = Autodesk.DataVisualization.Core;

  //   const simulationData = generateSimulationData();
  //   const viewableData = await generateViewableData(simulationData);

  //   dataVizExt.addViewables(viewableData);
  //   const onItemClick = (event) => {
  //     console.log(`User has selected sprite with dbId - ${event.dbId}`);
  //   };

  //   viewer.addEventListener(DATAVIZEXTN.MOUSE_CLICK, onItemClick);
  // };

  const onModelLoaded = async (viewer, data) => {
    // load toolbar
    await viewer.loadExtension('ForbiddenCityToolbarExtension');

    // FOR AEC Model data
    let viewerDocument = viewer.model.getDocumentNode().getDocument();
    const aecModelData = await viewerDocument.downloadAecModelData();
    let levelsExt = null;
    if (aecModelData) {
      levelsExt = await viewer.loadExtension('Autodesk.AEC.LevelsExtension');
      await viewer.loadExtension('Autodesk.AEC.LevelsExtension');
    }

    if (levelsExt) {
      levelsExt.floorSelector.selectFloor(0, true);
    }
    // END AEC Model data

    const dataVizExt = await viewer.loadExtension('Autodesk.DataVisualization', {
      useInternal: true,
    });
    const DATAVIZEXTN = Autodesk.DataVisualization.Core;

    // // FOR CAMERAS
    // var styleMap = {};
    // // Create model-to-style map from style definitions
    // Object.entries(SensorStyleDefinitions).forEach(([type, styleDef]) => {
    //   styleMap[type] = new DATAVIZEXTN.ViewableStyle(
    //     DATAVIZEXTN.ViewableType.SPRITE,
    //     new THREE.Color(styleDef.color),
    //     styleDef.url
    //   );
    // });

    // const camViewableData = new DATAVIZEXTN.ViewableData();
    // camViewableData.spriteSize = 50;

    // cameraDevices.forEach((device) => {
    //   let style = styleMap[device.type] || styleMap['default'];
    //   const viewable = new DATAVIZEXTN.SpriteViewable(device.position, style, parseInt(device.id));
    //   camViewableData.addViewable(viewable);
    // });

    // await camViewableData.finish();
    // dataVizExt.addViewables(camViewableData);
    // setDataVizExt(dataVizExt);
    // END CAMERA

    // START HEATMAP
    const simulationData = generateSimulationData();
    const viewableData = await generateViewableData(simulationData);
    // dataVizExt.addViewables(viewableData);

    // FOR SHADING
    const shadingData = generateSurfaceShadingData(simulationData, data.model);

    shadingData.initialize(data.model);
    await dataVizExt.setupSurfaceShading(data.model, shadingData, {
      type: 'PlanarHeatmap',
      placePosition: 'max',
    });

    // // Represents temperature range with three color stops.
    dataVizExt.registerSurfaceShadingColors('temperature', [
      0x0000ff,
      0x00ff00,
      0xffff00,
      0xff0000,
    ]);

    dataVizExt.registerSurfaceShadingColors('humidity', [0x00f260, 0x0575e6]);
    dataVizExt.registerSurfaceShadingColors('CO2', [0x1e9600, 0xfff200, 0xff0000]);

    dataVizExt.renderSurfaceShading(['floor1'], 'temperature', getSensorValue, 300);
    setDataVizExt(dataVizExt);

    // END HEATMAP

    // UTILS and ADD event listeners
    const onItemHover = async (event) => {
      // console.log('Hovered!: ', event.dbId);
      const itemData = dataVizExt.viewableData.viewables.find((v) => v.dbId == event.dbId);

      if (itemData) {
        const position = itemData.position;
        const mappedPosition = viewer.impl.worldToClient(position);

        // Accounting for vertical offset of viewer container.
        const vertificalOffset = event.originalEvent.clientY - event.originalEvent.offsetY;
        setHoveredDeviceInfo({
          id: itemData.dbId,
          sensorType: itemData.sensorType,
          xcoord: mappedPosition.x,
          ycoord:
            mappedPosition.y + vertificalOffset - SpriteSize / viewer.getWindow().devicePixelRatio,
        });
      } else {
        setHoveredDeviceInfo({});
      }
    };

    const onItemClick = (event) => {
      console.log(`User has selected sprite with dbId - ${event.dbId}`);
      const itemData = dataVizExt.viewableData.viewables.find((v) => v.dbId == event.dbId);

      if (itemData?.sensorType === 'camera') {
        const position = itemData.position;
        const mappedPosition = viewer.impl.worldToClient(position);
        const vertificalOffset = event.originalEvent.clientY - event.originalEvent.offsetY;

        const newPanel = new ReactPanel(viewer, {
          id: itemData.remoteId,
          title: itemData.name,
          xcoords: mappedPosition.x,
          ycoords:
            mappedPosition.y + vertificalOffset - SpriteSize / viewer.getWindow().devicePixelRatio,
        });
        newPanel.setVisible(true);
      }

      if (itemData?.sensorType === 'thermometer') {
        console.log('Clicked on thermometer!');
      }
    };

    viewer.addEventListener(DATAVIZEXTN.MOUSE_CLICK, onItemClick);
    viewer.addEventListener(DATAVIZEXTN.MOUSE_HOVERING, onItemHover);

    dataVizExt.addViewables(viewableData);
    // document.getElementsByClassName('textured-heatmap-playbutton')[0].onclick = startAnimation;
    document.getElementsByClassName(
      'textured-heatmap-showhide-button'
    )[0].onclick = camerasVisiblityHandler;
  };

  useEffect(() => {
    if (dataVizExt) {
      dataVizExt.showHideViewables(camerasVisible);
    }
  }, [dataVizExt, camerasVisible]);

  useEffect(() => {
    if (dataVizExt) {
      if (showHeatMap) {
        dataVizExt.renderSurfaceShading(['floor1'], selectedPropertyId, getSensorValue, 300);
      } else {
        dataVizExt.removeSurfaceShading();
      }
    }
  }, [dataVizExt, showHeatMap]);

  return (
    <ResolutionValueContext.Provider value={resolutionVal}>
      <SelectedPropertyIdContext.Provider value={selectedPropertyIdVal}>
        <ShowHeatMapContext.Provider value={showHeatMapVal}>
          <React.Fragment>
            <CustomToolTip hoveredDeviceInfo={hoveredDeviceInfo} />
            <Viewer onModelLoaded={onModelLoaded} />
            <HeatmapOptions />
            <img
              className='logo'
              src={wspLogoPng}
              style={{
                width: '5%',
                bottom: '12px',
                position: 'absolute',
                zIndex: 2,
                left: '75px',
                opacity: 0.7,
              }}
            ></img>
          </React.Fragment>
        </ShowHeatMapContext.Provider>
      </SelectedPropertyIdContext.Provider>
    </ResolutionValueContext.Provider>
  );
};

export default ForbiddenCity;
