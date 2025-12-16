import type {Scene} from "./Scene.ts";
import type {AbstractEntity} from "./entities/AbstractEntity.ts";

export class Level {

  public readonly scene: Scene;
  public readonly entities: AbstractEntity[];

  protected DOMElement?: Element;

  constructor(scene: Scene, entities: AbstractEntity[]) {
    this.scene = scene;
    this.entities = entities;
  }


  public init()
  {
    if(!this.DOMElement){
      const sceneElement = this.scene.render();
      if(!sceneElement)
        throw new Error('Не удалось создать сцену');

      this.DOMElement = sceneElement;

      for(const entity of this.entities){
        const entityElement = entity.render();
        if(entityElement){
          sceneElement.append(entityElement);
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