import React, {useCallback} from 'react';
import PropTypes from "prop-types";
import {cn as bem} from '@bem-react/classname';
import './style.css';

function InputNumber(props) {
  const cn = bem('InputNumber');

  // Обработчик изменений в input
  const onChange = useCallback(event => {
    const target = event.target;
    props.onChange(target.name, +target.value);
  }, [props.onChange]);

  return (
    <label className={cn()}>
      {props.children}
      <input
        className={cn(props.name)}
        type="number"
        step={props.step}
        min={props.min}
        max={props.max}
        name={props.name}
        value={props.value}
        onChange={onChange}
      />
    </label>
  )
}

InputNumber.PropTypes = {
  children: PropTypes.element,
  value: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  max: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  step: PropTypes.number.isRequired
}

InputNumber.defaultProps = {
  onChange: () => {},
  type: 'text'
}

export default React.memo(InputNumber);
