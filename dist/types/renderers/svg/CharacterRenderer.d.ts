import StrokeRenderer from './StrokeRenderer';
import SVGRenderTarget from './RenderTarget';
import Character from '../../models/Character';
import { ColorObject } from '../../typings/types';
import { StrokeRenderState } from '../../RenderState';
declare type SvgCharacterRenderProps = {
    opacity: number;
    strokes: Record<number, StrokeRenderState>;
    strokeColor: ColorObject;
    radicalColor?: ColorObject | null;
};
export default class CharacterRenderer {
    _oldProps: SvgCharacterRenderProps | undefined;
    _strokeRenderers: StrokeRenderer[];
    _group: SVGElement | SVGSVGElement | undefined;
    constructor(character: Character);
    mount(target: SVGRenderTarget): void;
    render(props: SvgCharacterRenderProps): void;
}
export {};
