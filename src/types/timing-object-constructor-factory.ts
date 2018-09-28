import { IEventTargetConstructor, ITimingObjectConstructor } from '../interfaces';
import { TIllegalValueErrorFactory } from './illegal-value-error-factory';
import { TInvalidStateErrorFactory } from './invalid-state-error-factory';

export type TTimingObjectConstructorFactory = (
    createIllegalValueError: TIllegalValueErrorFactory,
    createInvalidStateError: TInvalidStateErrorFactory,
    eventTargetConstructor: IEventTargetConstructor,
    performance: Window['performance'],
    setTimeout: Window['setTimeout']
) => ITimingObjectConstructor;
