import React from 'react';
import PropTypes from "prop-types";
import './style.css';

function Item(props) {
  return (
    <li
      className={props.isSelected ? 'SelectCustom-option_selected' : 'SelectCustom-option'}
      onClick={props.onClick}
    >
      <span className="SelectCustom-code">{props.value}</span>
      <span className="SelectCustom-title">{props.title}</span>
    </li>
  );
}

Item.propTypes = {
  title: PropTypes.string.isRequired,
  code: PropTypes.string,
  isSelected: PropTypes.bool,
  onClick: PropTypes.func
}

Item.defaultProps = {
  isSelected: false,
  onClick: () => {}
}

export default React.memo(Item);
