import {AbstractEntity} from "./AbstractEntity.ts";
import {Vector} from "../Vector.ts";

export class BasicEntity extends AbstractEntity
{
  position = new Vector(0, 0);
  height: number = 0;
  width: number = 0;
  template: any;

  setPosition(x: number, y: number){
    this.position.x = x;
    this.position.y = y;
    return this;
  }

  setHeight(height: number){
    this.height = height;
    return this;
  }

  setWidth(width: number) {
    this.width = width;
    return this;
  }

  setTemplate(template: any) {
    this.template = template;
    return this;
  }

  render(): Element|null
  {
    const template = document.createElement('template');
    template.innerHTML = this.template.trim();

    if(!template.content.firstElementChild)
      throw new Error('Не удалось отрендерить объект');

    const entityElement = template.content.firstElementChild;

    // init start position
    if(entityElement instanceof HTMLElement) {
      entityElement.style.top = `${this.position.y}px`;
      entityElement.style.left = `${this.position.x}px`;
      entityElement.style.height = `${this.height}px`;
      entityElement.style.width = `${this.width}px`;
    }

    return entityElement;
  }

}