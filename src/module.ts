import { createIllegalValueError } from './factories/illegal-value-error';
import { createInvalidStateError } from './factories/invalid-state-error';
import { createTimingObjectConstructor } from './factories/timing-object-constructor';
import { ITimingObjectConstructor } from './interfaces';

export * from './interfaces';
export * from './types';

const timingObjectConstructor: ITimingObjectConstructor = createTimingObjectConstructor(
    createIllegalValueError, createInvalidStateError, performance, setTimeout
);

export { timingObjectConstructor as TimingObject };

// @todo Expose an isSupported flag which checks for performance.now() support.
