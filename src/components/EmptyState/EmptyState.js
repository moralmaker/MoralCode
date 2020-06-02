import React, { Component } from "react";

import PropTypes from "prop-types";

import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";

const styles = {

  wtext : {
  minHeight: '100vh',
  maxWidth: '1024px',
  margin: 'auto',
  padding: '1em',
  textAlign:  "center" 
}

}
class EmptyState extends Component {
  render() {
    // Properties
    const { type, size, padding, icon, title, description } = this.props;

    let fontSize;
    let variant;

    if (size === "small") {
      fontSize = "h3.fontSize";
      variant = "h6";
    } else if (size === "medium") {
      fontSize = "h2.fontSize";
      variant = "h5";
    } else if (size === "big") {
      fontSize = "h1.fontSize";
      variant = "h4";
    }

    if (type === "content") {
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
            <path stroke="#007fff" transform="rotate(21 42.70052337646483,22.555850982666) " filter="url(#svg_8_blur)" id="svg_8" d="m17.128233,36.441922l12.786156,-13.88607l0,6.943035l19.179207,0l0,-20.829106l-6.393074,0l12.786148,-13.88607l12.786149,13.88607l-6.393075,0l0,34.715176l-31.965352,0l0,6.943036l-12.786157,-13.886071l-0.000002,0z" strokeWidth="0" fill="#5656ff"/>
            <ellipse ry="6" rx="6" id="svg_14" cy="18.250213" cx="41.000524" strokeOpacity="null" strokeWidth="0" stroke="#007fff" fill="#00007f"/>
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

    if (type === "card") {
      return (
        <Box padding={padding} textAlign="center">
          {icon && (
            <Box clone color="text.secondary" fontSize={fontSize}>
              {icon}
            </Box>
          )}

          {title && (
            <Typography color="textSecondary" variant={variant}>
              {title}
            </Typography>
          )}

          {description && (
            <Typography color="textSecondary" variant="body1">
              {description}
            </Typography>
          )}
        </Box>
      );
    }

    return null;
  }
}

EmptyState.defaultProps = {
  type: "content",
  size: "medium",
  padding: 2
};

EmptyState.propTypes = {
  // Properties
  type: PropTypes.string.isRequired,
  size: PropTypes.string,
  padding: PropTypes.number,
  icon: PropTypes.element,
  title: PropTypes.string,
  description: PropTypes.string
};

export default EmptyState;
