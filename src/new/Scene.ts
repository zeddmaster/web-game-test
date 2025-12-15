
export class Scene {

  constructor(
    public readonly template: any
  ) {}


  render(): Element|null
  {
    const template = document.createElement('template');
    template.innerHTML = this.template.trim();

    return template.content.firstElementChild;
  }
}