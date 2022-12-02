import React, {useCallback} from 'react';
import PropTypes from "prop-types";
import {cn as bem} from "@bem-react/classname";
import './style.css';

function NumberForm(props) {
  const cn = bem('NumberForm');

  // Обработчик отправки формы
  const onSubmit = useCallback(event => {
    event.preventDefault();
    props.onSubmit(event.target[0].value);
  }, [props.onSubmit]);

  return (
    <form onSubmit={onSubmit} className={cn()}>
      <input
        className={cn('input')}
        type="number"
        step={props.step}
        min={props.min}
        max={props.max}
        defaultValue="1"
        placeholder={props.placeholder}
        disabled={props.disabled}
        required={props.required}
      />
      <button className={cn('submit')} type="submit">{props.title}</button>
    </form>
  );
}

NumberForm.propTypes = {
  onSubmit: PropTypes.func,
  title: PropTypes.string,
  step: PropTypes.number,
  min: PropTypes.number,
  max: PropTypes.number,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
}

NumberForm.defaultProps = {
  onSubmit: () => {},
  title: 'Отправить',
  step: 1,
  min: 1,
  max: 100000,
  placeholder: '',
  disabled: false,
  required: true,
}

export default React.memo(NumberForm);
