import { Point } from '../typings/types';
declare type BoundEvent = {
    getPoint(): Point;
    preventDefault(): void;
};
/** Generic render target */
export default class RenderTargetBase<TElement extends HTMLElement | SVGElement | SVGSVGElement | HTMLCanvasElement = HTMLElement> {
    node: TElement;
    constructor(node: TElement);
    addPointerStartListener(callback: (arg: BoundEvent) => void): void;
    addPointerMoveListener(callback: (arg: BoundEvent) => void): void;
    addPointerEndListener(callback: () => void): void;
    getBoundingClientRect(): DOMRect;
    updateDimensions(width: string | number, height: string | number): void;
    _eventify<TEvent extends Event>(evt: TEvent, pointFunc: (event: TEvent) => Point): {
        getPoint: () => Point;
        preventDefault: () => void;
    };
    _getMousePoint(evt: MouseEvent): Point;
    _getTouchPoint(evt: TouchEvent): Point;
}
export {};
