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
    if (props.dataLenght) {
      const list = ref.current.childNodes[0].children;
      const lastChild = list[list.length - 1];
      // для последнего потомка снова добавляем observer
      if (lastChild) {
        infiniteObserver.observe(lastChild);
      }
    }
  }, [props.dataLenght])

  return (
    <div className={cn()} ref={ref}>
      {props.children}
    </div>
  );
}

// ScrollInfinite.propTypes = {
//   page: PropTypes.number.isRequired,
//   limit: PropTypes.number,
//   count: PropTypes.number,
//   onChange: PropTypes.func,
// }
//
// ScrollInfinite.defaultProps = {
//   page: 1,
//   limit: 10,
//   count: 1000,
//   onChange: () => {
//   },
// }

export default React.memo(ScrollInfinite);
