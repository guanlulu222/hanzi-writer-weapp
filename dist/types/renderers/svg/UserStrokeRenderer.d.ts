import { ColorObject, Point } from '../../typings/types';
import SVGRenderTarget from './RenderTarget';
export declare type UserStrokeProps = {
    strokeWidth: number;
    strokeColor: ColorObject;
    opacity: number;
    points: Point[];
};
export default class UserStrokeRenderer {
    _oldProps: UserStrokeProps | undefined;
    _path: SVGElement | undefined;
    mount(target: SVGRenderTarget): void;
    render(props: UserStrokeProps): void;
    destroy(): void;
}
