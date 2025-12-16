import {COLLISION_CLASS_NAME} from "../enums/defaults.enum.ts";
import {applyElementClassList, applyElementStyles} from "./core/view-helper.ts";


export interface IDebugBoxOptions {
  collisions?: boolean,
  styles?: string|object,
  classList?: string[],
}


export function useDebugBox(options?: IDebugBoxOptions)  {

  const element = document.createElement('div');

  // apply collision class
  if(options?.collisions)
    element.classList.add(COLLISION_CLASS_NAME);

  // apply classList
  if(options?.classList)
    applyElementClassList(element, options.classList)

  if(options?.styles)
    applyElementStyles(element, options.styles);


  return element;

}

export function useDebugBox2(options?: IDebugBoxOptions)  {

  const element = useDebugBox(options);
  element.innerHTML = `<img src="/assets/cat/idle.gif" style="width: 100%; height: 100%;" alt=""/>`

  return element;

}