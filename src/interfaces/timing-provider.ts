import { TConnectionState } from '../types';
import { ITimingStateVector } from './timing-state-vector';
import { ITimingStateVectorUpdate } from './timing-state-vector-update';

// @todo It is not specified that the TimingProvider should implement the EventTarget interface.
export interface ITimingProvider extends EventTarget {

    readonly endPosition: number;

    // @todo onadjust is not part of the specification.
    onadjust: null | EventListener;

    // @todo onchange is not part of the specification.
    onchange: null | EventListener;

    // @todo onerror is not part of the specification.
    // @todo onerror: null | EventListener;

    // @todo onreadystatechange is not part of the specification.
    onreadystatechange: null | EventListener;

    // @todo error is not part of the specification.
    readonly error: null | Error;

    readonly readyState: TConnectionState;

    readonly skew: number;

    readonly startPosition: number;

    readonly vector: ITimingStateVector;

    update (newVector: ITimingStateVectorUpdate): Promise<void>;

}
