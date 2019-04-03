import { TCalculateDeltaFunction } from './calculate-delta-function';
import { TCalculatePositiveRealSolutionFunction } from './calculate-positive-real-solution-function';

export type TCalculateDeltaFactory = (calculatePositiveRealSolution: TCalculatePositiveRealSolutionFunction) => TCalculateDeltaFunction;
