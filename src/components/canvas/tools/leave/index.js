import Tool from "@src/components/canvas/tools";

class Leave extends Tool {
  constructor({canvas, figureProps, time, id, img}) {
    super();
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.figureProps = figureProps;
    this.figureProps.y = 0 - img.height * (1 + Math.random());
    this.s = 0.021 * Math.random() + 0.02;
    this.time = time;
    this.id = id;
    this.img = img;
    this.globalAlpha = this.ctx.globalAlpha;
    this.angle = 0;
    this.iterationCount = Math.floor(Math.random() * 10);
    this.directions = ['left', 'right'];
    this.currentDirection = this.getMove();
    this.currentRotation = this.getMove();
  }

  /**
   * Проверка вхождения координаты мышки в область фигуры
   * @param mouseX {number}
   * @param mouseY {number}
   */
  isContain(mouseX, mouseY) {
    return (this.figureProps.x <= mouseX && mouseX <= this.figureProps.x + this.img.width)
      && (this.figureProps.y <= mouseY && mouseY <= this.figureProps.y + this.img.height);
  }

  /**
   * Получение рандомного значения из диапазона включительно
   * @param min {number}
   * @param max {number}
   * @return {number}
   */
  getRandomIntInclusive(min, max) {
    const ceilMin = Math.ceil(min);
    let floorMax = Math.floor(max);
    return Math.floor(Math.random() * (floorMax - ceilMin + 1)) + ceilMin;
  }

  /**
   * Установка свойств в начальные значения для повторной итерации появления на канвасе
   */
  setInitProps() {
    this.figureProps.x = this.getRandomIntInclusive(0, this.canvas.width);
    this.figureProps.y = 0 - this.img.height * (1 + Math.random());
    this.s = 0.021 * Math.random() + 0.02;
    this.time = performance.now();
    this.angle = 0;
    this.currentDirection = this.getMove();
    this.currentRotation = this.getMove();
    this.iterationCount = this.getRandomIntInclusive(10, 100);
  }

  /**
   * Получение направления на основе рандомного значения из диапазона
   * @return {string}
   */
  getMove() {
    return this.directions[this.getRandomIntInclusive(0, 1)];
  }

  /**
   * Получение значения для инкриминирования
   * @return {number}
   */
  getValueMove(direction) {
    switch (direction) {
      case 'right':
        return this.s;
      case 'left':
        return -this.s;
      default:
        return 0;
    }
  }

  /**
   * Отрисовка изображения
   *   * @param time {number}
   *    * @param dpr {number}
   *    * @param newX {number}
   *    * @param newY {number}
   *    * @param isSelected {bool}
   *    */
  draw({time, dpr, newX, newY, isSelected}) {
    this.iterationCount += Math.floor(Math.random() * 10);

    if (!(this.iterationCount % 9999)) {
      if (this.currentDirection !== this.getMove()) {
        this.currentDirection = this.getMove();
      }
      if (this.currentRotation !== this.getMove()) {
        this.currentRotation = this.getMove();
      }
    }
    // Инкриминирование направления движения
    this.figureProps.x += this.getValueMove(this.currentDirection);
    // Инкриминирование угла поворота
    this.angle += this.getValueMove(this.currentRotation);

    const bottom = this.canvas.height / dpr - this.figureProps.h;

    if (this.figureProps.y - this.img.height < bottom) {
      this.figureProps.y += this.s;
    } else if (this.figureProps.y > bottom) {
      this.setInitProps();
    }

    this.ctx.save();
    this.ctx.translate(this.figureProps.x + this.img.width / 2, this.figureProps.y + this.img.height / 2);
    this.ctx.rotate(this.angle * Math.PI / 180);
    this.ctx.translate(-(this.figureProps.x + this.img.width / 2), -(this.figureProps.y + this.img.height / 2));

    if (isSelected) {
      this.ctx.strokeStyle = this.figureProps.strokeStyle;
      this.ctx.lineWidth = 2;
      this.figureProps.x = newX || this.figureProps.x;
      this.figureProps.y = newY || this.figureProps.y;

      this.ctx.beginPath();
      this.ctx.rect(this.figureProps.x, this.figureProps.y, this.img.width, this.img.height);
      this.ctx.stroke();
      this.ctx.closePath();

      this.time = newY ? performance.now() : this.time;
    }

    this.ctx.drawImage(this.img, this.figureProps.x, this.figureProps.y);
    this.ctx.restore();
  }
}

export default Leave;
