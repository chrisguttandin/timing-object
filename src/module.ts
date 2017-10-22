import { IllegalValueErrorFactory } from './factories/illegal-value-error';
import { InvalidStateErrorFactory } from './factories/invalid-state-error';
import { ITimingObjectConstructor } from './interfaces';
import { timingObjectConstructorFactory } from './timing-object-constructor-factory';

export * from './interfaces';
export * from './types';

const illegalValueErrorFactory = new IllegalValueErrorFactory();
const invalidStateErrorFactory = new InvalidStateErrorFactory();
const timingObjectConstructor: ITimingObjectConstructor = timingObjectConstructorFactory(
    illegalValueErrorFactory, invalidStateErrorFactory, performance, setTimeout
);

export { timingObjectConstructor as TimingObject };

// @todo Expose an isSupported flag which checks for performance.now() support.
