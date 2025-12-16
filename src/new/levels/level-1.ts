import {Level} from "../Level.ts";
import {Scene} from "../Scene.ts";
import {BasicEntity} from "../entities/BasicEntity.ts";
import {useDebugBox} from "../views/debug-box.view.ts";
import {useSceneView} from "../views/scene-0.view.ts";


const scene = new Scene(
  useSceneView({
    height: '1920px',
    width: '8000px',
    styles: {
      // background: `url('/assets/apartment.jpg') no-repeat`
    }
  })
);

const entities = [


  new BasicEntity()
    .setPosition(300, 500)
    .setHeight(300)
    .setWidth(500)
    .setTemplate(
      useDebugBox({
        collisions: true,
        styles: { borderColor: '#d14747' },
      })
    ),


  new BasicEntity()
    .setPosition(500, 700)
    .setHeight(200)
    .setWidth(600)
    .setTemplate(
      useDebugBox({
        collisions: true,
        styles: { borderColor: '#11a995' },
      })
    ),


  new BasicEntity()
    .setPosition(1300, 700)
    .setHeight(350)
    .setWidth(600)
    .setTemplate(
      useDebugBox({
        collisions: true,
        styles: { borderColor: '#5b9ffa' },
      })
    ),



];

export default new Level(scene, entities);

// const Level1 = new Level()