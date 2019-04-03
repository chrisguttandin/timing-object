import { TCalculateDeltaFunction } from './calculate-delta-function';
import { TCalculateTimeoutDelayFunction } from './calculate-timeout-delay-function';

export type TCalculateTimeoutDelayFactory = (calculateDelta: TCalculateDeltaFunction) => TCalculateTimeoutDelayFunction;
