import React, {useCallback} from 'react';
import {cn as bem} from "@bem-react/classname";
import PropTypes from "prop-types";
import './style.css';
import InputNumber from "@src/components/canvas/tool-bar/input-number";
import InputColor from "@src/components/canvas/tool-bar/input-color";

function ToolBar({canvasSize, setToolHandler, setPropsHandler, onDelete, figureProps}) {
  const cn = bem('ToolBar');

  const callbacks = {
    // Выбор инструмента
    setToolHandler: useCallback(event => setToolHandler(event.target.name), [setToolHandler])
  };

  return (
    <div className={cn()}>
      <div className={cn('control')}>
        <button name="Circle" onClick={callbacks.setToolHandler}>Круг</button>
        <button name="Rect" onClick={callbacks.setToolHandler}>Прямоугольник</button>
        <button className={cn('delete')} onClick={onDelete}>Очистить</button>
      </div>
      <div className={cn('property')}>
        <InputNumber name="x" step="1" min="0" max={canvasSize.width} value={figureProps.x}
                     onChange={setPropsHandler}>X:</InputNumber>

        <InputNumber name="y" step="1" min="0" max={canvasSize.height} value={figureProps.y}
                     onChange={setPropsHandler}>Y:</InputNumber>

        <InputNumber name="h" step="1" min="10" max="500" value={figureProps.h}
                     onChange={setPropsHandler}>Высота:</InputNumber>

        <InputNumber name="w" step="1" min="10" max="500" value={figureProps.w}
                     onChange={setPropsHandler}>Ширина:</InputNumber>

        <InputColor name="fillStyle" value={figureProps.fillStyle}
                    onChange={setPropsHandler}>Заливка:</InputColor>

        <InputColor name="strokeStyle" value={figureProps.strokeStyle}
                    onChange={setPropsHandler}>Обводка:</InputColor>
      </div>
    </div>
  );
}

ToolBar.propTypes = {
  canvasSize: PropTypes.shape({
    width: PropTypes.number,
    height: PropTypes.number
  }),
  setToolHandler: PropTypes.func,
  setPropsHandler: PropTypes.func,
  onDelete: PropTypes.func,
  figureProps: PropTypes.shape({
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    w: PropTypes.number.isRequired,
    h: PropTypes.number.isRequired,
    fillStyle: PropTypes.string.isRequired,
    strokeStyle: PropTypes.string.isRequired,
    lineWidth: PropTypes.number.isRequired,
    lineCap: PropTypes.string.isRequired
  })
}

ToolBar.defaultProps = {
  canvasSize: {
    width: 300,
    height: 150
  },
  setPropsHandler: () => {},
  setToolHandler: () => {},
  onDelete: () => {}
}

export default React.memo(ToolBar);
