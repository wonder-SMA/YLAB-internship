import React from 'react';
import {cn as bem} from "@bem-react/classname";
import PropTypes from "prop-types";
import './style.css';

function LayoutCanvas({head, children}) {
  const cn = bem('LayoutCanvas');

  return (
    <div className={cn()}>
      <div className={cn('head')}>
        {head}
      </div>
      <div className={cn('content')}>
        {children}
      </div>
    </div>
  )
}

LayoutCanvas.PropTypes = {
  head: PropTypes.node,
  children: PropTypes.node,
}

LayoutCanvas.defaultProps = {}

export default React.memo(LayoutCanvas);
