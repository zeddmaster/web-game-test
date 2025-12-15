import type {Vector} from "../../Vector.ts";

export interface HasPosition {

  readonly position: Vector;
  readonly height: number;
  readonly width: number;

}