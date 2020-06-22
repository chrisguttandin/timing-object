import { TTimingStateVectorUpdate } from '../types';
import { ITimingObject } from './timing-object';
import { ITimingProvider } from './timing-provider';

export interface ITimingObjectConstructor {
    new (timingProviderSource?: ITimingProvider): ITimingObject;
    new (vector?: TTimingStateVectorUpdate, startPosition?: number, endPosition?: number): ITimingObject;
}
