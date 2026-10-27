import RenderTargetBase from '../RenderTargetBase';
export default class RenderTarget extends RenderTargetBase<SVGSVGElement | SVGElement> {
    static init(elmOrId: Element | string, width?: string, height?: string): RenderTarget;
    svg: SVGSVGElement | SVGElement;
    defs: SVGElement;
    _pt: DOMPoint | undefined;
    constructor(svg: SVGElement | SVGSVGElement, defs: SVGElement);
    createSubRenderTarget(): RenderTarget;
    _getMousePoint(evt: MouseEvent): import("../../HanziWriter").Point;
    _getTouchPoint(evt: TouchEvent): import("../../HanziWriter").Point;
}
