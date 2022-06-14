import { TConnectionState, TEventHandler, TTimingStateVectorUpdate } from '../types';
import { IEventTarget } from './event-target';
import { ITimingProviderEventMap } from './timing-provider-event-map';
import { ITimingStateVector } from './timing-state-vector';

// @todo It is not specified that the TimingProvider should implement the EventTarget interface.
export interface ITimingProvider extends IEventTarget<ITimingProviderEventMap> {
    readonly endPosition: number;

    // @todo error is not part of the specification.
    readonly error: null | Error;

    // @todo onadjust is not part of the specification.
    onadjust: null | TEventHandler<this>;

    // @todo onchange is not part of the specification.
    onchange: null | TEventHandler<this>;

    // @todo onreadystatechange is not part of the specification.
    onreadystatechange: null | TEventHandler<this>;

    readonly readyState: TConnectionState;

    readonly skew: number;

    readonly startPosition: number;

    readonly vector: ITimingStateVector;

    update(newVector: TTimingStateVectorUpdate): Promise<void>;
}
