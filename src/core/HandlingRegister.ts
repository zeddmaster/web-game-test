export class HandlingRegister {

  protected activeKeys: string[] = []

  #binds: Record<string, (e: Event) => void> = {
    'keydown': this.onKeyDown,
    'keyup': this.onKeyUp,
  }

  bind() {
    for (const type in this.#binds)
      document.addEventListener(type, this.#binds[type].bind(this))
  }

  unbind() {
    for (const type in this.#binds)
      document.removeEventListener(type, this.#binds[type].bind(this))
  }

  onKeyDown(e: Event) {
    if(!(e instanceof KeyboardEvent))
      return;

    if (!e.code || this.activeKeys.includes(e.code))
      return;

    this.activeKeys.push(e.code)
  }

  onKeyUp(e: Event) {
    if(!(e instanceof KeyboardEvent))
      return;

    if (!e.code || !this.activeKeys.includes(e.code))
      return;

    const i = this.activeKeys.indexOf(e.code)
    this.activeKeys.splice(i, 1)
  }

  isLeft() {
    const codes = ['ArrowLeft', 'Digit4', 'KeyA'];
    for (const code of codes) {
      if (this.activeKeys.includes(code))
        return true;
    }
    return false;
  }

  isRight() {
    const codes = ['ArrowRight', 'Digit6', 'KeyD'];
    for (const code of codes) {
      if (this.activeKeys.includes(code))
        return true;
    }
    return false;
  }

  isDown() {
    const codes = ['ArrowDown', 'Digit8', 'KeyS'];
    for (const code of codes) {
      if (this.activeKeys.includes(code))
        return true;
    }
    return false;
  }

  isUp() {
    const codes = ['ArrowUp', 'Digit2', 'KeyW'];
    for (const code of codes) {
      if (this.activeKeys.includes(code))
        return true;
    }
    return false;
  }

}
