import {AbstractEntity} from "./AbstractEntity.ts";
import {Vector} from "../Vector.ts";
import {renderTemplate} from "../views/core/template-render.ts";

export class BasicEntity extends AbstractEntity
{
  position = new Vector(0, 0);
  height: number = 0;
  width: number = 0;
  template: any;

  protected DOMElement?: Element;

  setPosition(x: number, y: number){
    this.position.x = x;
    this.position.y = y;
    this.updateElementStyles();
    return this;
  }

  setHeight(height: number){
    this.height = height;
    this.updateElementStyles();
    return this;
  }

  setWidth(width: number) {
    this.width = width;
    this.updateElementStyles();
    return this;
  }

  setTemplate(template: any) {
    this.template = template;
    return this;
  }

  render(): Element|null
  {
    if(!this.DOMElement)
      this.DOMElement = renderTemplate(this.template);

    this.updateElementStyles();

    return this.DOMElement;
  }


  protected updateElementStyles(){
    const element = this.DOMElement;
    if(element instanceof HTMLElement) {
      element.style.top = `${this.position.y}px`;
      element.style.left = `${this.position.x}px`;
      element.style.height = `${this.height}px`;
      element.style.width = `${this.width}px`;
    }
  }

}