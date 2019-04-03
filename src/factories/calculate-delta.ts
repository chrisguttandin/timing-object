import { TCalculateDeltaFactory } from '../types';

export const createCalculateDelta: TCalculateDeltaFactory = (calculatePositiveRealSolution) => {
    return (vector, startPosition, endPosition) => {
        const deltaToStartPosition = calculatePositiveRealSolution(vector, startPosition);
        const deltaToEndPosition = calculatePositiveRealSolution(vector, endPosition);

        // @todo Is it theoretically possible to have both deltas?
        if (deltaToStartPosition !== null && deltaToEndPosition !== null) {
            if (deltaToStartPosition < deltaToEndPosition) {
                return deltaToStartPosition;
            }

            return deltaToEndPosition;
        }

        if (deltaToStartPosition !== null) {
            return deltaToStartPosition;
        }

        if (deltaToEndPosition !== null) {
            return deltaToEndPosition;
        }

        return null;
    };
};
