import React, { Component } from "react";

import PropTypes from "prop-types";

import { withRouter } from "react-router-dom";

import { auth } from "../../firebase";
import Box from "@material-ui/core/Box";

import authentication from "../../services/authentication";
import EmptyState from "../EmptyState";
import PersonalBoard from "./PersonalBoard";

const styles = {
  slide: {
    padding: 15,
    minHeight: 100,
    color: '#000',
  },
  wtext : {
  minHeight: '100vh',
  maxWidth: '1024px',
  margin: 'auto',
  padding: '1em',
  textAlign:  "center" 
}

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
       return ( 
      <div style={Object.assign({}, styles.slide, styles.slide1)}>
        <PersonalBoard uid={user.uid} />
      </div>)
    }
    //if (user) {
    //  return <PersonalBoard uid={user.uid} />;
   // }

    return (
<Box center width="100%" style={Object.assign({}, styles.wtext)}>
<svg width="79" height="52" >

 <defs>
  <filter id="svg_8_blur">
   <feGaussianBlur stdDeviation="0" in="SourceGraphic"/>
  </filter>
 </defs>

 <g>
  <title>Layer 1</title>
  <path stroke="#007fff" transform="rotate(21 42.70052337646483,22.555850982666) " filter="url(#svg_8_blur)" id="svg_8" d="m17.128233,36.441922l12.786156,-13.88607l0,6.943035l19.179207,0l0,-20.829106l-6.393074,0l12.786148,-13.88607l12.786149,13.88607l-6.393075,0l0,34.715176l-31.965352,0l0,6.943036l-12.786157,-13.886071l-0.000002,0z" stroke-width="0" fill="#5656ff"/>
  <ellipse ry="6" rx="6" id="svg_14" cy="18.250213" cx="41.000524" stroke-opacity="null" stroke-width="0" stroke="#007fff" fill="#00007f"/>
  <ellipse ry="3" rx="3" id="svg_16" cy="26.863269" cx="110.124048" stroke-opacity="null" stroke-width="0" stroke="#007fff" fill="#d4aaff"/>
  <ellipse ry="0.124998" id="svg_17" cy="52.73792" cx="125.873834" stroke-opacity="null" stroke-width="0" stroke="#007fff" fill="#7f00ff"/>
  <ellipse ry="1.374981" rx="1.124985" id="svg_20" cy="17.738393" cx="38.75001" stroke-opacity="null" stroke-width="0" stroke="#007fff" fill="#00007f"/>
 </g>
</svg>  
          <h1>Know your self, then you will know where to go.</h1>
          <h4
            data-tut="reactour__style"
            color="black"
            style={{ width: "50%", margin: "0 auto 2em" }}
          >
MoralCode is an application that attempts to map a point of view of morality and ethics.
it does so by analyzing the moral preferences of each user in accordance with the environment,
  users' moral code is clustered on the map and allows any user to observe the environment with a moral layer.
</h4>
  <h4
            data-tut="reactour__style"
            color="black"
            style={{ width: "50%", margin: "0 auto 2em" }}
          >
 The application is designed to be as simple and intuitive as possible.
  The user sets up his own moral values and instantly the map reflects the correlation between the user and the clustered environment.
   This means that a person can easily see how he or she fits into the this moral system. 
an ethical view of the world around us.
</h4>
<h4
            data-tut="reactour__style"
            color="black"
            style={{ width: "50%", margin: "0 auto 2em" }}
          >

Each user can allocates an area on the map around his current position, gives it a name, and voila a moral cluster is ready.
Other users that are in the same location can over time join this cluster of morality.
Each cluster morality is the total of all it's members morality.
          </h4>
        </Box>

    );
  }

  componentDidMount() {
    this.signInWithEmailLink();
  }
}

Home.propTypes = {
  user: PropTypes.object
};

export default withRouter(Home);

/*
      <EmptyState
        title={process.env.REACT_APP_TITLE}
        description={process.env.REACT_APP_DESCRIPTION}
      />*/
