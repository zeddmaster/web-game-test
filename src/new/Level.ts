import type {Scene} from "./Scene.ts";
import type {AbstractEntity} from "./entities/AbstractEntity.ts";

export class Level {

  public readonly scene: Scene;
  public readonly entities: AbstractEntity[];

  constructor(scene: Scene, entities: AbstractEntity[]) {
    this.scene = scene;
    this.entities = entities;
  }


  public render(): Element
  {
    const sceneElement = this.scene.render();
    if(!sceneElement)
      throw new Error('Не удалось создать сцену');

    for(const entity of this.entities){
      const entityElement = entity.render();
      if(entityElement){
        sceneElement.append(entityElement);
      }
    }

    return sceneElement;
  }
}