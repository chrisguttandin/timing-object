import { ITimingObject } from './timing-object';
import { ITimingProvider } from './timing-provider';
import { ITimingStateVectorUpdate } from './timing-state-vector-update';

export interface ITimingObjectConstructor {

    new (timingProviderSource?: ITimingProvider): ITimingObject;
    new (vector?: ITimingStateVectorUpdate, startPosition?: number, endPosition?: number): ITimingObject;

}
