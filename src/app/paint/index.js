import React, {useCallback, useEffect, useRef, useState} from 'react';
import useStore from "@src/hooks/use-store";
import useSelector from "@src/hooks/use-selector";
import Layout from "@src/components/layouts/layout";
import TopContainer from "@src/containers/top";
import HeadContainer from "@src/containers/head";
import ToolsContainer from "@src/containers/tools";
import Canvas from "@src/components/canvas";
import LayoutCanvas from "@src/components/layouts/layout-canvas";
import ToolBar from "@src/components/canvas/tool-bar";
import Tool from "@src/components/canvas/tools";
import * as tools from "@src/components/canvas/tools/exports";
import * as uuid from "uuid";
import throttle from "lodash.throttle";

function Paint() {
  const store = useStore();
  const select = useSelector(state => ({
    canvas: state.paint.canvas,
    figureProps: state.paint.figureProps,
    selectedFigureProps: state.paint.selectedFigureProps,
    fps: state.paint.fps,
    a: state.paint.a,
    v: state.paint.v,
  }));
  const [tool, setTool] = useState(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvasRoot = canvasRef.current.getRef();
      store.get('paint').setCanvas(canvasRoot.firstChild);

      const tool = new Tool(throttle(props => store.get('paint').setSelectedFigureProps(props), 100));
      tool.mount(canvasRoot);
      setTool(tool);

      return () => {
        tool.unmount();
      }
    }
  }, [canvasRef.current])

  const callbacks = {
    // Добавление фигуры
    addFigureHandler: useCallback(name => {
      tool.addFigure(tools[name], {
        id: uuid.v4(),
        figureProps: select.figureProps,
        a: select.a,
        v: select.v,
        time: performance.now()
      });
    }, [tool, select.figureProps, select.a, select.v]),

    // Установка свойств фигуры
    setPropsHandler: useCallback((name, value) => {
      if (Object.keys(select.selectedFigureProps).length) {
        store.get('paint').setSelectedFigureProps({[name]: value});
        tool.updateSelectedFigureProps({[name]: value});
      } else {
        store.get('paint').setFigureProps({[name]: value});
      }
    }, [select.selectedFigureProps]),

    // Очистка массива примитивов и канваса
    onDelete: useCallback(() => {
      tool.clear();
      tool.figures = {};
    }, [tool])
  };

  return (
    <Layout>
      <TopContainer/>
      <HeadContainer title="title.paint"/>
      <ToolsContainer/>
      <LayoutCanvas head={
        <ToolBar
          canvasSize={{width: select.canvas?.width, height: select.canvas?.height}}
          setToolHandler={callbacks.addFigureHandler}
          onDelete={callbacks.onDelete}
          figureProps={Object.keys(select.selectedFigureProps).length ? select.selectedFigureProps : select.figureProps}
          setPropsHandler={callbacks.setPropsHandler}
        />
      }>
        <Canvas ref={canvasRef} fps={select.fps}/>
      </LayoutCanvas>
    </Layout>
  );
}

export default React.memo(Paint);
