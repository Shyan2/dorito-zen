import GlobalStyles from './theme/GlobalStyles';
import { ThemeProvider } from '@material-ui/core';
import { Container } from '@material-ui/core';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from './components/Home/Home';
import Auth from './components/Auth/Auth';
import DigitalTwin from './components/DigitalTwin/DigitalTwin';
import Models from './components/Forge/Models/Models';
import theme from './theme';
import useStyles from './styles';

const App = () => {
  const classes = useStyles();
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <div className={classes.root}>
        <BrowserRouter>
          <Container maxWidth={false}>
            <Navbar />
            <Switch>
              <Route path='/' exact component={Home} />
              <Route path='/auth' exact component={Auth} />
              <Route path='/models' exact component={Models} />
              <Route path='/IoT' exact component={DigitalTwin} />
            </Switch>
          </Container>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
};

export default App;
