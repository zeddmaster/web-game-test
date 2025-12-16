
export function applyElementStyles(element: HTMLElement, styles: string|object){
  if(typeof styles === 'string') {
    element.style = styles;
  }
  else if(typeof styles === 'object') {
    Object.assign(element.style, styles);
  }
}

export function applyElementClassList(element: Element, classList: string[]) {
  element.classList.add(...classList);
}