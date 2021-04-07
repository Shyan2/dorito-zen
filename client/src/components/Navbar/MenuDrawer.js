import useStyles from './styles';
import clsx from 'clsx';

import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import DashboardIcon from '@material-ui/icons/Dashboard';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';
import DomainIcon from '@material-ui/icons/Domain';
import BarChartIcon from '@material-ui/icons/BarChart';
import SettingsIcon from '@material-ui/icons/Settings';
import BlockIcon from '@material-ui/icons/Block';
import FolderIcon from '@material-ui/icons/Folder';

import { Link } from 'react-router-dom';

const MenuDrawer = ({ open }) => {
  const classes = useStyles();

  return (
    <Drawer
      variant='permanent'
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: open,
        [classes.drawerClose]: !open,
      })}
      classes={{
        paper: clsx({
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        }),
      }}
    >
      <div className={classes.toolbar}></div>
      <Divider />

      <List>
        <ListItem button key='1' component={Link} to='/'>
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText>Dashboard</ListItemText>
        </ListItem>

        <ListItem button key='2' component={Link} to='/models'>
          <ListItemIcon>
            <DomainIcon />
          </ListItemIcon>
          <ListItemText>Models</ListItemText>
        </ListItem>

        <ListItem button key='3' component={Link} to='/powerBI'>
          <ListItemIcon>
            <BarChartIcon />
          </ListItemIcon>
          <ListItemText>PowerBI</ListItemText>
        </ListItem>

        <ListItem button key='4' component={Link} to='/forbiddenCity'>
          <ListItemIcon>
            <BlockIcon />
          </ListItemIcon>
          <ListItemText>Forbidden</ListItemText>
        </ListItem>

        <ListItem button key='5' component={Link} to='/gdrive'>
          <ListItemIcon>
            <FolderIcon />
          </ListItemIcon>
          <ListItemText>GDrive</ListItemText>
        </ListItem>
      </List>

      <Divider />

      <List>
        <ListItem button disabled={true}>
          <ListItemIcon>
            <SupervisorAccountIcon />
          </ListItemIcon>
          <ListItemText>Admin</ListItemText>
        </ListItem>

        <ListItem button disabled={true}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText>Settings</ListItemText>
        </ListItem>
      </List>
    </Drawer>
  );
};

export default MenuDrawer;
