import React, {forwardRef, useCallback, useImperativeHandle, useRef, useState} from 'react';
import debounce from "lodash.debounce";
import PropTypes from "prop-types";
import './style.css';

const Input = forwardRef((props, ref) => {
  // Внутренний стейт поля поиска
  const [value, setValue] = useState('');
  const inputRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      focus: () => {
        inputRef.current.focus();
      }
    }
  }, [ref, inputRef.current])

  // Задержка обработки поиска
  const changeThrottle = useCallback(
    debounce(value => props.onChange(value.trim().toLowerCase()), props.delay),
    [props.onChange, props.delay]
  );

  // Обработчик изменений поля поиска
  const onSearch = useCallback(e => {
    setValue(e.target.value);
    changeThrottle(e.target.value);
  }, [setValue, changeThrottle]);

  return (
    <input
      className={props.className}
      value={value}
      type="text"
      placeholder={props.placeholder}
      onChange={onSearch}
      ref={inputRef}
      tabIndex={props.tabIndex}
    />
  );
})

Input.PropTypes = {
  className: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  delay: PropTypes.number,
  placeholder: PropTypes.string,
  tabIndex: PropTypes.number.isRequired
}

Input.defaultProps = {
  onChange: () => {},
  delay: 600,
  placeholder: "Поиск",
}

export default React.memo(Input);
