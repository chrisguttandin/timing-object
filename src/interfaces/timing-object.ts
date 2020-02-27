import { TConnectionState, TErrorEventHandler, TEventHandler, TNativeEventTarget, TTimingStateVectorUpdate } from '../types';
import { ITimingObjectEventMap } from './timing-object-event-map';
import { ITimingProvider } from './timing-provider';
import { ITimingStateVector } from './timing-state-vector';

export interface ITimingObject extends TNativeEventTarget {

    readonly endPosition: number;

    onchange: null | TEventHandler<this>;

    onerror: null | TErrorEventHandler<this>;

    onreadystatechange: null | TEventHandler<this>;

    // @todo ontimeupdate: null | EventListener;

    readonly readyState: TConnectionState;

    readonly startPosition: number;

    readonly timingProviderSource: null | ITimingProvider;

    addEventListener<K extends keyof ITimingObjectEventMap> (
        type: K,
        listener: (this: this, event: ITimingObjectEventMap[K]) => void,
        options?: boolean | AddEventListenerOptions
    ): void;

    addEventListener (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void;

    query (): ITimingStateVector;

    removeEventListener<K extends keyof ITimingObjectEventMap> (
        type: K,
        listener: (this: this, event: ITimingObjectEventMap[K]) => void,
        options?: boolean | EventListenerOptions
    ): void;

    removeEventListener (type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void;

    update (newVector: TTimingStateVectorUpdate): Promise<void>;

}
