/* CHARACTER STATES */
const IDLE_STATE = 'idle'
const WALK_STATE = 'walk'
const FALLING_STATE = 'falling'
const JUMP_STATE = 'jump'
const RIGHT_STATE = 'right'
const LEFT_STATE = 'left'



export class MovingEntity {


    /**
     * @param target {HTMLElement}
     * @param handling {HandlingRegister}
     */
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
        this.target.style.left = currentPos.x + collisions.correctX + speedX + 'px';
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

            el.style.background = 'blue';

            /*const item = {
                y: el.offsetTop,
                x: el.offsetLeft,
                height: el.offsetHeight,
                width: el.offsetWidth
            }*/
            const item = this.getElemCoords(el);

            // 1. AABB - быстрая проверка
            const existsCollision = coords.x < item.x + item.width
                && coords.x + this.width > item.x
                && coords.y < item.y + item.height
                && coords.y + this.height > item.y;

            if(!existsCollision) {
                el.style.background = null;
                return;
            }

            if(el.dataset.trigger) {
                el.style.background = el.dataset.trigger
                // console.log(el.dataset.trigger);
            }

            // 2. детальная проверка
            const dy = (coords.y + this.height / 2) - (item.y + item.height / 2);
            const dx = (coords.x + this.width / 2) - (item.x + item.width / 2)

            let correctY = 0,
                correctX = 0;

            let wallBottom = false,
                wallTop = false,
                wallLeft = false,
                wallRight = false;

            if(Math.abs(dy) > 1){
                if(dy < 0 && !wall.bottom) {
                    // console.log('преграда снизу');
                    const collideSize = (coords.y + this.height - item.y) / 2;
                    correctY = Math.abs(collideSize) > 1 ? collideSize * -1 : 0;

                    wallBottom = true;
                }
                if(dy > 0 && !wall.top) {
                    // console.log('преграда сверху')
                    const collideSize = (item.y + item.height - coords.y) / 2
                    correctY = Math.abs(collideSize) > 1 ? collideSize : 0;
                    wallTop = true;
                }
            }

            if(Math.abs(dx) > 1) {
                if(dx < 0 && !wall.right) {
                    // console.log('преграда справа');
                    const collideSize = (coords.x + this.width - item.x) / 2;
                    correctX = Math.abs(collideSize) > 1 ? collideSize * -1 : 0;
                    wallRight = true;
                }
                if(dx > 0 && !wall.left) {
                    // console.log('преграда слева');
                    const collideSize = (coords.x - (item.x + item.width)) / 2
                    correctX = Math.abs(collideSize) > 1 ? collideSize * -1 : 0;
                    wallLeft = true;
                }
            }

            collisions.correctY += Math.abs(correctX) > 10 ? correctY : 0;
            collisions.correctX += Math.abs(correctY) > 20 ? correctX : 0;

            wall.bottom = wall.bottom || wallBottom && Math.abs(correctX) > 10;
            wall.top = wall.top || wallTop && Math.abs(correctX) > 10;
            wall.left = wall.left || wallLeft && Math.abs(correctY) > 10;
            wall.right = wall.right || wallRight && Math.abs(correctY) > 10;

        })

        return { wall, collisions };
    }


    getElemCoords(element) {
        const elRect = element.getBoundingClientRect();

        return {
            height: elRect.height,
            width: elRect.width,
            x: elRect.left + window.scrollX,
            y: elRect.top + window.scrollY
        }
    }


}