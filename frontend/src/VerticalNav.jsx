import React from 'react';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'typeface-roboto';
import Logo from './brain.png';

import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
    component="div"
    role="tabpanel"
    hidden={value !== index}
    id={`vertical-tabpanel-${index}`}
    aria-labelledby={`vertical-tab-${index}`}
    {...other}
    >
    {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};
function a11yProps(index) {
  return {
    id: `vertical-tab-${index}`,
    'aria-controls': `vertical-tabpanel-${index}`,
  };
}

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    height: '90vh',
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));

export default function MainApp() {
  const classes = useStyles();
  const [value, setValue] = React.useState(1);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
    <Tabs
    orientation="vertical"
    variant="scrollable"
    value={value}
    initialSelectedIndex='2'
    onChange={handleChange}
    aria-label="Vertical tabs example"
    className={classes.tabs}
    >
      <img src={Logo} alt="Logo"/>
      <Tab label="Item One" {...a11yProps(1)} />
      <Tab label="Item Two" {...a11yProps(2)} />
      <Tab label="Item Three" {...a11yProps(3)} />
      {/*<img src={Logo} alt="Logo" width="176px" height="176px"/>*/}
      {/*<Tab label="Disabled" disabled="True" {...a11yProps(-1)} />*/}
    </Tabs>

    <TabPanel value={value} index={1}>
    <App />
    </TabPanel>
    <TabPanel value={value} index={2}>
    Item Two
    </TabPanel>
    <TabPanel value={value} index={3}>
    Item Three
    </TabPanel>
    </div>
  );
}
