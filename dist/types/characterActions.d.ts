import Stroke from './models/Stroke';
import { ColorObject, RecursivePartial } from './typings/types';
import Character from './models/Character';
import Mutation, { GenericMutation } from './Mutation';
import { CharacterName } from './RenderState';
export declare const showStrokes: (charName: CharacterName, character: Character, duration: number) => GenericMutation[];
export declare const showCharacter: (charName: CharacterName, character: Character, duration: number) => GenericMutation[];
export declare const hideCharacter: (charName: CharacterName, character: Character, duration?: number | undefined) => GenericMutation[];
export declare const updateColor: (colorName: string, colorVal: ColorObject | null, duration: number) => Mutation<{
    state: any;
    updateState(changes: RecursivePartial<any>): void;
}, any>[];
export declare const highlightStroke: (stroke: Stroke, color: ColorObject | null, speed: number) => GenericMutation[];
export declare const animateStroke: (charName: CharacterName, stroke: Stroke, speed: number) => GenericMutation[];
export declare const animateSingleStroke: (charName: CharacterName, character: Character, strokeNum: number, speed: number) => GenericMutation[];
export declare const showStroke: (charName: CharacterName, strokeNum: number, duration: number) => GenericMutation[];
export declare const animateCharacter: (charName: CharacterName, character: Character, fadeDuration: number, speed: number, delayBetweenStrokes: number) => GenericMutation[];
export declare const animateCharacterLoop: (charName: CharacterName, character: Character, fadeDuration: number, speed: number, delayBetweenStrokes: number, delayBetweenLoops: number) => GenericMutation[];
