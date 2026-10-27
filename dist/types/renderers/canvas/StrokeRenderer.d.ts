import StrokeRendererBase from '../StrokeRendererBase';
import Stroke from '../../models/Stroke';
import { ColorObject, Point } from '../../typings/types';
/** this is a stroke composed of several stroke parts */
export default class StrokeRenderer extends StrokeRendererBase {
    _extendedMaskPoints: Point[];
    _path2D: Path2D | undefined;
    _pathCmd: ((ctx: CanvasRenderingContext2D) => void) | undefined;
    constructor(stroke: Stroke, usePath2D?: boolean);
    render(ctx: CanvasRenderingContext2D, props: {
        opacity: number;
        strokeColor: ColorObject;
        radicalColor?: ColorObject | null;
        displayPortion: number;
    }): void;
}
