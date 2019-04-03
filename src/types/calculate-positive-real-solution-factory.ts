import { TCalculatePositiveRealSolutionFunction } from './calculate-positive-real-solution-function';
import { TCalculateRealSolutionsFunction } from './calculate-real-solutions-function';

export type TCalculatePositiveRealSolutionFactory = (
    calculateRealSolutions: TCalculateRealSolutionsFunction
) => TCalculatePositiveRealSolutionFunction;
