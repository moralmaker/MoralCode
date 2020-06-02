import React, { Component } from "react";

import PropTypes from "prop-types";

import { BrowserRouter, Switch, Redirect, Route, Link } from "react-router-dom";

import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import HomeIcon from '@material-ui/icons/Home';
import CIcon from '@material-ui/icons/MenuBook';
import MapIcon from '@material-ui/icons/Map';

import Home from "../Home";
import Commandments from "../Commandments";
import Boards from "../Boards";
//import HomeContent from "../HomeContent";
import AdminContent from "../AdminContent";
import UserContent from "../UserContent";
import NotFoundContent from "../NotFoundContent";

const styles = {
  root: {
    position: 'fixed',
    width : '100%',
    bottom: 0,
    display: 'flex',
    flexDirection: 'row',
    zIndex:50
  },
};
const accentColor = "#5cb7b7";

class Router extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentRoute : 0,
      isTourOpen: false
    }

  }

  closeTour = () => {
    this.setState({
      isTourOpen: false
    });
  };

  openTour = () => {
    this.setState({
      isTourOpen: true
    });
  };

  render() {
    // Properties
    const { user, roles, bar } = this.props;

    const onClick = (e,value) => this.setState({currentRoute : value})
    // Functions
    const { openSnackbar } = this.props;
    const uid = user && user.uid ?  user.uid : null
    return (
      <BrowserRouter >
        {bar}
        <Switch>
          <Route path="/" exact>
            <Home user={user} openSnackbar={openSnackbar} />
          </Route>
          <Route path="/commandments" exact>
            <Commandments uid={uid} openSnackbar={openSnackbar} />
          </Route>
          <Route path="/boards" exact>
            <Boards uid={uid} openSnackbar={openSnackbar} />
          </Route>                    

          <Route path="/admin">
            {user && roles.includes("admin") ? (
              <AdminContent />
            ) : (
              <Redirect to="/" />
            )}
          </Route>

          <Route path="/user/:userId">
            {user ? <UserContent /> : <Redirect to="/" />}
          </Route>

          <Route>
            <NotFoundContent />
          </Route>
        </Switch>
     

    { user &&
      <BottomNavigation
        value={this.state.currentRoute}
        style={styles.root}
        onChange={onClick}
        showLabels
      >
    {user && !user.tour && <Box display="flex" flexGrow={-1}>
        <Button color='primary' onClick={this.openTour}> Tour </Button>
      </Box>
      }         
      <BottomNavigationAction component={Link} to="/"  label="My Board" icon={ <HomeIcon />} data-tut="personal" /> 
      <BottomNavigationAction component={Link} to="/commandments" label="Commandments" icon={<CIcon />} data-tut="commandments" /> 
      <BottomNavigationAction component={Link} to="/boards" label="Geo Boards" icon={<MapIcon />} data-tut="boards"/> 
        

      </BottomNavigation>
    }
     
   </BrowserRouter>
    );
  }
}

Router.propTypes = {
  // Properties
  user: PropTypes.object,
  roles: PropTypes.array.isRequired,
  bar: PropTypes.element,

  // Functions
  openSnackbar: PropTypes.func.isRequired
};

export default Router;
