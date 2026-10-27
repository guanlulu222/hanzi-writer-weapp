import { CharacterJson } from './typings/types';
declare const defaultCharDataLoader: (char: string, onLoad: (parsedJson: CharacterJson) => void, onError: (error?: any, context?: any) => void) => void;
export default defaultCharDataLoader;
