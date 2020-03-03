import React, { Component } from "react";

import PropTypes from "prop-types";

import { withRouter } from "react-router-dom";

import { auth } from "../../firebase";

import authentication from "../../services/authentication";
import SwipeableViews from 'react-swipeable-views';

import EmptyState from "../EmptyState";
import PersonalBoard from "./PersonalBoard";
import Pagination from "./Pagination";
import { autoPlay } from 'react-swipeable-views-utils';
const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const styles = {
  slide: {
    padding: 15,
    minHeight: 100,
    color: '#000',
  },

};

class Home extends Component {
  state = {
    index: 0,
  };

  handleChangeIndex = index => {
    this.setState({
      index,
    });
  };

  signInWithEmailLink = () => {
    const { user } = this.props;
    console.log("UUUser:", user);
    if (user) {
      return;
    }

    const emailLink = window.location.href;

    if (!emailLink) {
      return;
    }

    if (auth.isSignInWithEmailLink(emailLink)) {
      let emailAddress = localStorage.getItem("emailAddress");

      if (!emailAddress) {
        this.props.history.push("/");

        return;
      }

      authentication
        .signInWithEmailLink(emailAddress, emailLink)
        .then(value => {
          const user = value.user;
          const displayName = user.displayName;
          const emailAddress = user.email;

          this.props.openSnackbar(
            `Signed in as ${displayName || emailAddress}`
          );
        })
        .catch(reason => {
          const code = reason.code;
          const message = reason.message;

          switch (code) {
            case "auth/expired-action-code":
            case "auth/invalid-email":
            case "auth/user-disabled":
              this.props.openSnackbar(message);
              break;

            default:
              this.props.openSnackbar(message);
              return;
          }
        })
        .finally(() => {
          this.props.history.push("/");
        });
    }
  };

  render() {
    // Properties
    const { user } = this.props;
    const { index } = this.state;    

     if(user){
       return ( <div>
       <SwipeableViews index={index} onChangeIndex={this.handleChangeIndex}>
      <div style={Object.assign({}, styles.slide, styles.slide1)}>
      <PersonalBoard uid={user.uid} />
      </div>
      <div style={Object.assign({}, styles.slide, styles.slide2)}>
      <PersonalBoard uid={user.uid} />
      </div>
      <div style={Object.assign({}, styles.slide, styles.slide3)}>
      <PersonalBoard uid={user.uid} />
      </div>    
      </SwipeableViews>
      <Pagination dots={3} index={index} onChangeIndex={this.handleChangeIndex} />       
      </div>)
    }
    //if (user) {
    //  return <PersonalBoard uid={user.uid} />;
   // }

    return (
      <EmptyState
        title={process.env.REACT_APP_TITLE}
        description={process.env.REACT_APP_DESCRIPTION}
      />
    );
  }

  componentDidMount() {
    this.signInWithEmailLink();
  }
}

Home.propTypes = {
  // Properties
  user: PropTypes.object
};

export default withRouter(Home);
