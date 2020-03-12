import React, { Component } from "react";

import PropTypes from "prop-types";

import { BrowserRouter, Switch, Redirect, Route, Link } from "react-router-dom";

import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import HomeIcon from '@material-ui/icons/Home';
import FavoriteIcon from '@material-ui/icons/Favorite';
import LocationOnIcon from '@material-ui/icons/LocationOn';

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

    return (
      <BrowserRouter basename={process.env.REACT_APP_BASENAME}>
        {bar}
        <Switch>
          <Route path="/" exact>
            <Home user={user} openSnackbar={openSnackbar} />
          </Route>
          <Route path="/commandments" exact>
            <Commandments uid={user.uid} openSnackbar={openSnackbar} />
          </Route>
          <Route path="/boards" exact>
            <Boards uid={user.uid} openSnackbar={openSnackbar} />
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
     <BottomNavigationAction label="Pesonal" icon={ <Link to={ `/`}><HomeIcon /></Link>} /> 
     <BottomNavigationAction label="Favorites" icon={<Link to={ `/Commandments`}><FavoriteIcon /></Link>} /> 
     <BottomNavigationAction label="Nearby" icon={<Link to={ `/Boards`}><LocationOnIcon /> </Link>} /> 
      

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
