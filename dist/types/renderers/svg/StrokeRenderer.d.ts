import StrokeRendererBase from '../StrokeRendererBase';
import Stroke from '../../models/Stroke';
import SVGRenderTarget from './RenderTarget';
import { ColorObject } from '../../typings/types';
declare type StrokeRenderProps = {
    strokeColor: ColorObject;
    radicalColor: ColorObject | null;
    displayPortion: number;
    opacity: number;
};
/** This is a stroke composed of several stroke parts **/
export default class StrokeRenderer extends StrokeRendererBase {
    _oldProps: StrokeRenderProps | undefined;
    _animationPath: SVGPathElement | undefined;
    _clip: SVGClipPathElement | undefined;
    _strokePath: SVGPathElement | undefined;
    constructor(stroke: Stroke);
    mount(target: SVGRenderTarget): this;
    render(props: StrokeRenderProps): void;
}
export {};
