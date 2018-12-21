import { ITimingObjectConstructor } from '../interfaces';
import { TEventTargetConstructor } from '../types';
import { TIllegalValueErrorFactory } from './illegal-value-error-factory';
import { TInvalidStateErrorFactory } from './invalid-state-error-factory';

export type TTimingObjectConstructorFactory = (
    createIllegalValueError: TIllegalValueErrorFactory,
    createInvalidStateError: TInvalidStateErrorFactory,
    eventTargetConstructor: TEventTargetConstructor,
    performance: Window['performance'],
    setTimeout: Window['setTimeout']
) => ITimingObjectConstructor;
