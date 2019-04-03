import { TCalculateTimeoutDelayFactory } from '../types';

export const createCalculateTimeoutDelay: TCalculateTimeoutDelayFactory = (calculateDelta) => {
    return (vector, startPosition, endPosition) => {
        const delta = calculateDelta(vector, startPosition, endPosition);

        if (delta === null || delta === Number.POSITIVE_INFINITY) {
            return null;
        }

        return delta;
    };
};
