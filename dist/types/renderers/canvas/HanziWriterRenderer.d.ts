import Character from '../../models/Character';
import Positioner from '../../Positioner';
import HanziWriterRendererBase from '../HanziWriterRendererBase';
import CanvasRenderTarget from '../canvas/RenderTarget';
import CharacterRenderer from './CharacterRenderer';
import { RenderStateObject } from '../../RenderState';
export default class HanziWriterRenderer implements HanziWriterRendererBase<HTMLCanvasElement, CanvasRenderTarget> {
    _character: Character;
    _positioner: Positioner;
    _mainCharRenderer: CharacterRenderer;
    _outlineCharRenderer: CharacterRenderer;
    _highlightCharRenderer: CharacterRenderer;
    _target: CanvasRenderTarget | undefined;
    constructor(character: Character, positioner: Positioner);
    mount(target: CanvasRenderTarget): void;
    destroy: () => void;
    _animationFrame(cb: (ctx: CanvasRenderingContext2D) => void): void;
    render(props: RenderStateObject): void;
}
