import {BasicEntity} from "./BasicEntity.ts";
import {EntityState} from "../enums/defaults.enum.ts";
import type {HandlingRegister} from "../../core/HandlingRegister.ts";

export class MovableEntity extends BasicEntity {

  protected speedX = 0;
  protected speedY = 0;

  declare protected DOMElement?: HTMLElement;

  protected states: string[] = [
    EntityState.IDLE,
    EntityState.RIGHT
  ];


  // @ts-ignore
  render({ handling }: { handling: HandlingRegister })
  {

    if(!this.DOMElement)
      throw new Error('DOMElement is not exists');

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
    const currentPos = this.getCurrentPos()
    this.DOMElement.style.left = currentPos.x + collisions.correctX + speedX + 'px';
    this.DOMElement.style.top = currentPos.y + collisions.correctY + speedY + 'px';


    // 4. Scroll camera
    window.scrollTo(
      Math.max(currentPos.x - window.innerWidth / 2 + this.width / 2 - speedX, 0),
      Math.max(currentPos.y - window.innerHeight / 2 + this.height / 2 - speedY, 0)
    )

    // dirX и dirY - это сила применяемая на объект с помощью контроллера
    // влияет на конечную скорость движения
    let dirX = 0,
      dirY = 0;

    if(handling.isLeft()) {
      dirX += 1
      this.setState(EntityState.LEFT)
    }
    if(handling.isRight()) {
      dirX -= 1
      this.setState(EntityState.RIGHT)
    }
    if(handling.isUp()) {
      if(wall.bottom)
        dirY += 35
      else if(speedY < -1)
        dirY += (gravityFactor * .5)
    }

    if(handling.isDown())
      dirY -= 3


    // jumping
    if(speedY < 0)
      this.setState(EntityState.JUMP)

    // falling
    else if(speedY > 0)
      this.setState(EntityState.FALLING)

    // walking
    else if(speedX !== 0)
      this.setState(EntityState.WALK)

    else if(wall.bottom)
      this.setState(EntityState.IDLE)


    const hSpeedFactor = wall.bottom ? 8 : 15;

    this.speedX = dirX || Math.abs(speedX) > .5 ? (speedX + (dirX * hSpeedFactor + speedX) * -.1) : 0
    this.speedY = dirY || Math.abs(speedY) > .5 ? (speedY + (dirY * 10 + speedY) * -.1) : 0

    this.setElementAttributes()
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

    const coords = this.getCurrentPos()

    const scene = document.getElementById('scene')
    if(!scene)
      throw new Error('Scene not found');

    // @ts-ignore
    const elements: HTMLElement[] = [... scene.querySelectorAll('.let')]

    elements.forEach(el => {
      if(el === this.DOMElement) {
        console.log('skip');
        return;
      }

      // el.style.background = 'blue';

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
        // el.style.background = '';
        return;
      }

      // if(el.dataset.trigger) {
      //   el.style.background = el.dataset.trigger
        // console.log(el.dataset.trigger);
      // }

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


  protected setElementAttributes(){

    // set current entity state
    this.DOMElement?.setAttribute('data-state', this.states.join(','))
  }


  protected getCurrentPos() {
    if(!this.DOMElement)
      throw new Error('Not exists DOM element');

    return {
      x: parseFloat(this.DOMElement.style.left || '0'),
      y: parseFloat(this.DOMElement.style.top || '0'),
    };
  }


  protected setState(state: string)
  {
    if(this.states.includes(state))
      return;

    const directionStates = [EntityState.RIGHT, EntityState.LEFT];

    // by direction states
    if(directionStates.includes(state)){
      const states = this.states.filter(s => !directionStates.includes(s))
      states.push(state);

      this.states = states;
      return;
    }

    // any states
    const states = this.states.filter(s => directionStates.includes(s));
    states.push(state);

    this.states = states;
  }



  protected getElemCoords(element: HTMLElement){
    const elRect = element.getBoundingClientRect();

    return {
      height: elRect.height,
      width: elRect.width,
      x: elRect.left + window.scrollX,
      y: elRect.top + window.scrollY
    }
  }

}