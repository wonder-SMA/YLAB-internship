import React, {useCallback} from 'react';
import PropTypes from "prop-types";
import {cn as bem} from '@bem-react/classname';
import './style.css';

function InputColor(props) {
  const cn = bem('InputColor');

  // Обработчик изменений в input
  const onChange = useCallback(event => {
    const target = event.target;
    props.onChange(target.name, target.value);
  }, [props.onChange]);

  return (
    <label className={cn()}>
      {props.children}
      <input
        className={cn(props.name)}
        type="color"
        name={props.name}
        value={props.value}
        onChange={onChange}
      />
    </label>
  )
}

InputColor.PropTypes = {
  children: PropTypes.element,
  value: PropTypes.string,
  name: PropTypes.string,
  onChange: PropTypes.func,
}

InputColor.defaultProps = {
  onChange: () => {},
  type: 'text'
}

export default React.memo(InputColor);
