import { TConnectionState } from '../types';
import { ITimingProvider } from './timing-provider';
import { ITimingStateVector } from './timing-state-vector';
import { ITimingStateVectorUpdate } from './timing-state-vector-update';

export interface ITimingObject extends EventTarget {

    readonly endPosition: number;

    onchange: null | EventListener;

    onerror: null | EventListener;

    onreadystatechange: null | EventListener;

    // @todo ontimeupdate: null | EventListener;

    readonly readyState: TConnectionState;

    readonly startPosition: number;

    readonly timingProviderSource: null | ITimingProvider;

    query (): ITimingStateVector;

    update (newVector: ITimingStateVectorUpdate): Promise<void>;

}
