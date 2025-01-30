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
            dirY = 0;

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


        // animations
        if(this.speedX > 0){
            this.target.setAttribute('data-state', 'right')
        }
        else if(this.speedX < 0){
            this.target.setAttribute('data-state', 'left')
        }

        this.target.setAttribute('data-idle', !this.speedX ? 'true' : 'false')


    }
}