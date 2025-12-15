export class Vector {

  constructor(
    public x: number,
    public y: number
  ) {}

  public toObject() {
    return {
      x: this.x,
      y: this.y
    }
  }

  public add(vector: Vector): Vector
  {
    return new Vector(this.x + vector.x, this.y + vector.y);
  }

  public substract(vector: Vector): Vector
  {
    return new Vector(this.x - vector.x, this.y - vector.y);
  }

}