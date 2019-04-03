import { ITimingStateVector } from '../interfaces';

export type TCalculateTimeoutDelayFunction = (
    calculateDelta: ITimingStateVector,
    startPosition: number,
    endPosition: number
) => null | number;
