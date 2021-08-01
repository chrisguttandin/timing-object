import { TConnectionState, TErrorEventHandler, TEventHandler, TTimingStateVectorUpdate } from '../types';
import { IEventTarget } from './event-target';
import { ITimingObjectEventMap } from './timing-object-event-map';
import { ITimingProvider } from './timing-provider';
import { ITimingStateVector } from './timing-state-vector';

export interface ITimingObject extends IEventTarget<ITimingObjectEventMap> {
    readonly endPosition: number;

    onchange: null | TEventHandler<this>;

    onerror: null | TErrorEventHandler<this>;

    onreadystatechange: null | TEventHandler<this>;

    // @todo ontimeupdate: null | EventListener;

    readonly readyState: TConnectionState;

    readonly startPosition: number;

    readonly timingProviderSource: null | ITimingProvider;

    query(): ITimingStateVector;

    update(newVector: TTimingStateVectorUpdate): Promise<void>;
}
