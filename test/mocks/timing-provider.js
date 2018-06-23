import { EventTarget } from '../../src/event-target';
import { stub } from 'sinon';

const DEFAULT_VECTOR = { acceleration: 0, position: 0, velocity: 0 };

export class TimingProvider extends EventTarget {

    constructor (options = { }) {
        super();

        const {
            endPosition = Number.POSITIVE_INFINITY,
            readyState = 'open',
            skew = 0,
            startPosition = Number.NEGATIVE_INFINITY,
            vector = DEFAULT_VECTOR
        } = options;

        this.endPosition = endPosition;
        this.readyState = readyState;
        this.skew = skew;
        this.startPosition = startPosition;
        this.update = stub();
        this.vector = { ...DEFAULT_VECTOR, ...vector };
    }

}
