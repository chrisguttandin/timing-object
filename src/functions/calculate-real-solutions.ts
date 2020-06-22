import { TCalculateRealSolutionsFunction } from '../types';

export const calculateRealSolutions: TCalculateRealSolutionsFunction = (position, velocity, acceleration, x) => {
    // The position is constant.
    if (acceleration === 0 && velocity === 0) {
        if (position !== x) {
            return [];
        }

        return [0];
    }

    // The velocity is constant and not equal to zero.
    if (acceleration === 0) {
        return [(x - position) / velocity];
    }

    // The velocity is accelerated.

    // This equals p/2 of the pq-formula.
    const firstSummand = velocity / acceleration;
    // This equals sqrt((p/2 ** 2) - q) of the pq-formula.
    const secondSummand = Math.sqrt(firstSummand ** 2 - (2 / acceleration) * (position - x));

    return [secondSummand - firstSummand, -(secondSummand + firstSummand)].filter((solution) => !isNaN(solution)).sort();
};
