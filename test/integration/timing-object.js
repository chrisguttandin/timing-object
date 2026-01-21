import { beforeEach, describe, expect, it } from 'vitest';
import { calculateRealSolutions } from '../../src/functions/calculate-real-solutions';
import { createCalculateDelta } from '../../src/factories/calculate-delta';
import { createCalculatePositiveRealSolution } from '../../src/factories/calculate-positive-real-solution';
import { createCalculateTimeoutDelay } from '../../src/factories/calculate-timeout-delay';
import { createEventTargetConstructor } from '../../src/factories/event-target-constructor';
import { createEventTargetFactory } from '../../src/factories/event-target-factory';
import { createIllegalValueError } from '../../src/factories/illegal-value-error';
import { createInvalidStateError } from '../../src/factories/invalid-state-error';
import { createTimingObjectConstructor } from '../../src/factories/timing-object-constructor';
import { filterTimingStateVectorUpdate } from '../../src/functions/filter-timing-state-vector-update';
import { stub } from 'sinon';
import { translateTimingStateVector } from '../../src/functions/translate-timing-state-vector';
import { wrapEventListener } from '../../src/functions/wrap-event-listener';

describe('TimingObject', () => {
    let TimingObject;
    let fakePerformance;
    let fakeSetTimeout;

    beforeEach(() => {
        fakePerformance = { now: stub() };
        fakeSetTimeout = stub();

        fakeSetTimeout.callsFake((callback, delay) => setTimeout(callback, delay));

        TimingObject = createTimingObjectConstructor(
            createCalculateTimeoutDelay(createCalculateDelta(createCalculatePositiveRealSolution(calculateRealSolutions))),
            createIllegalValueError,
            createInvalidStateError,
            createEventTargetConstructor(createEventTargetFactory(window), wrapEventListener),
            filterTimingStateVectorUpdate,
            fakePerformance,
            fakeSetTimeout,
            translateTimingStateVector
        );
    });

    it('should compute equal values', () => {
        fakePerformance.now.returns(10000);

        const initialVector = { acceleration: -0.4, position: 20, velocity: -1 };
        // Intialize both timingObjects with the same vector.
        const continuousTimingObject = new TimingObject(initialVector);
        const stepwiseTimingObject = new TimingObject(initialVector);

        fakePerformance.now.returns(12500);

        // Make sure both timingObjects return the same vector when calling query().
        expect(continuousTimingObject.query()).to.deep.equal(stepwiseTimingObject.query());

        // Update the stepwiseTimingObject with the current vector to make sure its internal vector changes.
        stepwiseTimingObject.update({ acceleration: -0.4, position: 16.25, velocity: -2 });

        fakePerformance.now.returns(17500);

        // Make sure both timingObjects still return the same vector when calling query().
        expect(continuousTimingObject.query()).to.deep.equal(stepwiseTimingObject.query());

        // Update the stepwiseTimingObject with the current vector to make sure its internal vector changes.
        stepwiseTimingObject.update({ acceleration: -0.4, position: 1.25, velocity: -4 });

        fakePerformance.now.returns(20000);

        // Make sure both timingObjects still return the same vector when calling query().
        expect(continuousTimingObject.query()).to.deep.equal(stepwiseTimingObject.query());
    });
});
