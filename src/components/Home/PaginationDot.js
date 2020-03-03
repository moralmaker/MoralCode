import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import PersonalIcon from '@material-ui/icons/Home';
import BoardsIcon from '@material-ui/icons/SupervisedUserCircle';
import CommandmentIcon from '@material-ui/icons/ListRounded';

const styles = {
  root: {
    height: 18,
    width: 18,
    cursor: 'pointer',
    border: 0,
    background: 'none',
    padding: 20,
  },
  active: {
    zoom : '120%'
  },
};
const icons= [<PersonalIcon /> , <CommandmentIcon />, <BoardsIcon />]
const SelectedIcon = (index) =>  icons[index]

class PaginationDot extends React.Component {
  handleClick = event => {
    this.props.onClick(event, this.props.index);
  };

  render() {
    const { index ,active } = this.props;


    return (
      <IconButton color={active ? 'primary' : ''}  size={active ? 'small' : ''} style={styles.root} aria-label="upload picture" component="span"  onClick={this.handleClick} >
          <div style={(active ? styles.active : {})} >
            {SelectedIcon(index,active)} 
          </div>
      </IconButton>        
    );
  }
}

PaginationDot.propTypes = {
  active: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default PaginationDot;