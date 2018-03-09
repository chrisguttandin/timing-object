import { TIllegalValueErrorFactory, TInvalidStateErrorFactory } from '.';
import { ITimingObjectConstructor } from '../interfaces';

export type TTimingObjectConstructorFactory = (
    createIllegalValueError: TIllegalValueErrorFactory,
    createInvalidStateError: TInvalidStateErrorFactory,
    performance: Window['performance'],
    setTimeout: Window['setTimeout']
) => ITimingObjectConstructor;
