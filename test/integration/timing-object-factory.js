import { IllegalValueErrorFactory } from '../../src/factories/illegal-value-error';
import { InvalidStateErrorFactory } from '../../src/factories/invalid-state-error';
import { stub } from 'sinon';
import { timingObjectConstructorFactory } from '../../src/timing-object-constructor-factory';

describe('TimingObject', () => {

    let TimingObject;
    let fakePerformance;
    let fakeSetTimeout;

    beforeEach(() => {
        const illegalValueErrorFactory = new IllegalValueErrorFactory();
        const invalidStateErrorFactory = new InvalidStateErrorFactory();

        fakePerformance = { now: stub() };
        fakeSetTimeout = stub();

        fakeSetTimeout.callsFake((callback, delay) => setTimeout(callback, delay));

        TimingObject = timingObjectConstructorFactory(illegalValueErrorFactory, invalidStateErrorFactory, fakePerformance, fakeSetTimeout);
    });

    it('should compute equal values', () => {
        fakePerformance.now.returns(10);

        const initialVector = { acceleration: -0.4, position: 20, velocity: -1 };
        // Intialize both timingObjects with the same vector.
        const continuousTimingObject = new TimingObject(initialVector);
        const stepwiseTimingObject = new TimingObject(initialVector);

        fakePerformance.now.returns(12.5);

        // Make sure both timingObjects return the same vector when calling query().
        expect(continuousTimingObject.query()).to.deep.equal(stepwiseTimingObject.query());

        // Update the stepwiseTimingObject with the current vector to make sure its internal vector changes.
        stepwiseTimingObject.update({ acceleration: -0.4, position: 16.25, velocity: -2 });

        fakePerformance.now.returns(17.5);

        // Make sure both timingObjects still return the same vector when calling query().
        expect(continuousTimingObject.query()).to.deep.equal(stepwiseTimingObject.query());

        // Update the stepwiseTimingObject with the current vector to make sure its internal vector changes.
        stepwiseTimingObject.update({ acceleration: -0.4, position: 1.25, velocity: -4 });

        fakePerformance.now.returns(20);

        // Make sure both timingObjects still return the same vector when calling query().
        expect(continuousTimingObject.query()).to.deep.equal(stepwiseTimingObject.query());
    });

});
