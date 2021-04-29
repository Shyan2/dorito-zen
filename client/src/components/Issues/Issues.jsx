/*global Autodesk, THREE*/
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Container, Grid, Grow, Button } from '@material-ui/core';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';

import axios from 'axios';

import CreateIssueForm from './CreateIssueForm';
import IssueGrid from './IssueGrid';
import IssuesExtensionToolbar from './IssuesExtension';
import Viewer from './Viewer';
import TabPanel from './TabPanel';
import IssueToolTip from './IssueToolTip';

import { IssuesContext } from './Context';

// import issuesList from './issuesList';
import defaultSVG from '../../assets/icons/circle.svg';

const SpriteSize = 32;

const SensorStyleDefinitions = {
  default: {
    url: defaultSVG,
    color: 0xffffff,
  },
};

Autodesk.Viewing.theExtensionManager.registerExtension(
  'IssuesExtensionToolbar',
  IssuesExtensionToolbar
);

const Issues = () => {
  const [issuesList, setIssuesList] = useState([
    {
      id: '1',
      title: 'issue 1',
      position: {
        x: -15.0,
        y: -19.0,
        z: 2,
      },
    },
    {
      id: '2',
      title: 'issue 2',
      position: {
        x: -33.0,
        y: -32.0,
        z: 2,
      },
    },
  ]);
  const [issues, setIssues] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  const [dataVizExt, setDataVizExt] = useState(null);
  const [issuesVisible, setIssuesVisible] = useState(false);
  const [createIssueBool, setCreateIssueBool] = useState(false);
  const [hoveredDeviceInfo, setHoveredDeviceInfo] = useState({});

  const dataVizExtRef = useRef(null);
  dataVizExtRef.current = dataVizExt;

  const issuesVisibilityHandler = () => {
    setIssuesVisible((prevIssuesVisible) => !prevIssuesVisible);
    console.log(issuesVisible);
  };

  const createIssueHandler = () => {
    setCreateIssueBool((prevCreateIssueBool) => !prevCreateIssueBool);
  };

  const issuesValue = useMemo(() => ({ issues, setIssues }), [issues, setIssues]);
  // get issues
  useEffect(() => {
    getIssues();
  }, []);

  const generateViewableData = async () => {
    console.log(issuesList);
    const dataVizExtn = Autodesk.DataVisualization.Core;

    // STYLES
    let styleMap = {};
    Object.entries(SensorStyleDefinitions).forEach(([type, styleDef]) => {
      styleMap[type] = new dataVizExtn.ViewableStyle(
        dataVizExtn.ViewableType.SPRITE,
        new THREE.Color(styleDef.color),
        styleDef.url
      );
    });
    // END STYLES
    const viewableData = new dataVizExtn.ViewableData();
    viewableData.spriteSize = SpriteSize;

    issuesList.forEach((issue, index) => {
      console.log(issue);
      const dbId = 100 + index;
      // let style = styleMap[issue.type] || styleMap['default'];
      const viewable = new dataVizExtn.SpriteViewable(issue.position, styleMap['default'], dbId);

      viewable.title = issue.title;

      viewableData.addViewable(viewable);
    });
    await viewableData.finish();
    return viewableData;
  };

  const getIssues = async () => {
    const issueResult = await axios.get('http://localhost:9001/issues');
    console.log(issueResult);
    setIssues(issueResult.data);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const onModelLoaded = async (viewer, data) => {
    // LOAD EXTENSIONS
    await viewer.loadExtension('IssuesExtensionToolbar');
    const dataVizExt = await viewer.loadExtension('Autodesk.DataVisualization', {
      useInternal: true,
    });

    const DATAVIZEXTN = Autodesk.DataVisualization.Core;
    // END LOAD EXTENSIONS

    // LOAD SPRITES(ISSUES)
    const viewableData = await generateViewableData();
    setDataVizExt(dataVizExt);
    // END LOAD SPRITES(ISSUES)

    const onItemClick = (event) => {
      console.log(event);
      let viewerImpl = viewer.impl;
      const vpVec = viewerImpl.clientToViewport(
        event.originalEvent.canvasX,
        event.originalEvent.canvasY
      );

      let test = viewerImpl.hitTestViewport(vpVec, false);
      // console.log('Item clicked!');
      console.log(test);
    };

    const onItemClickOut = async (event) => {
      console.log('Clicked out! Creating a new issue pin.');
      let viewerImpl = viewer.impl;
      const vpVec = viewerImpl.clientToViewport(
        event.originalEvent.canvasX,
        event.originalEvent.canvasY
      );
      let test = viewerImpl.hitTestViewport(vpVec, false);
      console.log(test?.point);
      if (test?.point) {
        // point must be within model. aka !undefined
        console.log('creating new issue!');
        const newElement = {
          id: test.point.x,
          title: 'test issue',
          position: {
            x: test.point.x,
            y: test.point.y,
            z: test.point.z,
          },
        };
        console.log('adding... ');
        console.log(newElement);
        setIssuesList((issuesList) => [...issuesList, newElement]);
        // console.log(issuesList);
      }
      // const newViewableData = await generateViewableData();
      // console.log(newViewableData);
      // await dataVizExt.addViewables(newViewableData);
    };

    const onItemHover = (event) => {
      const itemData = dataVizExt.viewableData.viewables.find((v) => v.dbId == event.dbId);
      if (itemData) {
        const position = itemData.position;
        const mappedPosition = viewer.impl.worldToClient(position);

        // Accounting for vertical offset of viewer container.
        const vertificalOffset = event.originalEvent.clientY - event.originalEvent.offsetY;
        setHoveredDeviceInfo({
          id: itemData.dbId,
          title: itemData.title,
          xcoord: mappedPosition.x,
          ycoord:
            mappedPosition.y + vertificalOffset - SpriteSize / viewer.getWindow().devicePixelRatio,
        });
      } else {
        setHoveredDeviceInfo({});
      }
    };
    viewer.addEventListener(DATAVIZEXTN.MOUSE_CLICK, onItemClick);
    viewer.addEventListener(DATAVIZEXTN.MOUSE_CLICK_OUT, onItemClickOut);
    viewer.addEventListener(DATAVIZEXTN.MOUSE_HOVERING, onItemHover);

    await dataVizExt.addViewables(viewableData);
    document.getElementsByClassName('show-hide-issues-button')[0].onclick = issuesVisibilityHandler;
    document.getElementsByClassName('create-new-issue-button')[0].onclick = createIssueHandler;
  };

  useEffect(() => {
    console.log(issuesList);
    const testFun = async () => {
      const result = await generateViewableData();
      dataVizExt.addViewables(result);
      // console.log(result);
    };
    if (dataVizExt) {
      testFun();
    }
  }, [issuesList]);

  useEffect(() => {
    if (dataVizExt) {
      dataVizExt.showHideViewables(issuesVisible);
    }
  }, [dataVizExt, issuesVisible]);

  useEffect(() => {
    console.log(createIssueBool);
    if (dataVizExt) {
      dataVizExt.showHideViewables(true);
    }
  }, [createIssueBool]);

  return (
    <IssuesContext.Provider value={issuesValue}>
      <Grow in>
        <Container maxWidth={false}>
          <Grid container>
            <Grid item sm={12} lg={9}>
              <Tabs
                value={tabValue}
                indicatorColor='secondary'
                textColor='secondary'
                onChange={handleTabChange}
                aria-label='tabs'
                variant='fullWidth'
              >
                <Tab label='Main' />
                <Tab label='Table' />
              </Tabs>
              <TabPanel value={tabValue} index={0}>
                <IssueToolTip hoveredDeviceInfo={hoveredDeviceInfo} />
                <Viewer onModelLoaded={onModelLoaded} />
              </TabPanel>
              <TabPanel value={tabValue} index={1}>
                <IssueGrid />
              </TabPanel>
            </Grid>
            <Grid item sm={5} lg={3}>
              <CreateIssueForm />
            </Grid>
          </Grid>
        </Container>
      </Grow>
    </IssuesContext.Provider>
  );
};

export default Issues;
