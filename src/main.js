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

})