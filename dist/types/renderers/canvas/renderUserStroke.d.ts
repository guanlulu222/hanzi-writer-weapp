import { ColorObject, Point } from '../../typings/types';
export default function renderUserStroke(ctx: CanvasRenderingContext2D, props: {
    opacity: number;
    strokeWidth: number;
    strokeColor: ColorObject;
    points: Point[];
}): void;
