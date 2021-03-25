/*global Autodesk, THREE*/
import React, { useState, useMemo, useEffect, useRef, useContext } from 'react';
import { ResolutionValueContext, SelectedPropertyIdContext, ShowHeatMapContext } from './ForbiddenContext';

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

const SensorStyleDefinitions = {
  temperature: {
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

Autodesk.Viewing.theExtensionManager.registerExtension('ForbiddenCityToolbarExtension', ForbiddenCityToolbarExtension);

const getNormalizedSensorValue = function (sensorName, sensorType) {
  // Returns a normalized value based on the min/max temperatures
  return Math.random();
};

const ForbiddenCity = () => {
  // Context setup
  const [resolutionValue, setResolutionValue] = useState('PT1H');
  const [selectedPropertyId, setSelectedPropertyId] = useState('Temperature');
  const [showHeatMap, setShowHeatMap] = useState(true);

  const resolutionVal = useMemo(() => ({ resolutionValue, setResolutionValue }), [resolutionValue, setResolutionValue]);
  const selectedPropertyIdVal = useMemo(() => ({ selectedPropertyId, setSelectedPropertyId }), [
    selectedPropertyId,
    setSelectedPropertyId,
  ]);
  const showHeatMapVal = useMemo(() => ({ showHeatMap, setShowHeatMap }), [showHeatMap, setShowHeatMap]);
  // End Context setup

  const [dataVizExt, setDataVizExt] = useState(null);
  const [camerasVisible, setCamerasVisible] = useState(true);
  const [shadingVisible, setShadingVisible] = useState(false);

  const dataVizExtRef = useRef(null);
  dataVizExtRef.current = dataVizExt;

  const playbackTimerRef = useRef(null);
  const playbackCounterRef = useRef(0);

  const camerasVisiblityHandler = () => {
    setCamerasVisible((prevCamerasVisible) => !prevCamerasVisible);
  };

  const shadingVisiblityHandler = () => {
    setShadingVisible((prevShadingVisible) => !prevShadingVisible);
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

    return [simulationData];
  }

  async function generateViewableData(dataItems) {
    // Create a visual style shared by all the thermometers since they're the same type.
    const deviceType = 'thermometer';
    const styleColor = 0xffffff;
    const styleIconUrl = tempSVG;
    const dataVizExtn = Autodesk.DataVisualization.Core;

    const thermStyle = new dataVizExtn.ViewableStyle(
      dataVizExtn.ViewableType.SPRITE,
      new THREE.Color(styleColor),
      styleIconUrl
    );

    const viewableData = new dataVizExtn.ViewableData();
    viewableData.spriteSize = 16;

    const devices = [];
    const dataItem = dataItems[0];

    dataItem.sensors.forEach((sensor) => {
      devices.push({
        id: sensor.id,
        position: sensor.position,
        type: sensor.type,
      });
    });

    let viewableDbId = 1;
    devices.forEach((device) => {
      const viewable = new dataVizExtn.SpriteViewable(device.position, thermStyle, viewableDbId);
      viewableData.addViewable(viewable);
      viewableDbId++;
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
        const shadingPoint = new SurfaceShadingPoint(sensor.id, sensor.position, sensor.sensorTypes);

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
    console.log(dataVizExt);
    const DATAVIZEXTN = Autodesk.DataVisualization.Core;

    // FOR CAMERAS
    var styleMap = {};
    // Create model-to-style map from style definitions
    Object.entries(SensorStyleDefinitions).forEach(([type, styleDef]) => {
      styleMap[type] = new DATAVIZEXTN.ViewableStyle(
        DATAVIZEXTN.ViewableType.SPRITE,
        new THREE.Color(styleDef.color),
        styleDef.url
      );
    });

    const camViewableData = new DATAVIZEXTN.ViewableData();
    camViewableData.spriteSize = 24;

    devices.forEach((device) => {
      let style = styleMap[device.type] || styleMap['default'];
      const viewable = new DATAVIZEXTN.SpriteViewable(device.position, style, parseInt(device.id));
      camViewableData.addViewable(viewable);
    });

    await camViewableData.finish();
    dataVizExt.addViewables(camViewableData);
    // setDataVizExt(dataVizExt);
    // if (camerasVisible) {
    //   console.log('Cameras added!');
    //   dataVizExt.addViewables(camViewableData);
    // } else {
    //   console.log('Cameras removed');
    //   dataVizExt.removeViewables();
    // }

    const onItemClick = (event) => {
      console.log(event);
      const newPanel = new ReactPanel(viewer, {
        id: event.dbId,
        title: 'Video stream',
      });
      newPanel.setVisible(true);
    };
    // END CAMERA

    // START HEATMAP
    const simulationData = generateSimulationData();

    const viewableData = await generateViewableData(simulationData);
    console.log(viewableData);
    console.log(camViewableData);
    dataVizExt.addViewables(viewableData);

    const shadingData = generateSurfaceShadingData(simulationData, data.model);
    shadingData.initialize(data.model);
    await dataVizExt.setupSurfaceShading(data.model, shadingData, {
      type: 'PlanarHeatmap',
      placePosition: 'max',
    });

    // // Represents temperature range with three color stops.
    dataVizExt.registerSurfaceShadingColors('temperature', [0x0000ff, 0x00ff00, 0xffff00, 0xff0000]);

    dataVizExt.renderSurfaceShading(['floor1'], 'temperature', getSensorValue, 300);
    setDataVizExt(dataVizExt);

    // // Zoom in for better view of the heatmap
    viewer.fitToView([simulationData[0].dbIds]);

    // END HEATMAP

    // UTILS and ADD event listeners
    const onItemHover = (event) => {
      // console.log('Hovered!: ', event.dbId);
    };
    // const DataVizCore = Autodesk.DataVisualization.Core;
    viewer.addEventListener(DATAVIZEXTN.MOUSE_CLICK, onItemClick);
    viewer.addEventListener(DATAVIZEXTN.MOUSE_HOVERING, onItemHover);

    // document.getElementsByClassName('textured-heatmap-playbutton')[0].onclick = shadingVisiblityHandler;
    document.getElementsByClassName('textured-heatmap-playbutton')[0].onclick = startAnimation;
    document.getElementsByClassName('textured-heatmap-showhide-button')[0].onclick = camerasVisiblityHandler;
  };

  useEffect(() => {
    if (dataVizExt) {
      console.log(dataVizExt);
      dataVizExt.showHideViewables(camerasVisible);
    }
  }, [dataVizExt, camerasVisible]);

  return (
    <ResolutionValueContext.Provider value={resolutionVal}>
      <SelectedPropertyIdContext.Provider value={selectedPropertyIdVal}>
        <ShowHeatMapContext.Provider value={showHeatMapVal}>
          <React.Fragment>
            <Viewer onModelLoaded={onModelLoaded} />
            <HeatmapOptions />
            <img
              className='logo'
              src={wspLogoPng}
              style={{ width: '5%', bottom: '12px', position: 'absolute', zIndex: 2, left: '75px', opacity: 0.7 }}
            ></img>
          </React.Fragment>
        </ShowHeatMapContext.Provider>
      </SelectedPropertyIdContext.Provider>
    </ResolutionValueContext.Provider>
  );
};

export default ForbiddenCity;
