import React from 'react';
import propTypes from 'prop-types';
import {cn as bem} from "@bem-react/classname";
import './style.css';
import PropTypes from "prop-types";

function List(props){
  const cn = bem('List');

  return (
    <div className={cn()}>{props.items.map(item =>
      <div key={item._id} className={cn('item', {selected: props.selectedItems[item._id]})}>
        {props.renderItem(item)}
      </div>
    )}
    </div>
  )
}

List.propTypes = {
  selectedItems: propTypes.object,
  items: propTypes.arrayOf(propTypes.object).isRequired,
  renderItem: propTypes.func
}

List.defaultProps = {
  selectedItems: {},
  items: [],
  renderItem: (item) => {
    return item.toString()
  }
}

export default React.memo(List);
