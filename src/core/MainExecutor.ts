import type {Level} from "../new/Level.ts";
import {HandlingRegister} from "./HandlingRegister.ts";


export class MainExecutor {

  protected root: HTMLElement;

  protected running: boolean = false;
  protected timer?: number;

  protected level?: Level;
  protected entities: any[] = [];

  protected handling: HandlingRegister;


  constructor(element: string|HTMLElement) {

    // find element by ID
    if(!(element instanceof HTMLElement)) {
      const findElement = document.getElementById(element);
      if(!findElement)
        throw new Error('Cannot find Root HTML element');

      element = findElement;
    }

    this.root = element;
    this.handling = new HandlingRegister();
    this.handling.bind();
  }


  run() {
    this.running = true;
    this.timer = setInterval(() => {

      if(!this.running) {
        clearInterval(this.timer);
        return;
      }

      this.renderHandler();

    }, 1000 / 60)
  }

  setLevel(level: Level) {
    this.level = level;
    this.level.render();

    // reset root content
    this.root.innerHTML = '';
    this.root.appendChild(
      this.level.getDOMElement()
    )
  }

  setEntities(entities: any[]) {
    this.entities = entities;
  }


  protected renderHandler(){

    this.entities.forEach(entity => {
      entity.render({
        handling: this.handling
      });
    })
  }


}
