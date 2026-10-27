import { StrokeMatchResultMeta } from './strokeMatches';
import UserStroke from './models/UserStroke';
import Positioner from './Positioner';
import Character from './models/Character';
import { ParsedHanziWriterOptions, Point, StrokeData } from './typings/types';
import RenderState from './RenderState';
export default class Quiz {
    _character: Character;
    _renderState: RenderState;
    _isActive: boolean;
    _positioner: Positioner;
    /** Set on startQuiz */
    _options: ParsedHanziWriterOptions | undefined;
    _currentStrokeIndex: number;
    _mistakesOnStroke: number;
    _totalMistakes: number;
    _userStroke: UserStroke | undefined;
    _userStrokesIds: Array<number> | undefined;
    constructor(character: Character, renderState: RenderState, positioner: Positioner);
    startQuiz(options: ParsedHanziWriterOptions): Promise<{
        canceled: boolean;
    }>;
    startUserStroke(externalPoint: Point): void | Promise<{
        canceled: boolean;
    }> | null;
    continueUserStroke(externalPoint: Point): Promise<void> | Promise<{
        canceled: boolean;
    }>;
    setPositioner(positioner: Positioner): void;
    endUserStroke(): void;
    cancel(): void;
    _getStrokeData({ isCorrect, meta, }: {
        isCorrect: boolean;
        meta: StrokeMatchResultMeta;
    }): StrokeData;
    nextStroke(): void;
    _handleSuccess(meta: StrokeMatchResultMeta): void;
    _handleFailure(meta: StrokeMatchResultMeta): void;
    _getCurrentStroke(): import("./models/Stroke").default;
}
