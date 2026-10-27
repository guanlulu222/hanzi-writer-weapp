import RenderState from './RenderState';
import Positioner from './Positioner';
import Quiz from './Quiz';
import LoadingManager from './LoadingManager';
import Character from './models/Character';
import HanziWriterRendererBase, { HanziWriterRendererConstructor } from './renderers/HanziWriterRendererBase';
import RenderTargetBase from './renderers/RenderTargetBase';
import { ColorOptions, DimensionOptions, HanziWriterOptions, LoadingManagerOptions, OnCompleteFunction, ParsedHanziWriterOptions, QuizOptions, RenderTargetInitFunction } from './typings/types';
export * from './typings/types';
export default class HanziWriter {
    _options: ParsedHanziWriterOptions;
    _loadingManager: LoadingManager;
    /** Only set when calling .setCharacter() */
    _char: string | undefined;
    /** Only set when calling .setCharacter() */
    _renderState: RenderState | undefined;
    /** Only set when calling .setCharacter() */
    _character: Character | undefined;
    /** Only set when calling .setCharacter() */
    _positioner: Positioner | undefined;
    /** Only set when calling .setCharacter() */
    _hanziWriterRenderer: HanziWriterRendererBase<HTMLElement, any> | null | undefined;
    /** Only set when calling .setCharacter() */
    _withDataPromise: Promise<void> | undefined;
    _quiz: Quiz | undefined;
    _renderer: {
        HanziWriterRenderer: HanziWriterRendererConstructor;
        createRenderTarget: RenderTargetInitFunction<any>;
    };
    target: RenderTargetBase;
    /** Main entry point */
    static create(element: string | HTMLElement, character: string, options?: Partial<HanziWriterOptions>): HanziWriter;
    /** Singleton instance of LoadingManager. Only set in `loadCharacterData` */
    static _loadingManager: LoadingManager | null;
    /** Singleton loading options. Only set in `loadCharacterData` */
    static _loadingOptions: Partial<HanziWriterOptions> | null;
    static loadCharacterData(character: string, options?: Partial<LoadingManagerOptions>): Promise<void | import("./typings/types").CharacterJson>;
    static getScalingTransform(width: number, height: number, padding?: number): {
        x: number;
        y: number;
        scale: number;
        transform: string;
    };
    constructor(element: string | HTMLElement, options?: Partial<HanziWriterOptions>);
    showCharacter(options?: {
        onComplete?: OnCompleteFunction;
        duration?: number;
    }): Promise<Promise<{
        canceled: boolean;
    }> | undefined>;
    hideCharacter(options?: {
        onComplete?: OnCompleteFunction;
        duration?: number;
    }): Promise<Promise<{
        canceled: boolean;
    }> | undefined>;
    /**
     * 按当前状态立即重绘一帧，不改变任何显示状态、不触发动画。
     *
     * 微信小程序的 canvas 是原生组件：动画播放中每帧重绘，画布位置能跟随
     * 宿主容器滚动；动画结束后画布停止重绘，宿主 view（overflow 滚动）
     * 滚动时原生层不再修正位置，会出现字形与背景错位。宿主在滚动结束后
     * 调用本方法重绘一帧即可纠正。SVG 渲染器下调用同样幂等无副作用。
     */
    redraw(): Promise<void | undefined>;
    animateCharacter(options?: {
        onComplete?: OnCompleteFunction;
    }): Promise<Promise<{
        canceled: boolean;
    }> | undefined>;
    animateStroke(strokeNum: number, options?: {
        onComplete?: OnCompleteFunction;
    }): Promise<Promise<{
        canceled: boolean;
    }> | undefined>;
    highlightStroke(strokeNum: number, options?: {
        onComplete?: OnCompleteFunction;
    }): Promise<Promise<{
        canceled: boolean;
    }> | undefined>;
    loopCharacterAnimation(): Promise<{
        canceled: boolean;
    } | undefined>;
    pauseAnimation(): Promise<void | undefined>;
    resumeAnimation(): Promise<void | undefined>;
    showOutline(options?: {
        duration?: number;
        onComplete?: OnCompleteFunction;
    }): Promise<Promise<{
        canceled: boolean;
    }> | undefined>;
    hideOutline(options?: {
        duration?: number;
        onComplete?: OnCompleteFunction;
    }): Promise<Promise<{
        canceled: boolean;
    }> | undefined>;
    /** Updates the size of the writer instance without resetting render state */
    updateDimensions({ width, height, padding }: Partial<DimensionOptions>): void;
    updateColor(colorName: keyof ColorOptions, colorVal: string | null, options?: {
        duration?: number;
        onComplete?: OnCompleteFunction;
    }): Promise<Promise<{
        canceled: boolean;
    }> | undefined>;
    quiz(quizOptions?: Partial<QuizOptions>): Promise<Promise<void> | undefined>;
    skipQuizStroke(): void;
    cancelQuiz(): void;
    setCharacter(char: string): Promise<void>;
    _initAndMountHanziWriterRenderer(character: Character): HanziWriterRendererBase<any, any>;
    getCharacterData(): Promise<Character>;
    _assignOptions(options: Partial<HanziWriterOptions>): ParsedHanziWriterOptions;
    /** returns a new options object with width and height filled in if missing */
    _fillWidthAndHeight(options: HanziWriterOptions): ParsedHanziWriterOptions;
    _withData<T>(func: () => T): Promise<T | undefined>;
    _setupListeners(): void;
}
