import Character from '../../models/Character';
import { StrokeRenderState } from '../../RenderState';
import { ColorObject } from '../../typings/types';
import StrokeRenderer from './StrokeRenderer';
export default class CharacterRenderer {
    _strokeRenderers: StrokeRenderer[];
    constructor(character: Character);
    render(ctx: CanvasRenderingContext2D, props: {
        opacity: number;
        strokes: Record<number, StrokeRenderState>;
        strokeColor: ColorObject;
        radicalColor?: ColorObject | null;
    }): void;
}
