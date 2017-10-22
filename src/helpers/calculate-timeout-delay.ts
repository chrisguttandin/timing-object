import { ITimingStateVector } from '../interfaces';

const calculateRealSolutions = (position: number, velocity: number, acceleration: number, x: number) => {
    // The position is constant.
    if (acceleration === 0 && velocity === 0) {
        if (position !== x) {
            return [ ];
        }

        return [ 0 ];
    }

    // The velocity is constant and not equal to zero.
    if (acceleration === 0) {
        return [ (x - position) / velocity ];
    }

    // The velocity is accelerated.

    // This equals p/2 of the pq-formula.
    const firstSummand = velocity / acceleration;
    // This equals sqrt((p/2 ** 2) - q) of the pq-formula.
    const secondSummand = Math.sqrt((firstSummand ** 2) - ((2 / acceleration) * (position - x)));

    return [ (secondSummand - firstSummand), -(secondSummand + firstSummand) ]
        .filter((solution) => !isNaN(solution))
        .sort();
};

const calculatePositiveRealSolution = ({ acceleration, position, velocity }: ITimingStateVector, x: number) => {
    const results = calculateRealSolutions(position, velocity, acceleration, x);

    if (results.length === 0) {
        return null;
    }

    if (results.length === 1) {
        if (results[0] > 0) {
            return results[0];
        }

        return null;
    }

    if (results.length === 2) {
        if (results[1] < 0) {
            return null;
        }

        if (results[0] > 0) {
            return results[0];
        }

        if (results[1] > 0) {
            return results[1];
        }
    }

    return null;
};

const calculateDelta = (vector: ITimingStateVector, startPosition: number, endPosition: number) => {
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

export const calculateTimeoutDelay = (vector: ITimingStateVector, startPosition: number, endPosition: number) => {
    const delta = calculateDelta(vector, startPosition, endPosition);

    if (delta === null || delta === Number.POSITIVE_INFINITY) {
        return null;
    }

    return delta;
};
