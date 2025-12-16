import Level1 from "./new/levels/level-1.ts";
import {BasicEntity} from "./new/entities/BasicEntity.ts";


function getRootElement(){
  const root = document.getElementById('root');
  if(!root)
    throw new Error('Cannot create launch without #root element');

  return root;
}


function getRandomMinMax(min: number, max: number, double: boolean = false) {
  const random = Math.random() * (max - min) + min;
  if(double)
    return random;

  return Math.floor(random);
}


document.addEventListener('DOMContentLoaded', function(){


  // new version
  /*
   * - будет несколько уровней.
   * - каждый уровень содержит свою описанную схему, сцену, объекты и т.д.
   * - нужны механизмы инициализации и деинициализации уровня
   *
   * 1. Инициализация уровня
   * - создаем сцену
   * - создаем список объектов (элемент, позиция и свойства)
   * - все созданные объекты записываются в массив
   *
   * 2. Рендер
   * - каждый кадр пробегаемся по списку объектов и вызываем у них метод render
   *
   * # Что делать с коллизиями?
   * Я видел в уроках что чел делал рендер коллизий для всех объектов. Т.е. проходил по каждому объекту, который имел коллизии
   * и в цикле для каждого из соседей рендерил... Неудобно...
   *
   * # Что делать с камерой?
   * Поскольку в качестве камеры у нас выступает скролл браузера - то осталю это уникальным механизмом
   *
   *
   */

  try {

    const root = getRootElement()
    const level = Level1;
    level.init();
    root.append(level.getDOMElement());


    setInterval(() => {
      const randomEntity = level.entities[getRandomMinMax(0, level.entities.length)]

      if(randomEntity instanceof BasicEntity){
        randomEntity.setPosition(
          getRandomMinMax(0, 1920),
          getRandomMinMax(0, 1080)
        )
          .setHeight(getRandomMinMax(100, 300))
          .setWidth(getRandomMinMax(100, 300))
      }
    }, 1000);


  } catch (e) {
    console.error(e);
  }



})