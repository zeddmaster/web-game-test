document.addEventListener('DOMContentLoaded', function(){

    const element = document.querySelector('#scene .entity')

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


class HandlingRegister {

    activeKeys = []

    #binds = {
        'keydown': this.onKeyDown,
        'keyup': this.onKeyUp,
    }

    bind(){
        for(const type in this.#binds)
            document.addEventListener(type, this.#binds[type].bind(this))
    }

    unbind(){
        for(const type in this.#binds)
            document.removeEventListener(type, this.#binds[type].bind(this))
    }

    onKeyDown(e){
        if(!e.code || this.activeKeys.includes(e.code))
            return;

        this.activeKeys.push(e.code)
    }

    onKeyUp(e){
        if(!e.code || !this.activeKeys.includes(e.code))
            return;

        const i = this.activeKeys.indexOf(e.code)
        this.activeKeys.splice(i, 1)
    }

    isLeft(){
        const codes = ['ArrowLeft', 'Digit4', 'KeyA'];
        for(const code of codes){
            if(this.activeKeys.includes(code))
                return true;
        }
        return false;
    }

    isRight(){
        const codes = ['ArrowRight', 'Digit6', 'KeyD'];
        for(const code of codes){
            if(this.activeKeys.includes(code))
                return true;
        }
        return false;
    }

    isDown(){
        const codes = ['ArrowDown', 'Digit8', 'KeyS'];
        for(const code of codes){
            if(this.activeKeys.includes(code))
                return true;
        }
        return false;
    }
    isUp(){
        const codes = ['ArrowUp', 'Digit2', 'KeyW'];
        for(const code of codes){
            if(this.activeKeys.includes(code))
                return true;
        }
        return false;
    }

}


/* CHARACTER STATES */
const IDLE_STATE = 'idle'
const WALK_STATE = 'walk'
const FALLING_STATE = 'falling'
const JUMP_STATE = 'jump'
const RIGHT_STATE = 'right'
const LEFT_STATE = 'left'



class MovingEntity {

    constructor(target, handling) {
        this.handling = handling
        this.target = target;
        this.speedX = 0;
        this.speedY = 0;

        // for collisions
        this.height = target.offsetHeight;
        this.width = target.offsetWidth;

        // states
        this._states = [IDLE_STATE, RIGHT_STATE]
    }


    set states(value) {
        this._states = value

        // update target
        this.target.setAttribute('data-state', value.join(','))
    }

    get states() {
        return this._states
    }


    #getCurrentPos() {
        return {
            x: parseFloat(this.target.style.left || 0),
            y: parseFloat(this.target.style.top || 0),
        };
    }

    render(frame) {

        /*
         * 1. Speed Preprocessor (collisions)
         * 2. Gravity processor
         * 3. Speed Applier
         * 4. Scroll camera
         */

        const {collisions, wall} = this.collisions()
        const gravityFactor = 2


        // 1. Speed preprocessor
        // limit speed by walls
        let speedY = this.speedY > 0 && wall.bottom ? 0 :
            this.speedY < 0 && wall.top ? 0 : this.speedY;
        let speedX = this.speedX > 0 && wall.right ? 0 :
            this.speedX < 0 && wall.left ? 0 : this.speedX;


        // 2. Gravity processor
        if(!wall.bottom) {
            speedY += gravityFactor
        }

        // 3. Speed applier
        const currentPos = this.#getCurrentPos()
        this.target.style.left = currentPos.x + speedX + 'px';
        this.target.style.top = currentPos.y + collisions.correctY + speedY + 'px';


        // 4. Scroll camera
        window.scrollTo(
            Math.max(currentPos.x - window.innerWidth / 2 + this.width / 2 - speedX, 0),
            Math.max(currentPos.y - window.innerHeight / 2 + this.height / 2 - speedY, 0)
        )

        // dirX и dirY - это сила применяемая на объект с помощью контроллера
        // влияет на конечную скорость движения
        let dirX = 0,
            dirY = 0;

        if(this.handling.isLeft()) {
            dirX += 1
            this.setState(LEFT_STATE)
        }
        if(this.handling.isRight()) {
            dirX -= 1
            this.setState(RIGHT_STATE)
        }
        if(this.handling.isUp()) {
            if(wall.bottom)
                dirY += 35
            else if(speedY < -1)
                dirY += (gravityFactor * .5)
        }

        if(this.handling.isDown())
            dirY -= 3


        // jumping
        if(speedY < 0)
            this.setState(JUMP_STATE)

        // falling
        else if(speedY > 0)
            this.setState(FALLING_STATE)

        // walking
        else if(speedX !== 0)
            this.setState(WALK_STATE)

        else if(wall.bottom)
            this.setState(IDLE_STATE)


        const hSpeedFactor = wall.bottom ? 8 : 15;

        this.speedX = dirX || Math.abs(speedX) > .5 ? (speedX + (dirX * hSpeedFactor + speedX) * -.1) : 0
        this.speedY = dirY || Math.abs(speedY) > .5 ? (speedY + (dirY * 10 + speedY) * -.1) : 0

        // debug
        document.querySelector('#debug input[name="speedX"]').value = speedX
        document.querySelector('#debug input[name="speedY"]').value = speedY
        document.querySelector('textarea').value = JSON.stringify({collisions, wall}, null, 2)
    }


    /**
     * State logic
     * @param state
     */
    setState(state) {
        if (this.states.includes(state))
            return;

        if ([RIGHT_STATE, LEFT_STATE].includes(state)) {
            const states = this.states.filter(s => ![RIGHT_STATE, LEFT_STATE].includes(s))
            states.push(state)

            this.states = states
            return;
        }

        const states = this.states.filter(s => [RIGHT_STATE, LEFT_STATE].includes(s))
        states.push(state)

        this.states = states;
    }


    hasState(state) {
        return this.states.includes(state)
    }



    collisions(){


        // вектор корректировки
        const collisions = {
            correctY: 0,
            correctX: 0
        }

        const wall = {
            top: false,
            bottom: false,
            right: false,
            left: false,
        }

        const scene = document.getElementById('scene')
        const coords = this.#getCurrentPos()

        const elements = [... scene.querySelectorAll('.let')]

        elements.forEach(el => {
            if(el === this.target)
                return;

            const item = {
                y: el.offsetTop,
                x: el.offsetLeft,
                height: el.offsetHeight,
                width: el.offsetWidth
            }

            // 1. AABB - быстрая проверка
            const existsCollision = coords.x < item.x + item.width
                                 && coords.x + this.width > item.x
                                 && coords.y < item.y + item.height
                                 && coords.y + this.height > item.y;

            if(!existsCollision)
                return;


            // collisions.correctX = ((coords.x + this.width / 2) - (item.x + item.width / 2)) / 2;
            // collisions.correctY = ((coords.y + this.height / 2) - (item.y + item.height / 2)) / 2;
            //
            // console.log(collisions.correctY);

            // todo: может быть это мне поможет - https://habr.com/ru/articles/336908/

            const offset = el.dataset.offset || 10;

            // bottom
            if(!wall.bottom){
                const coordsB = [item.x, item.y],
                      coordsC = [item.x + item.width, item.y];

                wall.bottom = this.#collisionPoint([coords.x, coords.y + this.height], coordsB, coordsC, 0, offset)
                           || this.#collisionPoint([coords.x + this.width, coords.y + this.height], coordsB, coordsC, 0, offset)
            }

            // top
            if(!wall.top){
                const coordsB = [item.x, item.y + item.height],
                    coordsC = [item.x + item.width, item.y + item.height];

                wall.top = this.#collisionPoint([coords.x, coords.y], coordsB, coordsC, 0, offset * -1)
                         || this.#collisionPoint([coords.x + this.width, coords.y], coordsB, coordsC, 0, offset * -1)
            }

            // left
            if(!wall.left){
                const coordsB = [item.x + item.width, item.y],
                    coordsC = [item.x + item.width, item.y + item.height];

                wall.left = this.#collisionPoint([coords.x, coords.y], coordsB, coordsC, offset * -1)
                         || this.#collisionPoint([coords.x, coords.y + this.height], coordsB, coordsC, offset * -1)
            }

            // right
            if(!wall.right){
                const coordsB = [item.x, item.y],
                    coordsC = [item.x, item.y + item.height];

                wall.right = this.#collisionPoint([coords.x + this.width, coords.y], coordsB, coordsC, offset)
                         || this.#collisionPoint([coords.x + this.width, coords.y + this.height], coordsB, coordsC, offset)
            }

        })

        return { wall, collisions };
    }


    #collisionPoint(coordsA, coordsB, coordsC, offsetX = 0, offsetY = 0){
        // console.log(coordsA, coordsB, coordsC)
        return this.#isBetween(coordsA[0], coordsB[0], coordsC[0] + offsetX) // x
            && this.#isBetween(coordsA[1], coordsB[1], coordsC[1] + offsetY) // y
    }

    #isBetween(value, a, b, inclusive = true) {
        const min = Math.min(a, b),
              max = Math.max(a, b);

        return inclusive ? value >= min && value <= max : value > min && value < max;
    }

}