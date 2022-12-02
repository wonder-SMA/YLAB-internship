import React, {useCallback, useEffect, useLayoutEffect, useRef, useState} from 'react';
import {cn as bem} from '@bem-react/classname';
import PropTypes from "prop-types";
import './style.css';
import Input from "@src/components/elements/select-custom/input";
import Item from "@src/components/elements/select-custom/item";
import chevronDown from './chevron-down.svg';

function SelectCustom(props) {
  const cn = bem('SelectCustom');
  // Внутренний стейт выбранного элемента
  const [selected, setSelected] = useState(props.value ? props.value : props.options[0]);
  // Внутренний стейт состояния раскрытия дропдауна
  const [isOpen, setIsOpen] = useState(false);
  // Внутренний стейт направления раскрытия дропдауна
  const [top, setTop] = useState(false);
  // Внутренний стейт данных дропдауна
  const [list, setList] = useState(props.options);
  // Внутренний стейт нажатия кнопки
  const [key, setKey] = useState({key: '', code: ''});

  const mainRef = useRef(null);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Эффект для установки ширины
  useLayoutEffect(() => {
    if (props.width && mainRef.current) {
      mainRef.current.style.setProperty('--dropdown-width', `${props.width}px`)
    }
  }, [props.width, mainRef.current])

  // Эффект для установки высоты раскрытия дропдауна
  useLayoutEffect(() => {
    if (props.maxHeight && dropdownRef.current && ['SelectCustom-dropdown', 'SelectCustom-dropdown_top']
      .includes(dropdownRef.current.getAttribute('class').split(' ')[1])) {

      dropdownRef.current.style.setProperty('--dropdown-max-height', `${props.maxHeight}px`)
    }
  }, [props.maxHeight, isOpen, dropdownRef.current])

  // Эффект для определения направления раскрытия дропдауна
  useLayoutEffect(() => {
    if (isOpen) {
      const bottom = mainRef.current.getBoundingClientRect().bottom;
      if (!props.maxHeight && (window.innerHeight - bottom < 171)) {
        setTop(true)
      } else {
        setTop(false)
      }
    }
  }, [isOpen, mainRef.current]);

  // Эффект фокусировки на инпут при открытии дропдауна
  useEffect(() => {
    inputRef.current && inputRef.current.focus();
  }, [isOpen]);

  // Эффект обработки нажатий клавиш клавиатуры
  useEffect(() => {
    if ((key.code === 'Space' && document.activeElement.tagName !== 'INPUT')
      || key.key === 'Enter' || key.code === 'Escape') {
      if (!isOpen && key.code !== 'Escape') {
        onOpen();
      } else if (isOpen) {
        onOpen();
        mainRef.current.focus();
        setList(props.options);
      }
    } else if (key.code === 'ArrowUp' || key.code === 'ArrowDown') {
      let currentIndex = list.indexOf(selected);
      key.code === 'ArrowUp'
        ? --currentIndex >= 0 && setSelected(list[currentIndex])
        : ++currentIndex <= list.length - 1 && setSelected(list[currentIndex]);
    }
  }, [key]);

  // Обработчик раскрытия дропдауна
  const onOpen = useCallback(() => {
    setIsOpen(prevState => !prevState);
  }, [setIsOpen]);

  // Обработчик нажатий клавиш клавиатуры
  const onKeyDown = useCallback(e => {
    if (e.code === 'Space' && document.activeElement.tagName !== 'INPUT'
      || (e.code === 'ArrowUp' || e.code === 'ArrowDown') && !isOpen) {
      e.preventDefault();
    }
    setKey({key: e.key, code: e.code})
  }, [setKey, isOpen, list, selected]);

  // Обработчик потери фокуса
  const onBlur = useCallback(e => {
    if (isOpen
      && ![
        'SelectCustom',
        'SelectCustom-search',
        'SelectCustom-options',
      ].includes(e.relatedTarget?.getAttribute('class'))) {
      onOpen();
      setList(props.options);
    }
  }, [isOpen, onOpen, props.options]);

  // Обработчик поиска
  const onSearch = useCallback(
    value => setList(props.options.filter(option => option.title.toLowerCase().includes(value))),
    [setList, props.options]
  );

  // Возвращает функцию с замыканием на item
  const selectHandler = item => {
    return () => {
      props.onChange(item);
      setSelected(item);
      onOpen();
      setList(props.options);
    }
  };

  return (
    <div className={cn()} tabIndex="0" role="listbox" ref={mainRef} onKeyDown={onKeyDown} onBlur={onBlur}>
      <div className={cn('trigger')} onClick={onOpen} role="presentation">
        <Item title={selected.title} value={selected.value}/>
        <img src={chevronDown} alt="Chevron down icon"/>
      </div>
      {isOpen && <div className={cn('dropdown', {top})} ref={dropdownRef}>
        <Input
          className={cn('search')}
          placeholder={props.placeholder}
          onChange={onSearch}
          delay={props.delay}
          tabIndex={isOpen ? 0 : -1}
          ref={inputRef}
        />
        <ul className={cn('options')} tabIndex={isOpen ? 0 : -1} role="group">
          {list.map(item =>
            <React.Fragment key={item.value}>
              <Item
                title={item.title}
                value={item.value}
                isSelected={selected.value === item.value}
                onClick={selectHandler(item)}
              />
            </React.Fragment>
          )}
        </ul>
      </div>}
    </div>
  )
}

SelectCustom.PropTypes = {
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  })),
  value: PropTypes.shape({
    title: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired
  }),
  placeholder: PropTypes.string,
  code: PropTypes.bool,
  width: PropTypes.number,
  maxHeight: PropTypes.number,
  delay: PropTypes.number
}

SelectCustom.defaultProps = {
  onChange: () => {},
  options: [{title: '-'}],
  placeholder: "Поиск",
  code: false
}

export default React.memo(SelectCustom);
