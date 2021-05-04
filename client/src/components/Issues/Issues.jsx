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
const SERVER_URL = process.env.REACT_APP_API_ROUTE;

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
      _id: '123123123',
      id: '1',
      title: 'issue 1',
      description: 'test iussue 1 desctription',
      assignedTo: 'FROM REACT',
      position: {
        x: -15.0,
        y: -19.0,
        z: 2,
      },
    },
    {
      _id: '198971832',
      id: '2',
      title: 'issue 2',
      description: 'test description for issue 2',
      assignedTo: 'FROM REACT',
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

  const [newCreatedElement, setNewCreatedElement] = useState({});
  const [tempNewCreatedElement, setTempNewCreatedElement] = useState({});

  const dataVizExtRef = useRef(null);
  dataVizExtRef.current = dataVizExt;

  const issuesVisibilityHandler = () => {
    setIssuesVisible((prevIssuesVisible) => !prevIssuesVisible);
  };

  const createIssueHandler = () => {
    setCreateIssueBool((prevCreateIssueBool) => !prevCreateIssueBool);
  };

  const issuesValue = useMemo(() => ({ issuesList, setIssuesList }), [issuesList, setIssuesList]);

  // get issues
  useEffect(() => {
    getIssues();
  }, []);

  const getIssues = async () => {
    const issueResult = await axios.get(`${SERVER_URL}/issues`);
    console.log(issueResult);
    // console.log(issueResult.data);
    issueResult.data.map((issue) => {
      const temp = {
        creator: issue.googleUser,
        _id: issue._id,
        id: issue.id,
        title: issue.title,
        description: issue.description,
        assignedTo: issue.assignedTo,
        selectedFile: issue.selectedFile,
        comments: issue.comments,
        position: {
          x: issue.xpos,
          y: issue.ypos,
          z: issue.zpos,
        },
      };
      setIssuesList((issuesList) => [...issuesList, temp]);
    });
  };
  const generateViewableData = async () => {
    // console.log(issuesList);
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
      // console.log(issue);
      const dbId = 100 + index;
      // let style = styleMap[issue.type] || styleMap['default'];
      if (issue.position.x) {
        const viewable = new dataVizExtn.SpriteViewable(issue.position, styleMap['default'], dbId);
        viewable.title = issue.title;
        viewable._id = issue._id;
        viewable.id = issue.id;
        viewable.title = issue.title;
        viewable.description = issue.description;
        viewable.assignedTo = issue.assignedTo;
        viewable.selectedFile = issue.selectedFile;
        viewable.comments = issue.comments;
        viewableData.addViewable(viewable);
      }
    });
    await viewableData.finish();
    return viewableData;
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
    console.log(dataVizExt);
    console.log(DATAVIZEXTN);
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

      const itemData = dataVizExt?.viewableData?.viewables.find((v) => v.dbId == event.dbId);
      if (itemData) {
        console.log(itemData);
      }
    };

    const onItemClickOut = (event) => {
      // console.log('Clicked out! Creating a new issue pin.');
      // setNewCreatedElement({});
      let viewerImpl = viewer.impl;
      const vpVec = viewerImpl.clientToViewport(
        event.originalEvent.canvasX,
        event.originalEvent.canvasY
      );
      let test = viewerImpl.hitTestViewport(vpVec, false);
      console.log(test?.point);
      if (test?.point) {
        // point must be within model. aka !undefined
        // console.log('creating new issue!');
        const newElement = {
          id: test.point.x,
          title: 'test issue',
          position: {
            x: test.point.x,
            y: test.point.y,
            z: test.point.z,
          },
        };
        // console.log('adding... ');
        // console.log(newElement);
        setNewCreatedElement(newElement);
      }
    };

    const onItemHover = (event) => {
      const itemData = dataVizExt?.viewableData?.viewables.find((v) => v.dbId == event.dbId);
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

    // if (issuesVisible) {
    //   await dataVizExt.addViewables(viewableData);
    // }

    document.getElementsByClassName('show-hide-issues-button')[0].onclick = issuesVisibilityHandler;
    document.getElementsByClassName('create-new-issue-button')[0].onclick = createIssueHandler;
  };

  useEffect(() => {
    // console.log(issuesList);
    const testFun = async () => {
      const result = await generateViewableData();
      if (issuesVisible) {
        dataVizExt.addViewables(result);
      }
      if (dataVizExt) {
        dataVizExt.showHideViewables(issuesVisible);
      }
      // console.log(result);
    };
    if (dataVizExt) {
      testFun();
    }
  }, [issuesList, issuesVisible]);

  // useEffect(() => {
  //   console.log(issuesList);
  //   if (dataVizExt) {
  //     dataVizExt.showHideViewables(issuesVisible);
  //   }
  // }, [dataVizExt, issuesVisible]);

  // useEffect(() => {
  //   console.log(createIssueBool);
  //   if (dataVizExt) {
  //     dataVizExt.showHideViewables(true);
  //   }
  // }, [createIssueBool]);

  useEffect(() => {
    console.log(newCreatedElement);
    if (createIssueBool) {
      console.log('creating new!');
      // need to figure out how to only create one element

      // can delete the last one?
      setTempNewCreatedElement(newCreatedElement);
      setIssuesList((issuesList) => [...issuesList, newCreatedElement]);
      createIssueHandler();
    } else {
      // setNewCreatedElement({}); // this breaks the browser!!
      console.log('creating new is off. or there is alread');
    }
  }, [newCreatedElement]);

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
              <CreateIssueForm newCreatedElement={tempNewCreatedElement} />
            </Grid>
          </Grid>
          {createIssueBool && <div>Creating a new issue!</div>}
        </Container>
      </Grow>
    </IssuesContext.Provider>
  );
};

export default Issues;
