import {renderTemplate} from "./views/core/template-render.ts";

export class Scene {

  constructor(
    public readonly template: any
  ) {}

  protected DOMElement?: Element;


  render(): Element|null
  {
    if(!this.DOMElement)
      this.DOMElement = renderTemplate(this.template);

    return this.DOMElement;
  }
}