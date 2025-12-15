import {Level} from "../Level.ts";
import {Scene} from "../Scene.ts";
import {BasicEntity} from "../entities/BasicEntity.ts";


const scene = new Scene(`<div id="scene"></div>`);

const entities = [


  new BasicEntity()
    .setPosition(300, 500)
    .setHeight(300)
    .setWidth(500)
    .setTemplate('<div class="let">entity 1</div>'),


  new BasicEntity()
    .setPosition(500, 700)
    .setHeight(200)
    .setWidth(600)
    .setTemplate('<div class="let">entity 2</div>'),


  new BasicEntity()
    .setPosition(1300, 700)
    .setHeight(350)
    .setWidth(600)
    .setTemplate('<div class="let">entity 3</div>')

];

export default new Level(scene, entities);

// const Level1 = new Level()