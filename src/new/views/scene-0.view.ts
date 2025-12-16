import {applyElementClassList, applyElementStyles} from "./core/view-helper.ts";

export interface ISceneViewOptions {
  elementId?: string;
  width?: number|string;
  height?: number|string;
  styles?: string|object;
  classList?: string[];

}

export function useSceneView(options?: ISceneViewOptions){

  const element = document.createElement('div');

  element.setAttribute('id', options?.elementId || 'scene');

  if(options?.styles)
    applyElementStyles(element, options.styles);

  if(options?.classList)
    applyElementClassList(element, options.classList);

  return element;
}