import RenderTargetBase from '../RenderTargetBase';
import { Point } from '../../typings/types';

type BoundEvent = {
  getPoint(): Point;
  preventDefault(): void;
};

export default class RenderTarget extends RenderTargetBase<HTMLCanvasElement> {
  // 小程序 canvas 不支持 addEventListener，缓存回调供页面手动触发
  private _startCb: ((arg: BoundEvent) => void) | null = null
  private _moveCb: ((arg: BoundEvent) => void) | null = null
  private _endCb: (() => void) | null = null

  constructor(canvas: HTMLCanvasElement) {
    super(canvas);
  }

  static init(elmOrId: string | HTMLCanvasElement, width = '100%', height = '100%') {
    const element = elmOrId as HTMLCanvasElement;
    if (!element) throw new Error('HanziWriter target element not found');
    const canvas = element;
    canvas.width = typeof width === 'number' ? width : parseInt(String(width), 10) || 150;
    canvas.height = typeof height === 'number' ? height : parseInt(String(height), 10) || 150;
    return new RenderTarget(canvas);
  }

  getContext() {
    return this.node.getContext('2d');
  }

  // ── 存储回调（页面通过 emit* 方法手动触发）──

  addPointerStartListener(callback: (arg: BoundEvent) => void) { this._startCb = callback }
  addPointerMoveListener(callback: (arg: BoundEvent) => void) { this._moveCb = callback }
  addPointerEndListener(callback: () => void) { this._endCb = callback }

  // ── 供页面调用的触发方法 ──

  emitTouchStart(x: number, y: number) {
    this._startCb?.({ getPoint: () => ({ x, y }), preventDefault: () => {} })
  }
  emitTouchMove(x: number, y: number) {
    this._moveCb?.({ getPoint: () => ({ x, y }), preventDefault: () => {} })
  }
  emitTouchEnd() {
    this._endCb?.()
  }

  // Mini program canvas 不支持 setAttribute / getBoundingClientRect
  updateDimensions(width: number, height: number) {
    this.node.width = width
    this.node.height = height
  }

  getBoundingClientRect() {
    return { left: 0, top: 0, width: this.node.width, height: this.node.height }
  }

  private _mpEvent(evt: any, x: number, y: number): BoundEvent {
    return { getPoint: () => ({ x, y }), preventDefault: () => evt.preventDefault?.() }
  }
}
