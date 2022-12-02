class Tool {
  constructor(setSelectedFigureProps) {
    this.figures = {};
    this.metrics = {
      zoom: 1,
      scrollX: 0,
      scrollY: 0,
    };
    this.setSelectedFigureProps = setSelectedFigureProps;
    this.dpr = window.devicePixelRatio;
    this.action = {};
    this.selectedFigure = {};
    this.needDraw = false;
  }

  /**
   * Выполнение необходимых действий при монтировании канваса
   * @param canvasRoot {HTMLElement}
   */
  mount(canvasRoot) {
    this.canvasRoot = canvasRoot;
    this.canvas = this.canvasRoot.firstChild;
    this.ctx = this.canvas.getContext("2d");
    this.resize();
    this.draw();
    this.canvas.addEventListener('resize', this.resize);
    this.canvas.addEventListener('wheel', this.onWheel, {passive: true});
    this.canvas.addEventListener('mouseup', this.onMouseUp);
    this.canvas.addEventListener('mousedown', this.onMouseDown);
    this.canvas.addEventListener('mousemove', this.onMouseMove);
  }

  /**
   * Выполнение необходимых действий при размонтировании канваса
   */
  unmount() {
    this.canvas.removeEventListener('resize', this.resize);
    this.canvas.removeEventListener('wheel', this.onWheel);
    this.canvas.removeEventListener('mouseup', this.onMouseUp);
    this.canvas.removeEventListener('mousedown', this.onMouseDown);
    this.canvas.removeEventListener('mousemove', this.onMouseMove);
  }

  /**
   * Добавление фигуры в объект примитивов и вызов перерисовки
   * @param tool {function(Object):Tool}
   * @param params {Object}
   */
  addFigure(tool, params) {
    const figure = new tool({
      ...params,
      canvas: this.canvas,
      figureProps: {
        ...params.figureProps,
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
      },
    });
    this.figures[figure.id] = figure;
    this.needDraw = true;
    this.draw();
  }

  /**
   * Обновление свойств выбранной фигуры
   * @param props {Object}
   */
  updateSelectedFigureProps(props) {
    this.selectedFigure.figureProps = {...this.selectedFigure.figureProps, ...props};
    this.selectedFigure.time = performance.now();
  }

  /**
   * Очистка канваса
   */
  clear() {
    this.ctx.clearRect(
      this.metrics.scrollX < 0 ? this.metrics.scrollX / this.metrics.zoom : 0,
      this.metrics.scrollY < 0 ? this.metrics.scrollY / this.metrics.zoom : 0,
      (this.canvas.width + (this.metrics.scrollX > 0 ? this.metrics.scrollX : 0)) / this.metrics.zoom,
      (this.canvas.height + (this.metrics.scrollY > 0 ? this.metrics.scrollY : 0)) / this.metrics.zoom
    );
  }

  /**
   * Изменение размера канваса в соответствии с корневым элементом и dpr
   */
  resize() {
    this.canvas.width = this.canvasRoot.clientWidth * this.dpr;
    this.canvas.height = this.canvasRoot.clientHeight * this.dpr;
    this.ctx.scale(this.dpr, this.dpr);
  }

  /**
   * Обработчик события колеса мышки
   * @param e {WheelEvent}
   */
  onWheel = e => {
    const delta = e.deltaY > 0 ? 0.1 : -0.1;
    if (e.shiftKey) {
      this.zoom({delta, mouseCoords: {x: e.offsetX, y: e.offsetY}});
    } else {
      this.scroll({dy: delta * 300});
    }
  }

  /**
   * Установка зума
   * @param delta {number}
   * @param mouseCoords {Object}
   */
  zoom({delta, mouseCoords}) {
    const prevRealMouseCoords = {
      x: (mouseCoords.x + this.metrics.scrollX) / this.metrics.zoom,
      y: (mouseCoords.y + this.metrics.scrollY) / this.metrics.zoom
    };

    if (delta !== undefined) this.metrics.zoom += -delta * this.metrics.zoom;
    this.metrics.zoom = Math.max(0.1, this.metrics.zoom);

    const currMouseCoords = {
      x: (prevRealMouseCoords.x * this.metrics.zoom),
      y: (prevRealMouseCoords.y * this.metrics.zoom)
    }

    this.scroll({
      x: currMouseCoords.x - mouseCoords.x,
      y: currMouseCoords.y - mouseCoords.y
    });

    this.needDraw = true;
  }

  /**
   * Установка скролла
   * @param {Object}
   */
  scroll({x, y, dx, dy}) {
    if (x !== undefined) this.metrics.scrollX = x;
    if (y !== undefined) this.metrics.scrollY = y;
    if (dx !== undefined) this.metrics.scrollX += dx;
    if (dy !== undefined) this.metrics.scrollY += dy;

    this.needDraw = true;
  }

  /**
   * Обработчик события нажатия кнопки мышки
   * @param e {MouseEvent}
   */
  onMouseDown = e => {
    const matchingFigures = [];

    Object.keys(this.figures).forEach(id => {
      const figure = this.figures[id];
      const x = (e.offsetX + this.metrics.scrollX) / this.metrics.zoom;
      const y = (e.offsetY + this.metrics.scrollY) / this.metrics.zoom;
      if (figure.isContain(x, y)) matchingFigures.push(figure.id);
    });

    if (matchingFigures.length) {
      const selectedId = matchingFigures.at(-1);
      this.selectedFigure = this.figures[selectedId];
      // Удаляем выбранную фигуру из объекта и добавляем ее в конец, чтобы она была на верхнем уровне наложения
      delete this.figures[selectedId];
      this.figures = {...this.figures, [selectedId]: this.selectedFigure};

      this.action = {
        name: 'drag',
        dx: e.offsetX / this.metrics.zoom - this.selectedFigure.figureProps.x,
        dy: e.offsetY / this.metrics.zoom - this.selectedFigure.figureProps.y
      };

    } else {
      // Проверяем, есть ли выбранная фигура, и если ее нет, то очищаем ее свойства во внешнем состоянии
      if (this.selectedFigure.id) {
        this.setSelectedFigureProps({});
        this.selectedFigure = {};
      }

      this.action = {
        name: 'scroll',
        x: e.offsetX,
        y: e.offsetY,
        scrollX: this.metrics.scrollX,
        scrollY: this.metrics.scrollY
      };
    }
  }

  /**
   * Обработчик события движения мышки
   * @param e {MouseEvent}
   */
  onMouseMove = e => {
    if (this.action.name === 'drag') {
      this.action.x = e.offsetX / this.metrics.zoom;
      this.action.y = e.offsetY / this.metrics.zoom;
    }

    if (this.action.name === 'scroll') {
      const dx = e.offsetX - this.action.x;
      const dy = e.offsetY - this.action.y;
      this.scroll({
        x: this.action.scrollX - dx,
        y: this.action.scrollY - dy,
      });
    }
  }

  /**
   * Обработчик события отжатия кнопки мышки
   */
  onMouseUp = () => {
    this.action = {};
  }

  /**
   * Отрисовка массива фигур
   */
  draw() {
    if (this.needDraw) {
      this.ctx.save();
      // Скролл
      this.ctx.translate(-this.metrics.scrollX, -this.metrics.scrollY);
      // Зум
      this.ctx.scale(this.metrics.zoom, this.metrics.zoom);
      // Очистка канваса в соответствии с размерами канваса, окролом и зумом
      this.clear();

      const time = performance.now();
      // Обход массива из id примитивов и отрисовка примитива
      Object.keys(this.figures).forEach(id => {
        const figure = this.figures[id];

        if (figure.id === this.selectedFigure.id) {
          this.setSelectedFigureProps(this.selectedFigure.figureProps);
          figure.draw({
            time,
            dpr: this.dpr,
            newX: this.action.name === 'drag' ? this.action.x - this.action.dx : null,
            newY: this.action.name === 'drag' ? this.action.y - this.action.dy : null,
            isSelected: true
          });
        } else {
          figure.draw({time, dpr: this.dpr});
        }
      });
      this.ctx.restore();
    }
    window.requestAnimationFrame(() => this.draw());
  }
}

export default Tool;
