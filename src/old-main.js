import {HandlingRegister} from "./core/HandlingRegister.js";
import {MovingEntity} from "./core/MovingEntity.js";
import {useLoaderToggler} from "./utils/loader.js";
import {useModals} from "./utils/modals.js";

document.addEventListener('DOMContentLoaded', function(){


    // loader
    const loaderElement = document.querySelector('#loader');
    const {setLoaderVisible} = useLoaderToggler(loaderElement);

    setTimeout(() => {
        setLoaderVisible(false);
    }, 1000);


    useModals();


    const element = document.querySelector('#scene .entity');


    // bind key handling
    const handling = new HandlingRegister()
    handling.bind()

    const entity = new MovingEntity(element, handling)

    const FPS = 60;
    let frame = 1;

    setInterval(() => {
        frame = frame + 1 > FPS ? 1 : frame + 1;
        requestAnimationFrame(() => entity.render(frame));
    }, 1000 / FPS)



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

})