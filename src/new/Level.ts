import type {Scene} from "./Scene.ts";
import type {AbstractEntity} from "./entities/AbstractEntity.ts";
import {BasicEntity} from "./entities/BasicEntity.ts";
import type {MovableEntity} from "./entities/MovableEntity.ts";

export class Level {

  public readonly scene: Scene;
  public readonly entities: (AbstractEntity|BasicEntity|MovableEntity)[]; // todo: fix types

  protected DOMElement?: Element;

  constructor(scene: Scene, entities: (AbstractEntity|BasicEntity|MovableEntity)[]) {
    this.scene = scene;
    this.entities = entities;
  }


  public render()
  {
    if(!this.DOMElement){
      const sceneElement = this.scene.render();
      if(!sceneElement)
        throw new Error('Не удалось создать сцену');

      this.DOMElement = sceneElement;

      for(const entity of this.entities){

        entity.init();

        if(entity instanceof BasicEntity){
          const entityElement = entity.getDOMElement();
          if(entityElement){
            sceneElement.append(entityElement);
          }
        }

      }
    }
  }


  public getDOMElement(): Element
  {
    if(!this.DOMElement){
      throw new Error('Cannot get DOM element');
    }
    return this.DOMElement;
  }

}