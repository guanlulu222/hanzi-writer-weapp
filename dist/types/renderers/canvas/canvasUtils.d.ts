import { Point } from '../../typings/types';
export declare const drawPath: (ctx: CanvasRenderingContext2D, points: Point[]) => void;
/**
 * Break a path string into a series of canvas path commands
 *
 * Note: only works with the subset of SVG paths used by MakeMeAHanzi data
 * @param pathString
 */
export declare const pathStringToCanvas: (pathString: string) => (ctx: CanvasRenderingContext2D) => void;
