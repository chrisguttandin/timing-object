import { TCalculatePositiveRealSolutionFactory } from '../types';

export const createCalculatePositiveRealSolution: TCalculatePositiveRealSolutionFactory = (calculateRealSolutions) => {
    return ({ acceleration, position, velocity }, x) => {
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
};
