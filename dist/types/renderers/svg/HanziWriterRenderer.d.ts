import CharacterRenderer from './CharacterRenderer';
import UserStrokeRenderer from './UserStrokeRenderer';
import Character from '../../models/Character';
import Positioner from '../../Positioner';
import SVGRenderTarget from './RenderTarget';
import HanziWriterRendererBase from '../HanziWriterRendererBase';
import { RenderStateObject } from '../../RenderState';
export default class HanziWriterRenderer implements HanziWriterRendererBase<SVGElement | SVGSVGElement, SVGRenderTarget> {
    _character: Character;
    _positioner: Positioner;
    _mainCharRenderer: CharacterRenderer;
    _outlineCharRenderer: CharacterRenderer;
    _highlightCharRenderer: CharacterRenderer;
    _userStrokeRenderers: Record<string, UserStrokeRenderer | undefined>;
    _positionedTarget: SVGRenderTarget | undefined;
    constructor(character: Character, positioner: Positioner);
    mount(target: SVGRenderTarget): void;
    render(props: RenderStateObject): void;
    destroy(): void;
}
