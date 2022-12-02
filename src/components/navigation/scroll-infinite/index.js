import React, {useEffect, useRef} from 'react';
import PropTypes from "prop-types";
import './style.css';
import {cn as bem} from "@bem-react/classname";

function ScrollInfinite(props) {
  const cn = bem('ScrollInfinite');
  const ref = useRef(null);

  useEffect(() => {
    const infiniteObserver = new IntersectionObserver(
      ([entry], observer) => {
        // проверяем что достигли последнего элемента
        if (entry.isIntersecting) {
          // перестаем его отслеживать
          observer.unobserve(entry.target);
          // и загружаем новую порцию контента
          props.onChange();
        }
      },
      {threshold: 0.1, rootMargin: '0px 0px -68px'}
    );
    if (props.dataLength && !props.isLastPage) {
      const list = ref.current.childNodes[0].children;
      const lastChild = list[list.length - 1];
      // для последнего потомка снова добавляем observer
      if (lastChild) {
        infiniteObserver.observe(lastChild);
      }
    }
  }, [props.dataLength, props.isLastPage])

  return (
    <div className={cn()} ref={ref}>
      {props.children}
    </div>
  );
}

ScrollInfinite.propTypes = {
  onChange: PropTypes.func,
  dataLength: PropTypes.number,
  isLastPage: PropTypes.bool.isRequired
}

ScrollInfinite.defaultProps = {
  onChange: () => {}
}

export default React.memo(ScrollInfinite);
