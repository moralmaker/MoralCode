import React from 'react';
import PropTypes from 'prop-types';
import PaginationDot from './PaginationDot';

const styles = {
  root: {
    position: 'fixed',
    
    bottom: 8,
    right: 8,
    display: 'flex',
    flexDirection: 'row',
  },
};

function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

class Pagination extends React.Component {
  handleClick = (event, index) => {
    this.props.onChangeIndex(index);
  };

  render() {
    const { index, dots } = this.props;

    const children = [];

    for (let i = 0; i < dots; i += 1) {
      children.push(
        <PaginationDot key={i} index={i} active={i === index} onClick={this.handleClick} />,
      );
    }

    return <div onClick={topFunction} style={styles.root}>{children}</div>;
  }
}

Pagination.propTypes = {
  dots: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  onChangeIndex: PropTypes.func.isRequired,
};

export default Pagination;