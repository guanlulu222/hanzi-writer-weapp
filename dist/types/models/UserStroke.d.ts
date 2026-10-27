import { Point } from '../typings/types';
export default class UserStroke {
    id: number;
    points: Point[];
    externalPoints: Point[];
    constructor(id: number, startingPoint: Point, startingExternalPoint: Point);
    appendPoint(point: Point, externalPoint: Point): void;
}
