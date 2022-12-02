import Tool from "@src/components/canvas/tools";

class Circle extends Tool {
  constructor({canvas, figureProps, a, v, time, id}) {
    super();
    this.canvas = canvas;
    this.figureProps = figureProps;
    this.figureProps.h = 0;
    this.ctx = canvas.getContext("2d");
    this.a = a;
    this.v = v;
    this.time = time;
    this.id = id;
  }

  /**
   * Проверка вхождения координаты мышки в область фигуры
   * @param mouseX {number}
   * @param mouseY {number}
   */
  isContain(mouseX, mouseY) {
    return (mouseX - (this.figureProps.x + this.figureProps.w / 2)) ** 2
      + (mouseY - (this.figureProps.y + this.figureProps.w / 2)) ** 2 <= (this.figureProps.w / 2) ** 2;
  }

  /**
   * Отрисовка фигуры круга
   * @param time {number}
   * @param dpr {number}
   * @param newX {number}
   * @param newY {number}
   * @param isSelected {bool}
   */
  draw({time, dpr, newX, newY, isSelected}) {
    const bottom = this.canvas.height / dpr - this.figureProps.w;
    if (this.figureProps.y > bottom) {
      this.figureProps.y = bottom;
    }

    this.ctx.fillStyle = this.figureProps.fillStyle;
    this.ctx.strokeStyle = this.figureProps.strokeStyle;
    this.ctx.lineWidth = this.figureProps.lineWidth;
    this.ctx.lineCap = this.figureProps.lineCap;

    if (isSelected) {
      this.ctx.lineWidth = 2;
      this.figureProps.x = newX || this.figureProps.x;
      this.figureProps.y = newY || this.figureProps.y;
      this.time = newY ? performance.now() : this.time;
    }

    this.ctx.beginPath();
    this.ctx.arc(
      this.figureProps.x + this.figureProps.w / 2,
      this.figureProps.y + this.figureProps.w / 2,
      this.figureProps.w / 2, 0, 2 * Math.PI);
    this.ctx.fill();
    this.ctx.stroke();
    this.ctx.closePath();

    this.ctx.lineWidth = this.figureProps.lineWidth;

    const dt = (time - this.time) / 1000;
    if (this.figureProps.y < bottom) {
      this.figureProps.y += this.v * dt + this.a * dt * dt / 2;
    }
  }
}

export default Circle;
