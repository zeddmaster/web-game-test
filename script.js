document.addEventListener('DOMContentLoaded', function(){

    const element = document.querySelector('#scene .entity')

    // bind key handling
    const handling = new HandlingRegister()
    handling.bind()

    const entity = new MovingEntity(element, handling)

    let count = 0

    setInterval(() => {
        requestAnimationFrame(() => tick(count++))
    }, 25)

    function tick(frame){
        entity.render()
    }


    // show test windows
    window.addEventListener('scroll', (e) => {
        requestAnimationFrame(() => {
            const elements = [... document.querySelectorAll('section.test-form.hidden')]

            for(const elem of elements){
                if(window.scrollX + window.innerWidth * .6 >= elem.offsetLeft)
                    elem.classList.remove('hidden');
            }
        })
    })

    // buttons
    const buttons = document.querySelectorAll('button')
    const messages = [
        'Кнопки не работают, можешь не пытаться',
        'Я ж говорю, не работают)',
        'Dear user, the buttons do not work ⚠',
        'Ну перестань, прекрати это делать',
        'Доиграешься',
        '...',
        '',
        '',
        '',
        '',
        'Ну не работают кнопки емаЁ!',
        'звоню в дурку...',
        'за тобой уже выехали',
        '😡😤😤',
        'все, никаких больше кнопок',
    ];

    for(const btn of buttons){
        btn.addEventListener('click', (e) => {

            const i = +localStorage.getItem('btnMsgIndex') || 0

            alert(messages[i])

            if(messages[i + 1] === undefined){
                for(const btn of buttons){
                    btn.style.display = 'none';
                }
                return;
            }

            localStorage.setItem('btnMsgIndex', `${i+1}`)
        })
    }




    // Hide loader
    setTimeout(() => {
        document.getElementById('loader').classList.add('hidden')
    }, 1500)

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


    #getCurrentPos(){
        return {
            x: parseFloat(this.target.style.left || 0),
            y: parseFloat(this.target.style.top || 0),
        };
    }

    render(){

        /*
         * 1. Speed Preprocessor (collisions)
         * 2. Gravity processor
         * 3. Speed Applier
         * 4. Scroll camera
         */

        const collisions = this.collisions()
        const gravityFactor = 3


        // 1. Speed preprocessor
        // calc speed by collisions
        let speedY = this.speedY > 0 && collisions.bottom ? 0 :
            this.speedY < 0 && collisions.top ? 0 : this.speedY;
        let speedX = this.speedX > 0 && collisions.right ? 0 :
            this.speedX < 0 && collisions.left ? 0 : this.speedX;


        // 2. Gravity processor
        if(!collisions.bottom)
            speedY += gravityFactor


        // 3. Speed applier
        const currentPos = this.#getCurrentPos()
        this.target.style.left = currentPos.x + speedX + 'px';
        this.target.style.top = currentPos.y + speedY + 'px';


        // 4. Scroll camera
        window.scrollTo(
            Math.max(currentPos.x - window.innerWidth / 2 - speedX, 0),
            Math.max(currentPos.y - window.innerHeight / 2 - speedY, 0)
        )


        let dirX = 0,
            dirY = 0;

        if(this.handling.activeKeys.includes('KeyA')) {
            dirX += 1
            this.setState(LEFT_STATE)
        }
        if(this.handling.activeKeys.includes('KeyD')) {
            dirX -= 1
            this.setState(RIGHT_STATE)
        }
        if(this.handling.activeKeys.includes('KeyW')) {
            if(collisions.bottom)
                dirY += 35
            else if(speedY < -1)
                dirY += (gravityFactor * .5)
        }

        if(this.handling.activeKeys.includes('KeyS'))
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

        else if(collisions.bottom)
            this.setState(IDLE_STATE)


        // speedY += gravityFactor

        const hSpeedFactor = collisions.bottom ? 8 : 20;

        this.speedX = dirX || Math.abs(speedX) > .5 ? (speedX + (dirX * hSpeedFactor + speedX) * -.1) : 0
        this.speedY = dirY || Math.abs(speedY) > .5 ? (speedY + (dirY * 10 + speedY) * -.1) : 0

        // debug
        document.querySelector('#debug input[name="speedX"]').value = speedX
        document.querySelector('#debug input[name="speedY"]').value = speedY
        document.querySelector('textarea').value = JSON.stringify(collisions, null, 2)

        // animations
        /*if(this.speedX > 0){
            this.target.setAttribute('data-state', 'right')
        }
        else if(this.speedX < 0){
            this.target.setAttribute('data-state', 'left')
        }*/

        this.target.setAttribute('data-idle', !this.speedX ? 'true' : 'false')

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

        const data = {
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

            const offset = el.dataset.offset || 10;

            // bottom
            if(!data.bottom){
                const coordsB = [item.x, item.y],
                      coordsC = [item.x + item.width, item.y];

                data.bottom = this.#collisionPoint([coords.x, coords.y + this.height], coordsB, coordsC, 0, offset)
                           || this.#collisionPoint([coords.x + this.width, coords.y + this.height], coordsB, coordsC, 0, offset)
            }

            // top
            if(!data.top){
                const coordsB = [item.x, item.y + item.height],
                    coordsC = [item.x + item.width, item.y + item.height];

                data.top = this.#collisionPoint([coords.x, coords.y], coordsB, coordsC, 0, offset * -1)
                         || this.#collisionPoint([coords.x + this.width, coords.y], coordsB, coordsC, 0, offset * -1)
            }

            // left
            if(!data.left){
                const coordsB = [item.x + item.width, item.y],
                    coordsC = [item.x + item.width, item.y + item.height];

                data.left = this.#collisionPoint([coords.x, coords.y], coordsB, coordsC, offset * -1)
                         || this.#collisionPoint([coords.x, coords.y + this.height], coordsB, coordsC, offset * -1)
            }

            // right
            if(!data.right){
                const coordsB = [item.x, item.y],
                    coordsC = [item.x, item.y + item.height];

                data.right = this.#collisionPoint([coords.x + this.width, coords.y], coordsB, coordsC, offset)
                         || this.#collisionPoint([coords.x + this.width, coords.y + this.height], coordsB, coordsC, offset)
            }

        })

        return data;
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