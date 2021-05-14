import GlobalStyles from './theme/GlobalStyles';
import { ThemeProvider } from '@material-ui/core';
import { Container } from '@material-ui/core';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import Auth from './components/Auth/Auth';
import PowerBI from './components/PowerBI/PowerBI';
import Models from './components/Forge/Main/Models';
import theme from './theme';
import useStyles from './styles';
import ForbiddenCity from './components/ForbiddenCity/ForbiddenCity';
import GDrive from './components/GDrive/GDrive';
import QuantityTakeOff from './components/QuantityTakeOff/QuantityTakeOff';
import Issues from './components/Issues/Issues';

import React, { useState, useMemo, useEffect, useRef, useContext } from 'react';
import { ProjectIdContext } from './Context';

const App = () => {
  const classes = useStyles();

  // setup global project context
  const [projectId, setProjectId] = useState('All');
  const projectIdVal = useMemo(() => ({ projectId, setProjectId }), [projectId, setProjectId]);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <div className={classes.root}>
        <BrowserRouter>
          <Container maxWidth={false} className={classes.container}>
            <ProjectIdContext.Provider value={projectIdVal}>
              <Navbar />
              <Switch>
                <Route path='/' exact component={Home} />
                <Route path='/auth' exact component={Auth} />
                <Route path='/models' exact component={Models} />
                <Route path='/powerBI' exact component={PowerBI} />
                <Route path='/forbiddenCity' exact component={ForbiddenCity} />
                <Route path='/gdrive' exact component={GDrive} />
                <Route path='/qto' exact component={QuantityTakeOff} />
                <Route path='/issues' exact component={Issues} />
              </Switch>
            </ProjectIdContext.Provider>
          </Container>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
};

export default App;
