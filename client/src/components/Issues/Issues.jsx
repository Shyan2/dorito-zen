/*global Autodesk, THREE*/
import React, { useState, useEffect, useRef, useMemo } from 'react';
import useStyles from './styles';
import { Container, Grid, Grow, Button } from '@material-ui/core';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import Collapse from '@material-ui/core/Collapse';
import Loader from '../Utils/Loader';
import wspLogoPng from '../../assets/images/Asset 16.png';

import axios from 'axios';

import CreateIssueForm from './CreateIssueForm';
import IssueGrid from './IssueGrid';
import IssuesExtensionToolbar from './IssuesExtension';
import IssuesInfo from './IssuesInfo';
import Viewer from './Viewer';
import TabPanel from './TabPanel';
import IssueToolTip from './IssueToolTip';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';

import { IssuesContext } from './Context';

// import issuesList from './issuesList';
import defaultSVG from '../../assets/icons/circle.svg';
import { classnames } from '@material-ui/data-grid';
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
  const classes = useStyles();
  const [issuesList, setIssuesList] = useState([]);
  const [issues, setIssues] = useState(null);
  const [tabValue, setTabValue] = useState(0);

  const [isLoading, setIsLoading] = useState(true);

  const [dataVizExt, setDataVizExt] = useState(null);
  const [issuesVisible, setIssuesVisible] = useState(false);
  const [toolbarVisible, setToolbarVisible] = useState(false);
  const [createIssueBool, setCreateIssueBool] = useState(false);
  const [hoveredDeviceInfo, setHoveredDeviceInfo] = useState({});

  const [newCreatedElement, setNewCreatedElement] = useState({});
  const [tempNewCreatedElement, setTempNewCreatedElement] = useState({});

  const [alertOpen, setAlertOpen] = useState(false);

  const [selectedIssue, setSelectedIssue] = useState(null);

  const dataVizExtRef = useRef(null);
  dataVizExtRef.current = dataVizExt;

  const issuesVisibilityHandler = () => {
    setIssuesVisible((prevIssuesVisible) => !prevIssuesVisible);
  };

  const createIssueHandler = () => {
    setCreateIssueBool((prevCreateIssueBool) => !prevCreateIssueBool);
  };

  const toolbarVisibilityHandler = () => {
    setToolbarVisible((prevToolbarVisible) => !prevToolbarVisible);
  };

  const issuesValue = useMemo(() => ({ issuesList, setIssuesList }), [issuesList, setIssuesList]);

  // get issues
  useEffect(() => {
    getIssues();
  }, []);

  const getIssues = async () => {
    setIsLoading(true);
    const issueResult = await axios.get(`${SERVER_URL}/issues`);
    console.log(issueResult);
    // console.log(issueResult.data);
    let tempIssuesList = [];
    issueResult.data.map((issue) => {
      const temp = {
        creatorId: issue.creatorId,
        creatorName: issue.creatorName,
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
      tempIssuesList.push(temp);
      // setIssuesList((issuesList) => [...issuesList, temp]);
    });
    setIssuesList(tempIssuesList);
    // setIsLoading(false);
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
        viewable.creator = issue.creatorName;
        viewableData.addViewable(viewable);
      }
    });
    await viewableData.finish();
    return viewableData;
  };

  const onModelLoaded = async (viewer, data) => {
    // TEST
    // viewer.impl.renderer().setClearAlpha(0);
    // viewer.impl.glrenderer().setClearColor(0xffffff, 0);
    // viewer.impl.invalidate(true);
    // END TEST
    // setIsLoading(true);

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

      const itemData = dataVizExt?.viewableData?.viewables.find((v) => v.dbId == event.dbId);
      if (itemData) {
        console.log(itemData);
        setSelectedIssue(itemData);
      } else {
        setSelectedIssue(null);
      }
    };

    const onItemClickOut = (event) => {
      // console.log('Clicked out! Creating a new issue pin.');
      // setNewCreatedElement({});
      setSelectedIssue(null);
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
          _id: test.point.x,
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

    // document.getElementsByClassName('show-hide-issues-button')[0].onclick = issuesVisibilityHandler;
    // document.getElementsByClassName('create-new-issue-button')[0].onclick = createIssueHandler;

    setIsLoading(false);
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
      // createIssueHandler();
    } else {
      // setNewCreatedElement({}); // this breaks the browser!!
      console.log('creating new is off.');
    }
  }, [newCreatedElement]);

  //TEST
  useEffect(() => {
    console.log(selectedIssue);
  }, [selectedIssue]);
  // END TEST

  // Checks if user is logged in when pressing on Create Issue
  const createIssueBtn = async () => {
    try {
      const result = await axios.get(`${SERVER_URL}/api/google/profile`, {
        withCredentials: true,
      });
      console.log(result.data);
      if (result?.data?.code === 401) {
        setAlertOpen(true);
        console.log('user does not exist');
      } else {
        createIssueHandler();
      }
    } catch (error) {
      console.log(error);
      setAlertOpen(true);
    }
  };

  return (
    <IssuesContext.Provider value={issuesValue}>
      <Grow in>
        <Container maxWidth={false} disableGutters>
          <div className={classes.alert}>
            <Collapse in={alertOpen}>
              <Alert
                severity='error'
                action={
                  <IconButton
                    aria-label='close'
                    color='inherit'
                    size='small'
                    onClick={() => {
                      setAlertOpen(false);
                    }}
                  >
                    <CloseIcon fontSize='inherit' />
                  </IconButton>
                }
              >
                You must be logged in to create an issue.
              </Alert>
            </Collapse>
          </div>
          <Grid container style={{ paddingRight: 10 }}>
            <Grid item sm={12} lg={9}>
              <IssueToolTip hoveredDeviceInfo={hoveredDeviceInfo} />
              <Viewer onModelLoaded={onModelLoaded} />
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
            </Grid>
            <Grid item sm={5} lg={3}>
              <Button onClick={() => issuesVisibilityHandler()}>
                {issuesVisible ? 'Hide' : 'Show'} Issues
              </Button>
              <Button onClick={() => toolbarVisibilityHandler()}>
                {toolbarVisible ? 'Hide' : 'Show'} Toolbar
              </Button>
              {!isLoading ? (
                createIssueBool ? (
                  <div>
                    <Button
                      onClick={() => {
                        createIssueHandler();
                      }}
                    >
                      Cancel
                    </Button>
                    <CreateIssueForm newCreatedElement={tempNewCreatedElement} />
                  </div>
                ) : (
                  <div>
                    <Button
                      onClick={() => {
                        !issuesVisible && issuesVisibilityHandler();
                        createIssueBtn();
                      }}
                    >
                      Create issue
                    </Button>
                    {selectedIssue ? <IssuesInfo selectedIssue={selectedIssue} /> : <IssueGrid />}
                  </div>
                )
              ) : (
                <Loader />
              )}
            </Grid>
          </Grid>
        </Container>
      </Grow>
    </IssuesContext.Provider>
  );
};

export default Issues;
