import UserStroke from './models/UserStroke';
import Character from './models/Character';
export interface StrokeMatchResultMeta {
    isStrokeBackwards: boolean;
}
export interface StrokeMatchResult {
    isMatch: boolean;
    meta: StrokeMatchResultMeta;
}
export default function strokeMatches(userStroke: UserStroke, character: Character, strokeNum: number, options?: {
    leniency?: number;
    isOutlineVisible?: boolean;
    averageDistanceThreshold?: number;
}): StrokeMatchResult;
