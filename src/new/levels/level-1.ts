import {Level} from "../Level.ts";
import {Scene} from "../Scene.ts";
import {BasicEntity} from "../entities/BasicEntity.ts";
import {useActorBox, useDebugBox} from "../views/debug-box.view.ts";
import {useSceneView} from "../views/scene-0.view.ts";
import {MovableEntity} from "../entities/MovableEntity.ts";


export const makeLevel_1 = () => {

  const scene = new Scene(
    useSceneView({
      height: '1920px',
      width: '8000px',
      styles: {
        background: '#7db2ff',
        // background: `url('/assets/apartment.jpg') no-repeat`
      }
    })
  );


  const groundStyle = {
    borderColor: 'transparent',
    backgroundImage: 'url(./assets/grass.webp)',
    backgroundSize: 'contain',
    backgroundRepeat: 'repeat-x',
  }

  const entities = [


    // floor
    new BasicEntity()
      .setPosition(0, 1000)
      .setHeight(100)
      .setWidth(20000)
      .setTemplate(
        useDebugBox({
          collisions: true,
          styles: groundStyle,
        })
      ),


    // left wall
    new BasicEntity()
      .setPosition(0, 0)
      .setHeight(1000)
      .setWidth(50)
      .setTemplate(
        useDebugBox({
          collisions: true,
          styles: { borderColor: '#11a995' },
        })
      ),

    // first
    new BasicEntity()
      .setPosition(900, 800)
      .setHeight(200)
      .setWidth(600)
      .setTemplate(
        useDebugBox({
          collisions: true,
          styles: groundStyle,
        })
      ),

    new BasicEntity()
      .setPosition(1800, 400)
      .setHeight(100)
      .setWidth(100)
      .setTemplate(
        useDebugBox({
          collisions: true,
          styles: groundStyle,
        })
      ),

    new BasicEntity()
      .setPosition(2200, 500)
      .setHeight(100)
      .setWidth(100)
      .setTemplate(
        useDebugBox({
          collisions: true,
          styles: groundStyle,
        })
      ),

    new BasicEntity()
      .setPosition(2600, 400)
      .setHeight(100)
      .setWidth(100)
      .setTemplate(
        useDebugBox({
          collisions: true,
          styles: groundStyle,
        })
      ),

    new BasicEntity()
      .setPosition(3000, 500)
      .setHeight(100)
      .setWidth(100)
      .setTemplate(
        useDebugBox({
          collisions: true,
          styles: groundStyle,
        })
      ),

    new MovableEntity()
      .setPosition(200, 400)
      .setHeight(200)
      .setWidth(200)
      .setTemplate(
        useActorBox({
          collisions: true,
          classList: ['main-actor'],
          styles: {
            position: 'absolute',
            height: '200px',
            width: '200px'
          }
        })
      ),

    /*new MovableEntity()
      .setPosition(500, 400)
      .setHeight(200)
      .setWidth(200)
      .setTemplate(
        useDebugBox2({
          // collisions: true,
          styles: {
            left: '400px',
            position: 'absolute',
            background: '#fa8b5b',
            height: '200px',
            width: '200px'
          }
        })
      )*/
  ];

  return new Level(scene, entities);
}


// const Level1 = new Level()