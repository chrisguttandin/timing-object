import { ITimingObjectConstructor, ITimingObjectEventMap } from '../interfaces';
import { TCalculateTimeoutDelayFunction } from './calculate-timeout-delay-function';
import { TEventTargetConstructor } from './event-target-constructor';
import { TFilterTimingStateVectorUpdateFunction } from './filter-timing-state-vector-update-function';
import { TIllegalValueErrorFactory } from './illegal-value-error-factory';
import { TInvalidStateErrorFactory } from './invalid-state-error-factory';
import { TTranslateTimingStateVectorFunction } from './translate-timing-state-vector-function';

export type TTimingObjectConstructorFactory = (
    calculateTimeoutDelay: TCalculateTimeoutDelayFunction,
    createIllegalValueError: TIllegalValueErrorFactory,
    createInvalidStateError: TInvalidStateErrorFactory,
    eventTargetConstructor: TEventTargetConstructor<ITimingObjectEventMap>,
    filterTimingStateVectorUpdate: TFilterTimingStateVectorUpdateFunction,
    performance: Window['performance'],
    setTimeout: Window['setTimeout'],
    translateTimingStateVector: TTranslateTimingStateVectorFunction
) => ITimingObjectConstructor;
