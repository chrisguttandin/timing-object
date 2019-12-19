import { TimingProvider } from '../../mocks/timing-provider';
import { calculateRealSolutions } from '../../../src/functions/calculate-real-solutions';
import { createCalculateDelta } from '../../../src/factories/calculate-delta';
import { createCalculatePositiveRealSolution } from '../../../src/factories/calculate-positive-real-solution';
import { createCalculateTimeoutDelay } from '../../../src/factories/calculate-timeout-delay';
import { createEventTargetConstructor } from '../../../src/factories/event-target-constructor';
import { createTimingObjectConstructor } from '../../../src/factories/timing-object-constructor';
import { filterTimingStateVectorUpdate } from '../../../src/functions/filter-timing-state-vector-update';
import { stub } from 'sinon';
import { translateTimingStateVector } from '../../../src/functions/translate-timing-state-vector';

describe('TimingObject', () => {

    let TimingObject;
    let createIllegalValueError;
    let createInvalidStateError;
    let fakePerformance;
    let fakeSetTimeout;

    beforeEach(() => {
        createIllegalValueError = stub();
        createInvalidStateError = stub();
        fakePerformance = { now: stub() };
        fakeSetTimeout = stub();

        fakePerformance.now.returns(16000);
        fakeSetTimeout.callsFake((callback, delay) => setTimeout(callback, delay));

        TimingObject = createTimingObjectConstructor(
            createCalculateTimeoutDelay(createCalculateDelta(createCalculatePositiveRealSolution(calculateRealSolutions))),
            createIllegalValueError,
            createInvalidStateError,
            createEventTargetConstructor(document),
            filterTimingStateVectorUpdate,
            fakePerformance,
            fakeSetTimeout,
            translateTimingStateVector
        );
    });

    describe('constructor()', () => {

        it('should handle a given vector positioned between the startPosition and endPosition', () => {
            const timingObject = new TimingObject({ acceleration: 1.5, position: 2, velocity: 1 }, 1, 3);

            expect(timingObject.query()).to.deep.equal({
                acceleration: 1.5,
                position: 2,
                timestamp: 16,
                velocity: 1
            });
        });

        it('should handle a given vector positioned above the endPosition', () => {
            const timingObject = new TimingObject({ acceleration: 1.5, position: 2, velocity: 1 }, 0, 1);

            expect(timingObject.query()).to.deep.equal({
                acceleration: 0,
                position: 1,
                timestamp: 16,
                velocity: 0
            });
        });

        it('should handle a given vector positioned below the startPosition', () => {
            const timingObject = new TimingObject({ acceleration: 1.5, position: 2, velocity: 1 }, 3, 4);

            expect(timingObject.query()).to.deep.equal({
                acceleration: 0,
                position: 3,
                timestamp: 16,
                velocity: 0
            });
        });

        it('should emit a readystatechange event', (done) => {
            const timingObject = new TimingObject();

            timingObject.onreadystatechange = () => done();
        });

        it('should schedule a timeout event', () => {
            new TimingObject({ position: 2, velocity: 1 }, 1, 3);

            // The fakeSetTimeout stub gets called twice because the event emitter uses setTimeout as well.
            expect(fakeSetTimeout).to.have.been.calledTwice;
            // The second argument specifies the delay.
            expect(fakeSetTimeout.firstCall.args[1]).to.equal(1);
        });

    });

    describe('endPosition', () => {

        describe('with a timingProviderSource', () => {

            it("should equal the timingProviderSource's endPosition", () => {
                const endPosition = 30;
                const timingProvider = new TimingProvider({ endPosition });
                const timingObject = new TimingObject(timingProvider);

                expect(timingObject.endPosition).to.equal(endPosition);
            });

        });

        describe('without a timingProviderSource', () => {

            it('should default to infinity', () => {
                const timingObject = new TimingObject();

                expect(timingObject.endPosition).to.equal(Number.POSITIVE_INFINITY);
            });

            it('should return the given value', () => {
                const endPosition = 23;
                const timingObject = new TimingObject({ }, 12, endPosition);

                expect(timingObject.endPosition).to.equal(endPosition);
            });

        });

    });

    describe('onchange', () => {

        describe('without a timingProviderSource', () => {

            // @todo

        });

        describe('without a timingProviderSource', () => {

            let timingObject;
            let timingProvider;

            beforeEach(() => {
                timingProvider = new TimingProvider({ endPosition: 3, vector: { velocity: 1 } });
                timingObject = new TimingObject(timingProvider);
            });

            it('should pass on a change event', (done) => {
                timingObject.onchange = () => done();

                timingProvider.dispatchEvent(new Event('change'));
            });

            it('should schedule a new timeout event', (done) => {
                timingObject.onchange = () => {
                    // The fakeSetTimeout stub gets called thrice because other events use setTimeout as well.
                    expect(fakeSetTimeout).to.have.been.calledThrice;
                    // The second argument specifies the delay.
                    expect(fakeSetTimeout.secondCall.args[1]).to.equal(1);

                    done();
                };

                timingProvider.vector = { acceleration: 0, position: 2, velocity: 1 };
                timingProvider.dispatchEvent(new Event('change'));
            });

        });

    });

    describe('onreadystatechange', () => {

        describe('without a timingProviderSource', () => {

            it('should immediately fire an readystatechange event', (done) => {
                const timingObject = new TimingObject();

                timingObject.onreadystatechange = () => done();
            });

        });

        describe('without a timingProviderSource', () => {

            let timingObject;
            let timingProvider;

            beforeEach(() => {
                timingProvider = new TimingProvider({ readyState: 'open' });
                timingObject = new TimingObject(timingProvider);
            });

            describe('with a valid transition', () => {

                it('should pass on an readystatechange event', (done) => {
                    timingObject.onreadystatechange = () => done();

                    timingProvider.readyState = 'closing';
                    timingProvider.dispatchEvent(new Event('readystatechange'));
                });

                it('should update the own readyState', (done) => {
                    timingObject.onreadystatechange = () => {
                        expect(timingObject.readyState).to.equal(timingProvider.readyState);

                        done();
                    };

                    timingProvider.readyState = 'closing';
                    timingProvider.dispatchEvent(new Event('readystatechange'));
                });

            });

            describe('with an invalid transition', () => {

                it('should pass on an readystatechange event', (done) => {
                    timingObject.onreadystatechange = () => done();

                    timingProvider.readyState = 'connecting';
                    timingProvider.dispatchEvent(new Event('readystatechange'));
                });

                it('should set the own readyState to closed', (done) => {
                    timingObject.onreadystatechange = () => {
                        expect(timingObject.readyState).to.equal('closed');

                        done();
                    };

                    timingProvider.readyState = 'connecting';
                    timingProvider.dispatchEvent(new Event('readystatechange'));
                });

                it('should emit an error event', (done) => {
                    timingObject.onerror = () => done();

                    timingProvider.readyState = 'connecting';
                    timingProvider.dispatchEvent(new Event('readystatechange'));
                });

            });

        });

    });

    describe('readyState', () => {

        describe('with a timingProviderSource', () => {

            it("should equal the timingProviderSource's readyState", () => {
                const readyState = 'a fake readyState';
                const timingProvider = new TimingProvider({ readyState });
                const timingObject = new TimingObject(timingProvider);

                expect(timingObject.readyState).to.equal(readyState);
            });

        });

        describe('without a timingProviderSource', () => {

            it('should be open', () => {
                const timingObject = new TimingObject();

                expect(timingObject.readyState).to.equal('open');
            });

        });

    });

    describe('startPosition', () => {

        describe('with a timingProviderSource', () => {

            it("should equal the timingProviderSource's startPosition", () => {
                const startPosition = 30;
                const timingProvider = new TimingProvider({ startPosition });
                const timingObject = new TimingObject(timingProvider);

                expect(timingObject.startPosition).to.equal(startPosition);
            });

        });

        describe('without a timingProviderSource', () => {

            it('should default to negative infinity', () => {
                const timingObject = new TimingObject();

                expect(timingObject.startPosition).to.equal(Number.NEGATIVE_INFINITY);
            });

            it('should return the given value', () => {
                const startPosition = 78;
                const timingObject = new TimingObject({ }, startPosition);

                expect(timingObject.startPosition).to.equal(startPosition);
            });

        });

    });

    describe('timingProviderSource', () => {

        describe('with a timingProviderSource', () => {

            it('should return the timingProviderSource', () => {
                const timingProvider = new TimingProvider();
                const timingObject = new TimingObject(timingProvider);

                expect(timingObject.timingProviderSource).to.equal(timingProvider);
            });

        });

        describe('without a timingProviderSource', () => {

            it('should default to null', () => {
                const timingObject = new TimingObject();

                expect(timingObject.timingProviderSource).to.be.null;
            });

        });

    });

    describe('query()', () => {

        describe('with a readyState other than open', () => {

            it('should throw an InvalidStateError', (done) => {
                const error = new Error('a fake error');
                const timingObject = new TimingObject();

                // @todo This is an ugly fix to modify the readyonly property.
                timingObject._readyState = 'anything but open';
                createInvalidStateError.returns(error);

                try {
                    timingObject.query();
                } catch (err) {
                    expect(err).to.equal(error);

                    expect(createInvalidStateError).to.have.been.calledOnce;

                    done();
                }
            });

        });

        describe('with a vector without any movement', () => {

            it('should not move', () => {
                const timingObject = new TimingObject({ position: 2 });

                fakePerformance.now.returns(17000);

                expect(timingObject.query()).to.deep.equal({
                    acceleration: 0,
                    position: 2,
                    timestamp: 17,
                    velocity: 0
                });

                fakePerformance.now.returns(31000);

                expect(timingObject.query()).to.deep.equal({
                    acceleration: 0,
                    position: 2,
                    timestamp: 31,
                    velocity: 0
                });
            });

        });

        describe('with a vector with constant movement', () => {

            it('should move constantly', () => {
                const timingObject = new TimingObject({ position: 2, velocity: 1 });

                fakePerformance.now.returns(17000);

                expect(timingObject.query()).to.deep.equal({
                    acceleration: 0,
                    position: 3,
                    timestamp: 17,
                    velocity: 1
                });

                fakePerformance.now.returns(31000);

                expect(timingObject.query()).to.deep.equal({
                    acceleration: 0,
                    position: 17,
                    timestamp: 31,
                    velocity: 1
                });
            });

        });

        describe('with a vector with accelerated movement', () => {

            it('should move with an accelerated velocity', () => {
                const timingObject = new TimingObject({ acceleration: 1.2, position: 2, velocity: 1 });

                fakePerformance.now.returns(17000);

                expect(timingObject.query()).to.deep.equal({
                    acceleration: 1.2,
                    position: 3.6,
                    timestamp: 17,
                    velocity: 2.2
                });

                fakePerformance.now.returns(31000);

                expect(timingObject.query()).to.deep.equal({
                    acceleration: 1.2,
                    position: 152,
                    timestamp: 31,
                    velocity: 19
                });
            });

        });

        describe('with a given endPosition', () => {

            let timingObject;

            beforeEach(() => {
                timingObject = new TimingObject({ position: 2, velocity: 1.5 }, 1, 3);

                fakePerformance.now.returns(17000);
            });

            it('should stop at the endPosition', () => {
                expect(timingObject.query()).to.deep.equal({
                    acceleration: 0,
                    position: 3,
                    timestamp: 17,
                    velocity: 0
                });

                fakePerformance.now.returns(31000);

                expect(timingObject.query()).to.deep.equal({
                    acceleration: 0,
                    position: 3,
                    timestamp: 31,
                    velocity: 0
                });
            });

            it('should emit a change event', (done) => {
                timingObject.query();

                timingObject.onchange = () => done();
            });

        });

        describe('with a given startPosition', () => {

            let timingObject;

            beforeEach(() => {
                timingObject = new TimingObject({ position: 2, velocity: -1.5 }, 1);

                fakePerformance.now.returns(17000);
            });

            it('should stop at the startPosition', () => {
                expect(timingObject.query()).to.deep.equal({
                    acceleration: 0,
                    position: 1,
                    timestamp: 17,
                    velocity: 0
                });

                fakePerformance.now.returns(31000);

                expect(timingObject.query()).to.deep.equal({
                    acceleration: 0,
                    position: 1,
                    timestamp: 31,
                    velocity: 0
                });
            });

            it('should emit a change event', (done) => {
                timingObject.query();

                timingObject.onchange = () => done();
            });

        });

    });

    describe('update()', () => {

        describe('with a timingProviderSource', () => {

            let vector;

            beforeEach(() => {
                vector = { velocity: 0 };
            });

            describe('with a readyState other than open', () => {

                it('should reject the promise with an InvalidStateError', (done) => {
                    const error = new Error('a fake error');
                    const timingProvider = new TimingProvider({ readyState: 'anything but open' });
                    const timingObject = new TimingObject(timingProvider);

                    createInvalidStateError.returns(error);

                    timingObject
                        .update(vector)
                        .catch((err) => {
                            expect(err).to.equal(error);

                            expect(createInvalidStateError).to.have.been.calledOnce;

                            done();
                        });
                });

            });

            describe('with a readyState that equals open', () => {

                let timingProvider;
                let timingObject;

                beforeEach(() => {
                    timingProvider = new TimingProvider({ readyState: 'open' });
                    timingObject = new TimingObject(timingProvider);
                });

                it("should call the timingProviderSource's update() method", () => {
                    timingProvider.update.resolves();

                    return timingObject
                        .update(vector)
                        .then(() => {
                            expect(timingProvider.update).to.have.been.calledOnce;
                            expect(timingProvider.update).to.have.been.calledWithExactly(vector);
                        });
                });

                it("should pass on a promise returned by the timingProviderSource's update() method", () => {
                    const promise = Promise.resolve();

                    timingProvider.update.returns(promise);

                    expect(timingObject.update(vector)).to.equal(promise);
                });

                it('should return a promise rejecting a TypeError', (done) => {
                    timingProvider.update.returns('anything but a promise');

                    timingObject
                        .update(vector)
                        .catch((err) => {
                            expect(err).to.be.an.instanceOf(TypeError);

                            done();
                        });
                });

            });

        });

        describe('without a timingProviderSource', () => {

            describe('with a readyState other than open', () => {

                it('should reject the promise with an InvalidStateError', (done) => {
                    const error = new Error('a fake error');
                    const timingObject = new TimingObject();

                    // @todo This is an ugly fix to modify the readyonly property.
                    timingObject._readyState = 'anything but open';
                    createInvalidStateError.returns(error);

                    timingObject
                        .update({ velocity: 0 })
                        .catch((err) => {
                            expect(err).to.equal(error);

                            expect(createInvalidStateError).to.have.been.calledOnce;

                            done();
                        });
                });

            });

            describe('with a vector containing no property values other than null or undefined', () => {

                it('should not emit a change event', (done) => {
                    const timingObject = new TimingObject();

                    timingObject.update({ acceleration: null, velocity: undefined });

                    timingObject.onchange = () => done(new Error('This should never be called.'));

                    // Wait 500 milliseconds to be sure the event listener doesn't get called.
                    setTimeout(() => {
                        done();
                    }, 500);
                });

            });

            describe('with a vector containing numeric property values', () => {

                it('should emit a change event', (done) => {
                    const timingObject = new TimingObject();

                    timingObject.update({ acceleration: 2 });

                    timingObject.onchange = () => done();
                });

                it('should schedule a timeout event', () => {
                    const timingObject = new TimingObject({ position: 2, velocity: 1 }, 1, 3);

                    fakeSetTimeout.reset();
                    timingObject.update({ velocity: 2 });

                    // The fakeSetTimeout stub gets called twice because the event emitter uses setTimeout as well.
                    expect(fakeSetTimeout).to.have.been.calledTwice;
                    // The second argument specifies the delay.
                    expect(fakeSetTimeout.firstCall.args[1]).to.equal(0.5);
                });

            });

            describe('with a vector without any movement', () => {

                it('should update the acceleration of the vector', () => {
                    const timingObject = new TimingObject({ position: 2 });

                    fakePerformance.now.returns(17000);

                    return timingObject
                        .update({ acceleration: 2 })
                        .then(() => {
                            expect(timingObject.query()).to.deep.equal({
                                acceleration: 2,
                                position: 2,
                                timestamp: 17,
                                velocity: 0
                            });
                        });
                });

                it('should update the position of the vector', () => {
                    const timingObject = new TimingObject({ position: 2 });

                    fakePerformance.now.returns(17000);

                    return timingObject
                        .update({ position: 3 })
                        .then(() => {
                            expect(timingObject.query()).to.deep.equal({
                                acceleration: 0,
                                position: 3,
                                timestamp: 17,
                                velocity: 0
                            });
                        });
                });

                it('should update the velocity of the vector', () => {
                    const timingObject = new TimingObject({ position: 2 });

                    fakePerformance.now.returns(17000);

                    return timingObject
                        .update({ velocity: 1 })
                        .then(() => {
                            expect(timingObject.query()).to.deep.equal({
                                acceleration: 0,
                                position: 2,
                                timestamp: 17,
                                velocity: 1
                            });
                        });
                });

            });

            describe('with a vector with constant movement', () => {

                it('should update the acceleration of the vector', () => {
                    const timingObject = new TimingObject({ position: 2, velocity: 1 });

                    fakePerformance.now.returns(17000);

                    return timingObject
                        .update({ acceleration: 2 })
                        .then(() => {
                            expect(timingObject.query()).to.deep.equal({
                                acceleration: 2,
                                position: 3,
                                timestamp: 17,
                                velocity: 1
                            });
                        });
                });

                it('should update the position of the vector', () => {
                    const timingObject = new TimingObject({ position: 2, velocity: 1 });

                    fakePerformance.now.returns(17000);

                    return timingObject
                        .update({ position: 5 })
                        .then(() => {
                            expect(timingObject.query()).to.deep.equal({
                                acceleration: 0,
                                position: 5,
                                timestamp: 17,
                                velocity: 1
                            });
                        });
                });

                it('should update the velocity of the vector', () => {
                    const timingObject = new TimingObject({ position: 2, velocity: 1 });

                    fakePerformance.now.returns(17000);

                    return timingObject
                        .update({ velocity: 0.5 })
                        .then(() => {
                            expect(timingObject.query()).to.deep.equal({
                                acceleration: 0,
                                position: 3,
                                timestamp: 17,
                                velocity: 0.5
                            });
                        });
                });

            });

            describe('with a vector with accelerated movement', () => {

                it('should update the acceleration of the vector', () => {
                    const timingObject = new TimingObject({ acceleration: 1.2, position: 2, velocity: 1 });

                    fakePerformance.now.returns(17000);

                    return timingObject
                        .update({ acceleration: 2 })
                        .then(() => {
                            expect(timingObject.query()).to.deep.equal({
                                acceleration: 2,
                                position: 3.6,
                                timestamp: 17,
                                velocity: 2.2
                            });
                        });
                });

                it('should update the position of the vector', () => {
                    const timingObject = new TimingObject({ acceleration: 1.2, position: 2, velocity: 1 });

                    fakePerformance.now.returns(17000);

                    return timingObject
                        .update({ position: 5 })
                        .then(() => {
                            expect(timingObject.query()).to.deep.equal({
                                acceleration: 1.2,
                                position: 5,
                                timestamp: 17,
                                velocity: 2.2
                            });
                        });
                });

                it('should update the velocity of the vector', () => {
                    const timingObject = new TimingObject({ acceleration: 1.2, position: 2, velocity: 1 });

                    fakePerformance.now.returns(17000);

                    return timingObject
                        .update({ velocity: 0.5 })
                        .then(() => {
                            expect(timingObject.query()).to.deep.equal({
                                acceleration: 1.2,
                                position: 3.6,
                                timestamp: 17,
                                velocity: 0.5
                            });
                        });
                });

            });

            describe('with a given endPosition', () => {

                it('should reject a vector positioned above the endPosition', (done) => {
                    const error = new Error('a fake error');
                    const timingObject = new TimingObject({ acceleration: 1.5, position: 0, velocity: 1 }, 0, 1);

                    createIllegalValueError.returns(error);

                    timingObject
                        .update({ position: 2 })
                        .catch((err) => {
                            expect(err).to.equal(error);

                            expect(createIllegalValueError).to.have.been.calledOnce;

                            done();
                        });
                });

            });

            describe('with a given startPosition', () => {

                it('should reject a vector positioned below the startPosition', (done) => {
                    const error = new Error('a fake error');
                    const timingObject = new TimingObject({ acceleration: 1.5, position: 3, velocity: 1 }, 3, 4);

                    createIllegalValueError.returns(error);

                    timingObject
                        .update({ position: 2 })
                        .catch((err) => {
                            expect(err).to.equal(error);

                            expect(createIllegalValueError).to.have.been.calledOnce;

                            done();
                        });
                });

            });

        });

    });

});
