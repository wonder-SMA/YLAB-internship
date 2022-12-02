import React, {useEffect, useRef} from 'react';
import {cn as bem} from "@bem-react/classname";
import PropTypes from "prop-types";
import './style.css';

function ScrollInfinite(props) {
  const cn = bem('ScrollInfinite');
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry], observer) => {
        // проверяем что достигли последнего элемента
        if (entry.isIntersecting) {
          // перестаем его отслеживать
          observer.unobserve(entry.target);
          // и загружаем новую порцию контента
          props.onChange();
        }
      },
      {threshold: 0.1, rootMargin: top ? '0px 0px 0px' : '0px 0px -68px'}
    );
    if (props.dataLength) {
      const list = ref.current.childNodes[0].children;
      const lastChild = list[list.length - 1];
      // для последнего потомка снова добавляем observer
      if (lastChild) {
        observer.observe(lastChild);
      }
    }
  }, [props.dataLength])


  return (
    <div className={cn()} ref={ref}>
      {props.children}
    </div>
  );
}

ScrollInfinite.propTypes = {
  top: PropTypes.bool,
  onChange: PropTypes.func,
  dataLength: PropTypes.number
}

ScrollInfinite.defaultProps = {
  onChange: () => {}
}

export default React.memo(ScrollInfinite);
