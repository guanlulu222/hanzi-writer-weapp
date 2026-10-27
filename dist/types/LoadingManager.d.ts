import { CharacterJson, LoadingManagerOptions } from './typings/types';
declare type CustomError = Error & {
    reason: string;
};
export default class LoadingManager {
    _loadCounter: number;
    _isLoading: boolean;
    _resolve: ((data: CharacterJson) => void) | undefined;
    _reject: ((error?: Error | CustomError | string) => void) | undefined;
    _options: LoadingManagerOptions;
    /** Set when calling LoadingManager.loadCharData  */
    _loadingChar: string | undefined;
    /** use this to attribute to determine if there was a problem with loading */
    loadingFailed: boolean;
    constructor(options: LoadingManagerOptions);
    _debouncedLoad(char: string, count: number): void;
    _setupLoadingPromise(): Promise<void | CharacterJson>;
    loadCharData(char: string): Promise<void | CharacterJson>;
}
export {};
