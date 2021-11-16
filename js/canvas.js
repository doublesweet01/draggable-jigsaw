class MyCanvas {
  constructor(canvas) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d');
    this.shapes = [];
    this.draggingShape = null;

    this.canvas.onmousedown = this.select;
    this.canvas.onmousemove = this.drag;
    this.canvas.onmouseup = this.unselect;
    this.canvas.onmouseout = this.unselect;
  }
  drag = (e) => {
    if (this.draggingShape === null) return;
    const { x, y } = this.getMousePosition(e);
    this.draggingShape.moveTo(x, y);
    this.draw();
  };
  getMousePosition = (e) => {
    const x = e.pageX - this.canvas.offsetLeft;
    const y = e.pageY - this.canvas.offsetTop;
    return { x, y };
  };
  select = (e) => {
    for (let i = 0; i < this.shapes.length; i++) {
      const shape = this.shapes[i];
      if (isInsidePolygon(this.getMousePosition(e), shape.getPolygon())) {
        this.draggingShape = this.shapes[i];
        return;
      }
    }
  };
  unselect = () => {
    this.draggingShape = null;
  };
  getCanvas = () => this.canvas;
  getContext = () => this.context;
  addShape = (shape) => {
    this.shapes.push(shape);
  };

  draw = () => {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (let i = 0; i < this.shapes.length; i++) {
      const shape = this.shapes[i];
      const polygon = shape.getPolygon();
      this.context.beginPath();
      this.context.moveTo(polygon[0].x, polygon[0].y);
      for (let j = 0; j < polygon.length; j++) {
        this.context.lineTo(polygon[j].x, polygon[j].y);
      }
      this.context.lineTo(polygon[0].x, polygon[0].y);
      this.context.strokeStyle = shape.getStrokeStyle();
      this.context.lineWidth = '3';
      this.context.fillStyle = shape.getColor();
      this.context.stroke();
      this.context.fill();
      this.context.closePath();
    }
  };
}

function isInsidePolygon(p, polygon) {
  let isInside = false;
  let minX = polygon[0].x;
  let maxX = polygon[0].x;
  let minY = polygon[0].y;
  let maxY = polygon[0].y;
  for (let n = 1; n < polygon.length; n++) {
    const q = polygon[n];
    minX = Math.min(q.x, minX);
    maxX = Math.max(q.x, maxX);
    minY = Math.min(q.y, minY);
    maxY = Math.max(q.y, maxY);
  }

  if (p.x < minX || p.x > maxX || p.y < minY || p.y > maxY) {
    return false;
  }

  let i = 0;
  let j = polygon.length - 1;
  for (i, j; i < polygon.length; j = i++) {
    if (
      polygon[i].y > p.y !== polygon[j].y > p.y &&
      p.x < ((polygon[j].x - polygon[i].x) * (p.y - polygon[i].y)) / (polygon[j].y - polygon[i].y) + polygon[i].x
    ) {
      isInside = !isInside;
    }
  }

  return isInside;
}
export default MyCanvas;