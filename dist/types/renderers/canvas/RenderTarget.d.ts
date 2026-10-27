import RenderTargetBase from '../RenderTargetBase';
import { Point } from '../../typings/types';
declare type BoundEvent = {
    getPoint(): Point;
    preventDefault(): void;
};
export default class RenderTarget extends RenderTargetBase<HTMLCanvasElement> {
    private _startCb;
    private _moveCb;
    private _endCb;
    constructor(canvas: HTMLCanvasElement);
    static init(elmOrId: string | HTMLCanvasElement, width?: string, height?: string): RenderTarget;
    getContext(): CanvasRenderingContext2D | null;
    addPointerStartListener(callback: (arg: BoundEvent) => void): void;
    addPointerMoveListener(callback: (arg: BoundEvent) => void): void;
    addPointerEndListener(callback: () => void): void;
    emitTouchStart(x: number, y: number): void;
    emitTouchMove(x: number, y: number): void;
    emitTouchEnd(): void;
    updateDimensions(width: string | number, height: string | number): void;
    getBoundingClientRect(): {
        left: number;
        top: number;
        width: number;
        height: number;
        x: number;
        y: number;
        bottom: number;
        right: number;
        toJSON: () => string;
    };
    private _mpEvent;
}
export {};
