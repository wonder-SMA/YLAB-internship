import React, {useCallback} from 'react';
import propTypes from 'prop-types';
import {cn as bem} from "@bem-react/classname";
import {Link} from "react-router-dom";
import numberFormat from "@src/utils/number-format";
import './style.css';

function Item(props) {
  const cn = bem('Item');

  const callbacks = {
    onAdd: useCallback((e) => props.onAdd(props.item._id), [props.onAdd, props.item])
  };

  return (
    <div className={cn({selectable: props.isModalBasket})} onClick={props.isModalBasket ? callbacks.onAdd : () => false}>
      <div className={cn('title')}>
        {props.link ? <Link onClick={props.onLink} to={props.link}>{props.item.title}</Link> : props.item.title}
      </div>
      <div className={cn('right')}>
        <div className={cn('price')}>{numberFormat(props.item.price)} {props.labelCurr}</div>
        {!props.isModalBasket && <button onClick={callbacks.onAdd}>{props.labelAdd}</button>}
      </div>
    </div>
  )
}

Item.propTypes = {
  isModalBasket: propTypes.bool,
  item: propTypes.object.isRequired,
  onAdd: propTypes.func,
  onLink: propTypes.func,
  link: propTypes.string,
  labelCurr: propTypes.string,
  labelAdd: propTypes.string
}

Item.defaultProps = {
  isModalBasket: false,
  onLink: () => {},
  onAdd: () => {},
  labelCurr: '₽',
  labelAdd: 'Добавить'
}

export default React.memo(Item);
