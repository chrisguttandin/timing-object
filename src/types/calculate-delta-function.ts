import { ITimingStateVector } from '../interfaces';

export type TCalculateDeltaFunction = (vector: ITimingStateVector, startPosition: number, endPosition: number) => null | number;
