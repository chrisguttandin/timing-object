import { createEventTargetConstructor } from '../../src/factories/event-target-constructor';
import { createEventTargetFactory } from '../../src/factories/event-target-factory';
import { stub } from 'sinon';
import { wrapEventListener } from '../../src/functions/wrap-event-listener';

const DEFAULT_VECTOR = { acceleration: 0, position: 0, velocity: 0 };

export class TimingProvider extends createEventTargetConstructor(createEventTargetFactory(window), wrapEventListener) {

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
