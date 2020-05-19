import React, { Component } from "react";

import PropTypes from "prop-types";

import { BrowserRouter, Switch, Redirect, Route, Link } from "react-router-dom";

import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
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

class Router extends Component {
  constructor(props) {
    super(props);

    this.state = {currentRoute : 0}

  }

  render() {
    // Properties
    const { user, roles, bar } = this.props;

    // Functions
    const { openSnackbar } = this.props;
    const uid = user && user.uid ?  user.uid : null
    return (
      <BrowserRouter basename={process.env.REACT_APP_BASENAME}>
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

        <BottomNavigation
      value={this.state.currentRoute}
      style={styles.root}
      onChange={(e,value)=> this.setState({currentRoute : value})}
      showLabels
    >
     <Link to={ `/`}> <BottomNavigationAction label="My Board" icon={ <HomeIcon />} /> </Link>
     <BottomNavigationAction label="Commandments" icon={<Link to={ `/Commandments`}><CIcon /></Link>} /> 
     <BottomNavigationAction label="Geo Boards" icon={<Link to={ `/Boards`}><MapIcon /> </Link>} /> 
      

    </BottomNavigation>
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
