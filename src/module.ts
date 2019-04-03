import { createEventTargetConstructor } from './factories/event-target-constructor';
import { createIllegalValueError } from './factories/illegal-value-error';
import { createInvalidStateError } from './factories/invalid-state-error';
import { createTimingObjectConstructor } from './factories/timing-object-constructor';
import { filterTimingStateVectorUpdate } from './functions/filter-timing-state-vector-update';
import { ITimingObjectConstructor } from './interfaces';
import { TEventTargetConstructor } from './types';

export * from './interfaces';
export * from './types';

const eventTargetConstructor: TEventTargetConstructor = createEventTargetConstructor(document);

const timingObjectConstructor: ITimingObjectConstructor = createTimingObjectConstructor(
    createIllegalValueError, createInvalidStateError, eventTargetConstructor, filterTimingStateVectorUpdate, performance, setTimeout
);

export { timingObjectConstructor as TimingObject };

// @todo Expose an isSupported flag which checks for performance.now() support.
