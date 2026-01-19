import {AbstractEntity} from "./AbstractEntity.ts";
import {Vector} from "../Vector.ts";
import {renderTemplate} from "../views/core/template-render.ts";

export class BasicEntity extends AbstractEntity
{
  protected position = new Vector(0, 0);
  protected height: number = 0;
  protected width: number = 0;

  protected template: any;
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

  init()
  {
    if(!this.DOMElement)
      this.DOMElement = renderTemplate(this.template);
  }

  getDOMElement()
  {
    return this.DOMElement;
  }

  render(): void
  {
    if(!this.DOMElement)
      this.DOMElement = renderTemplate(this.template);

    this.updateElementStyles();
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