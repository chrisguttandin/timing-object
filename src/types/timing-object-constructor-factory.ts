import { ITimingObjectConstructor } from '../interfaces';
import { TEventTargetConstructor } from '../types';
import { TFilterTimingStateVectorUpdate } from './filter-timing-state-vector-update-function';
import { TIllegalValueErrorFactory } from './illegal-value-error-factory';
import { TInvalidStateErrorFactory } from './invalid-state-error-factory';

export type TTimingObjectConstructorFactory = (
    createIllegalValueError: TIllegalValueErrorFactory,
    createInvalidStateError: TInvalidStateErrorFactory,
    eventTargetConstructor: TEventTargetConstructor,
    filterTimingStateVectorUpdate: TFilterTimingStateVectorUpdate,
    performance: Window['performance'],
    setTimeout: Window['setTimeout']
) => ITimingObjectConstructor;
