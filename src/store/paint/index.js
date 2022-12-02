import StateModule from "@src/store/module";
import shallowequal from "shallowequal";
import {repeat} from "lodash.debounce";

/**
 * Состояние канваса
 */
class PaintState extends StateModule {

  /**
   * Начальное состояние
   * @return {Object}
   */
  initState() {
    return {
      canvas: null,
      selectedFigureProps: {},
      figureProps: {
        x: 0,
        y: 0,
        w: 75,
        h: 75,
        fillStyle: '#ffffff',
        strokeStyle: '#000000',
        lineWidth: 1,
        lineCap: 'round'
      },
      a: 9.81,
      v: 0,
      fps: 60,
      leaveRepeat: 5
    };
  }

  /**
   * Установка канваса
   * @param canvas {HTMLCanvasElement}
   */
  setCanvas(canvas) {
    this.setState({...this.getState(), canvas});
  }

  /**
   * Установка свойств базовой фигуры
   * @param props {Object}
   */
  setFigureProps(props) {
    this.setState({...this.getState(), figureProps: {...this.getState().figureProps, ...props}});
  }

  /**
   * Установка свойств выбранной фигуры
   * @param props {Object}
   */
  setSelectedFigureProps(props) {
    const isEqual = shallowequal(this.getState().selectedFigureProps, props);

    if (!isEqual) {
      this.setState({
        ...this.getState(),
        selectedFigureProps: Object.keys(props).length ? {...this.getState().selectedFigureProps, ...props} : {}
      });
    }
  }
}

export default PaintState;
