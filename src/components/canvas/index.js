import React, {forwardRef, useImperativeHandle, useRef} from 'react';
import {cn as bem} from "@bem-react/classname";
import PropTypes from "prop-types";
import './style.css';

const Canvas = forwardRef((props, ref) => {
  const cn = bem('Canvas');
  const canvasRef = useRef(null);

  useImperativeHandle(ref, () => {
    return {
      getRef: () => canvasRef.current
    }
  }, [ref, canvasRef.current])

  return (
    <div className={cn()} ref={canvasRef}>
      <canvas/>
    </div>
  );
});

Canvas.PropTypes = {
  fps: PropTypes.number
}

Canvas.defaultProps = {
  fps: 60
}

export default React.memo(Canvas);
