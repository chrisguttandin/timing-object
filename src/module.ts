import { createCalculateDelta } from './factories/calculate-delta';
import { createCalculatePositiveRealSolution } from './factories/calculate-positive-real-solution';
import { createCalculateTimeoutDelay } from './factories/calculate-timeout-delay';
import { createEventTargetConstructor } from './factories/event-target-constructor';
import { createIllegalValueError } from './factories/illegal-value-error';
import { createInvalidStateError } from './factories/invalid-state-error';
import { createTimingObjectConstructor } from './factories/timing-object-constructor';
import { calculateRealSolutions } from './functions/calculate-real-solutions';
import { filterTimingStateVectorUpdate } from './functions/filter-timing-state-vector-update';
import { translateTimingStateVector } from './functions/translate-timing-state-vector';
import { ITimingObjectConstructor } from './interfaces';

/*
 * @todo Explicitly referencing the barrel file seems to be necessary when enabling the
 * isolatedModules compiler option.
 */
export * from './interfaces/index';
export * from './types/index';

export { filterTimingStateVectorUpdate };

const timingObjectConstructor: ITimingObjectConstructor = createTimingObjectConstructor(
    createCalculateTimeoutDelay(createCalculateDelta(createCalculatePositiveRealSolution(calculateRealSolutions))),
    createIllegalValueError,
    createInvalidStateError,
    createEventTargetConstructor(document),
    filterTimingStateVectorUpdate,
    performance,
    setTimeout,
    translateTimingStateVector
);

export { timingObjectConstructor as TimingObject };

// @todo Expose an isSupported flag which checks for performance.now() support.
