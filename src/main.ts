import {makeLevel_1} from "./new/levels/level-1.ts";
import {MainExecutor} from "./core/MainExecutor.ts";


/*function getRandomMinMax(min: number, max: number, double: boolean = false) {
  const random = Math.random() * (max - min) + min;
  if(double)
    return random;

  return Math.floor(random);
}*/





document.addEventListener('DOMContentLoaded', function(){

  try {
    const executor = new MainExecutor('root');

    const level = makeLevel_1();

    executor.setLevel(level);
    executor.setEntities(level.entities);

    executor.run();

  } catch (e) {
    console.error(e);
  }


})