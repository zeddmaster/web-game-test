document.addEventListener('DOMContentLoaded', function(){

    const element = document.querySelector('#test1 .entity')

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




class MovingEntity {

    constructor(target, handling) {
        this.handling = handling
        this.target = target;
        this.speedX = 0;
        this.speedY = 0;

        // for collisions
        this.height = target.offsetHeight;
        this.width = target.offsetWidth;
    }

    #getCurrentPos(){
        return {
            x: parseFloat(this.target.style.left || 0),
            y: parseFloat(this.target.style.top || 0)
        }
    }

    render(){
        const currentPos = this.#getCurrentPos()
        this.target.style.left = currentPos.x + this.speedX + 'px';
        this.target.style.top = currentPos.y + this.speedY + 'px';

        let dirX = 0,
            dirY = 0 + this.gravityFactor();

        if(this.handling.activeKeys.includes('KeyA'))
            dirX += 1
        if(this.handling.activeKeys.includes('KeyD'))
            dirX -= 1
        if(this.handling.activeKeys.includes('KeyW'))
            dirY += 1
        if(this.handling.activeKeys.includes('KeyS'))
            dirY -= 1

        this.speedX = dirX || Math.abs(this.speedX) > .5 ? (this.speedX + (dirX * 10 + this.speedX) * -.1) : 0
        this.speedY = dirY || Math.abs(this.speedY) > .5 ? (this.speedY + (dirY * 10 + this.speedY) * -.1) : 0

        // debug
        document.querySelector('#debug input[name="speedX"]').value = this.speedX
        document.querySelector('#debug input[name="speedY"]').value = this.speedY


        // animations
        if(this.speedX > 0){
            this.target.setAttribute('data-state', 'right')
        }
        else if(this.speedX < 0){
            this.target.setAttribute('data-state', 'left')
        }

        this.target.setAttribute('data-idle', !this.speedX ? 'true' : 'false')

    }

    gravityFactor (){
        const collisionsData = this.collisions()
        document.querySelector('textarea').value = JSON.stringify(collisionsData, null, 2)
        return collisionsData.bottom ? 0 : -.3;
    }

    collisions(){

        const data = {
            top: false,
            bottom: false,
            right: false,
            left: false,
        }

        const scene = document.getElementById('test1')
        const coords = this.#getCurrentPos()

        const elements = [... scene.querySelectorAll('div')]

        elements.forEach(el => {
            if(el === this.target)
                return;

            const item = {
                y: el.offsetTop,
                x: el.offsetLeft,
                height: el.offsetHeight,
                width: el.offsetWidth
            }

            /*const bounds = {
                bottom: coords.y + this.height >= item.y && coords.y + this.height <= item.y + item.height,
                top: coords.y <= item.y + item.height && coords.y >= item.y,
                right: coords.x + this.width >= item.x && coords.x + this.width <= item.x + item.width,
                left: coords.x <= item.x + item.width && coords.x >= item.x
            }

            data.bottom = !data.bottom && bounds.bottom && (bounds.left || bounds.right)
            data.top = !data.top && bounds.top && (bounds.left || bounds.right)
            data.right = !data.right && bounds.right && (bounds.top || bounds.bottom)
            data.left = !data.left && bounds.left && (bounds.top || bounds.bottom)*/

            // 1. понять, что таргет в области препятствия
            // 2. рассчитать, с какой стороны препятствие

            const bounds = {
                bottom: coords.y + this.height >= item.y && coords.y + this.height <= item.y + item.height,
                top: coords.y <= item.y + item.height && coords.y >= item.y,
                right: coords.x + this.width >= item.x && coords.x + this.width <= item.x + item.width,
                left: coords.x <= item.x + item.width && coords.x >= item.x
            }

            data.bottom = !data.bottom && bounds.bottom && (bounds.left || bounds.right)
            data.top = !data.top && bounds.top && (bounds.left || bounds.right)
            data.right = !data.right && bounds.right && (bounds.top || bounds.bottom)
            data.left = !data.left && bounds.left && (bounds.top || bounds.bottom)

        })

        return data;
    }
}