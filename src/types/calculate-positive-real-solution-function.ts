import { ITimingStateVector } from '../interfaces';

export type TCalculatePositiveRealSolutionFunction = (vector: ITimingStateVector, x: number) => null | number;
