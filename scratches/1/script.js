class MovingEntity {

    constructor(target) {
        this.target = target;
    }


    move(x, y) {
        const currentPos = this.#getCurrentPos()
        this.target.style.left = currentPos.x + x + 'px';
        this.target.style.top = currentPos.y + y + 'px';
    }

    #getCurrentPos(){
        return {
            x: parseFloat(this.target.style.left || 0),
            y: parseFloat(this.target.style.top || 0)
        }
    }
}

const keymap = {
    KeyW: (e) => e.move(0, -5),
    KeyA: (e) => e.move(-5, 0),
    KeyS: (e) => e.move(0, 5),
    KeyD: (e) => e.move(5, 0),
}


document.addEventListener('DOMContentLoaded', function() {

    const element = document.querySelector('#test1 .entity');

    const entity = new MovingEntity(element);

    document.addEventListener('keydown', (e) => {
        console.log(e.code)
        if(keymap[e.code])
            keymap[e.code](entity)
    })
})



/*const framerate = 60;
const speedPerSec = 30;

function draw(element, frame, timer) {
    // timer = Math.floor(timer / (10000 / framerate))
    // element.style.top = Math.sin(timer) * 100 + 'px';
    // element.style.left = Math.cos(timer) * 100 + 'px';

    // let posX = (timer % 1000) / 1000 * speedPerSec

    const oldValue = element.style.left ? parseFloat(element.style.left) : 0;

    element.style.left = oldValue + speedPerSec + 'px';

}

const keymap = {
    KeyW: draw,
    KeyA: draw,
    KeyS: draw,
    KeyD: draw,
}


document.addEventListener('DOMContentLoaded', function(){

    const entity = document.querySelector('#test1 .entity');
    let currentFrame = 1

    /!*setInterval(() => {
        requestAnimationFrame(() => {
            draw(entity, currentFrame, (new Date).getTime());
        })

        /!*if(currentFrame + 1 > framerate)
            return currentFrame = 1*!/

        currentFrame++
    }, 1000 / framerate)*!/

    document.addEventListener('keydown', (e) => {
        if(keymap[e.code])
            keymap[e.code](entity)
    })
})*/

