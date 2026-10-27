import Stroke from '../models/Stroke';
import { ColorObject } from '../typings/types';
export default class StrokeRendererBase {
    _pathLength: number;
    stroke: Stroke;
    static STROKE_WIDTH: number;
    constructor(stroke: Stroke);
    _getStrokeDashoffset(displayPortion: number): number;
    _getColor({ strokeColor, radicalColor, }: {
        strokeColor: ColorObject;
        radicalColor?: ColorObject | null;
    }): ColorObject;
}
