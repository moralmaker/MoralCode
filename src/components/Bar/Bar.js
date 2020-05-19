import React, { Component } from "react";

import PropTypes from "prop-types";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";

import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

import { Link } from "react-router-dom";

import UserAvatar from "../UserAvatar";

class Bar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      menu: {
        anchorEl: null
      }
    };
  }

  openMenu = event => {
    const anchorEl = event.currentTarget;

    this.setState({
      menu: {
        anchorEl
      }
    });
  };

  closeMenu = () => {
    this.setState({
      menu: {
        anchorEl: null
      }
    });
  };

  render() {
    // Properties
    const { performingAction, user, userData, roles } = this.props;

    // Events
    const {
      onAboutClick,
      onSettingsClick,
      onSignOutClick,
      onSignUpClick,
      onSignInClick
    } = this.props;

    const { menu } = this.state;

    const menuItems = [
      {
        name: "About",
        onClick: onAboutClick
      },
      {
        name: "Profile",
        to: user ? `/user/${user.uid}` : null
      },
      {
        name: "Settings",
        onClick: onSettingsClick
      },
      {
        name: "Sign out",
        divide: true,
        onClick: onSignOutClick
      }
    ];

    return (
      <AppBar color="" position="static">
        <Toolbar>
          <Box display="flex" flexGrow={1}>


            <svg width="79" height="52" >
            <defs>
              <filter id="svg_8_blur">
              <feGaussianBlur stdDeviation="0" in="SourceGraphic"/>
              </filter>
            </defs>
>
            <g>
              <title>Layer 1</title>
              <text font-weight="normal" transform="rotate(-4 23.0783615112305,33.32068634033207) " text-anchor="start" font-family="'Palatino Linotype', 'Book Antiqua', Palatino, serif" font-size="15" id="svg_5" y="38.953282" x="3.000168" stroke-width="0" stroke="#005fbf" fill="#005fbf">Moral</text>
              <text transform="rotate(-47 57.72711944580079,22.70342445373535) " font-style="normal" stroke-width="0" font-weight="bold"  text-anchor="start" font-family="'Palatino Linotype', 'Book Antiqua', Palatino, serif" font-size="14" id="svg_7" y="27.953428" x="41.000559" stroke="#007fff" fill="#005fbf">Code</text>
              <path stroke="#007fff" transform="rotate(21 42.700519561767564,22.555852890014638) " filter="url(#svg_8_blur)" opacity="0.2" id="svg_8" d="m17.128233,36.441922l12.786155,-13.88607l0,6.943035l19.179207,0l0,-20.829106l-6.393074,0l12.786148,-13.88607l12.786148,13.88607l-6.393075,0l0,34.715176l-31.965352,0l0,6.943035l-12.786157,-13.88607l-0.000002,0z" stroke-width="0" fill="#56aaff"/>
              <ellipse ry="6" rx="6" id="svg_14" cy="19.250199" cx="41.250521" stroke-opacity="null" stroke-width="0" stroke="#007fff" fill="#003f7f"/>
            </g>
          </svg>             

          </Box>

          {user && (
            <>
              {roles.includes("admin") && (
                <Box mr={1}>
                  <Button
                    color="inherit"
                    component={Link}
                    to="/admin"
                    variant="outlined"
                  >
                    Admin
                  </Button>
                </Box>
              )}

              <IconButton
                color="inherit"
                disabled={performingAction}
                onClick={this.openMenu}
              >
                <UserAvatar user={Object.assign(user, userData)} />
              </IconButton>

              <Menu
                anchorEl={menu.anchorEl}
                open={Boolean(menu.anchorEl)}
                onClose={this.closeMenu}
              >
                {menuItems.map((menuItem, index) => {
                  if (
                    menuItem.hasOwnProperty("condition") &&
                    !menuItem.condition
                  ) {
                    return null;
                  }

                  let component = null;

                  if (menuItem.to) {
                    component = (
                      <MenuItem
                        key={index}
                        component={Link}
                        to={menuItem.to}
                        onClick={this.closeMenu}
                      >
                        {menuItem.name}
                      </MenuItem>
                    );
                  } else {
                    component = (
                      <MenuItem
                        key={index}
                        onClick={() => {
                          this.closeMenu();

                          menuItem.onClick();
                        }}
                      >
                        {menuItem.name}
                      </MenuItem>
                    );
                  }

                  if (menuItem.divide) {
                    return (
                      <span key={index}>
                        <Divider />

                        {component}
                      </span>
                    );
                  }

                  return component;
                })}
              </Menu>
            </>
          )}

          {!user && (
            <ButtonGroup
              color="inherit"
              disabled={performingAction}
              variant="outlined"
            >
              <Button onClick={onSignUpClick}>Sign up</Button>
              <Button onClick={onSignInClick}>Sign in</Button>
            </ButtonGroup>
          )}
        </Toolbar>
      </AppBar>
    );
  }
}

Bar.defaultProps = {
  performingAction: false
};

Bar.propTypes = {
  // Properties
  performingAction: PropTypes.bool.isRequired,
  user: PropTypes.object,
  userData: PropTypes.object,

  // Events
  onAboutClick: PropTypes.func.isRequired,
  onSettingsClick: PropTypes.func.isRequired,
  onSignOutClick: PropTypes.func.isRequired
};

export default Bar;
