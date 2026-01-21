import { beforeEach, describe, expect, it } from 'vitest';
import { spy, stub } from 'sinon';
import { TimingProvider } from '../../mocks/timing-provider';
import { calculateRealSolutions } from '../../../src/functions/calculate-real-solutions';
import { createCalculateDelta } from '../../../src/factories/calculate-delta';
import { createCalculatePositiveRealSolution } from '../../../src/factories/calculate-positive-real-solution';
import { createCalculateTimeoutDelay } from '../../../src/factories/calculate-timeout-delay';
import { createEventTargetConstructor } from '../../../src/factories/event-target-constructor';
import { createEventTargetFactory } from '../../../src/factories/event-target-factory';
import { createTimingObjectConstructor } from '../../../src/factories/timing-object-constructor';
import { filterTimingStateVectorUpdate } from '../../../src/functions/filter-timing-state-vector-update';
import { translateTimingStateVector } from '../../../src/functions/translate-timing-state-vector';
import { wrapEventListener } from '../../../src/functions/wrap-event-listener';

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
            createEventTargetConstructor(createEventTargetFactory(window), wrapEventListener),
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

        it('should emit a readystatechange event', () => {
            const timingObject = new TimingObject();

            return new Promise((resolve) => {
                timingObject.onreadystatechange = () => {
                    timingObject.onreadystatechange = null;

                    resolve();
                };
            });
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
        describe('without a timingProviderSource', () => {
            it('should default to infinity', () => {
                const timingObject = new TimingObject();

                expect(timingObject.endPosition).to.equal(Number.POSITIVE_INFINITY);
            });

            it('should return the given value', () => {
                const endPosition = 23;
                const timingObject = new TimingObject({}, 12, endPosition);

                expect(timingObject.endPosition).to.equal(endPosition);
            });
        });

        describe('with a timingProviderSource', () => {
            it("should equal the timingProviderSource's endPosition", () => {
                const endPosition = 30;
                const timingProvider = new TimingProvider({ endPosition });
                const timingObject = new TimingObject(timingProvider);

                expect(timingObject.endPosition).to.equal(endPosition);
            });
        });
    });

    describe('onchange', () => {
        describe('without a timingProviderSource', () => {
            let timingObject;

            beforeEach(() => {
                timingObject = new TimingObject();
            });

            it('should be null', () => {
                expect(timingObject.onchange).to.be.null;
            });

            it('should be assignable to a function', () => {
                const fn = () => {}; // eslint-disable-line unicorn/consistent-function-scoping
                const onchange = (timingObject.onchange = fn); // eslint-disable-line no-multi-assign

                expect(onchange).to.equal(fn);
                expect(timingObject.onchange).to.equal(fn);
            });

            it('should be assignable to null', () => {
                const onchange = (timingObject.onchange = null); // eslint-disable-line no-multi-assign

                expect(onchange).to.be.null;
                expect(timingObject.onchange).to.be.null;
            });

            it('should not be assignable to something else', () => {
                const string = 'no function or null value';

                timingObject.onchange = () => {};

                const onchange = (timingObject.onchange = string); // eslint-disable-line no-multi-assign

                expect(onchange).to.equal(string);
                expect(timingObject.onchange).to.be.null;
            });

            it('should register an independent event listener', () => {
                const onchange = spy();

                timingObject.onchange = onchange;
                timingObject.addEventListener('change', onchange);

                timingObject.dispatchEvent(new Event('change'));

                expect(onchange).to.have.been.calledTwice;
            });

            // @todo
        });

        describe('with a timingProviderSource', () => {
            let timingObject;
            let timingProvider;

            beforeEach(() => {
                timingProvider = new TimingProvider({ endPosition: 3, vector: { velocity: 1 } });
                timingObject = new TimingObject(timingProvider);
            });

            it('should pass on a change event', () => {
                timingProvider.dispatchEvent(new Event('change'));

                return new Promise((resolve) => {
                    timingObject.onchange = function (event) {
                        timingObject.onchange = null;

                        expect(event).to.be.an.instanceOf(Event);
                        expect(event.currentTarget).to.equal(timingObject);
                        expect(event.target).to.equal(timingObject);
                        expect(event.type).to.equal('change');

                        expect(this).to.equal(timingObject);

                        resolve();
                    };
                });
            });

            it('should schedule a new timeout event', () => {
                timingProvider.vector = { acceleration: 0, position: 2, velocity: 1 };
                timingProvider.dispatchEvent(new Event('change'));

                return new Promise((resolve) => {
                    timingObject.onchange = () => {
                        timingObject.onchange = null;

                        // The fakeSetTimeout stub gets called thrice because other events use setTimeout as well.
                        expect(fakeSetTimeout).to.have.been.calledThrice;
                        // The second argument specifies the delay.
                        expect(fakeSetTimeout.secondCall.args[1]).to.equal(1);

                        resolve();
                    };
                });
            });
        });
    });

    describe('onerror', () => {
        let timingObject;

        beforeEach(() => {
            timingObject = new TimingObject();
        });

        it('should be null', () => {
            expect(timingObject.onerror).to.be.null;
        });

        it('should be assignable to a function', () => {
            const fn = () => {}; // eslint-disable-line unicorn/consistent-function-scoping
            const onerror = (timingObject.onerror = fn); // eslint-disable-line no-multi-assign

            expect(onerror).to.equal(fn);
            expect(timingObject.onerror).to.equal(fn);
        });

        it('should be assignable to null', () => {
            const onerror = (timingObject.onerror = null); // eslint-disable-line no-multi-assign

            expect(onerror).to.be.null;
            expect(timingObject.onerror).to.be.null;
        });

        it('should not be assignable to something else', () => {
            const string = 'no function or null value';

            timingObject.onerror = () => {};

            const onerror = (timingObject.onerror = string); // eslint-disable-line no-multi-assign

            expect(onerror).to.equal(string);
            expect(timingObject.onerror).to.be.null;
        });

        it('should register an independent event listener', () => {
            const onerror = spy();

            timingObject.onerror = onerror;
            timingObject.addEventListener('error', onerror);

            timingObject.dispatchEvent(new ErrorEvent('error'));

            expect(onerror).to.have.been.calledTwice;
        });
    });

    describe('onreadystatechange', () => {
        describe('without a timingProviderSource', () => {
            let timingObject;

            beforeEach(() => {
                timingObject = new TimingObject();
            });

            it('should be null', () => {
                expect(timingObject.onreadystatechange).to.be.null;
            });

            it('should be assignable to a function', () => {
                const fn = () => {}; // eslint-disable-line unicorn/consistent-function-scoping
                const onreadystatechange = (timingObject.onreadystatechange = fn); // eslint-disable-line no-multi-assign

                expect(onreadystatechange).to.equal(fn);
                expect(timingObject.onreadystatechange).to.equal(fn);
            });

            it('should be assignable to null', () => {
                const onreadystatechange = (timingObject.onreadystatechange = null); // eslint-disable-line no-multi-assign

                expect(onreadystatechange).to.be.null;
                expect(timingObject.onreadystatechange).to.be.null;
            });

            it('should not be assignable to something else', () => {
                const string = 'no function or null value';

                timingObject.onreadystatechange = () => {};

                const onreadystatechange = (timingObject.onreadystatechange = string); // eslint-disable-line no-multi-assign

                expect(onreadystatechange).to.equal(string);
                expect(timingObject.onreadystatechange).to.be.null;
            });

            it('should register an independent event listener', () => {
                const onreadystatechange = spy();

                timingObject.onreadystatechange = onreadystatechange;
                timingObject.addEventListener('readystatechange', onreadystatechange);

                timingObject.dispatchEvent(new Event('readystatechange'));

                expect(onreadystatechange).to.have.been.calledTwice;
            });

            it('should immediately fire an readystatechange event', () => {
                return new Promise((resolve) => {
                    timingObject.onreadystatechange = function (event) {
                        timingObject.onreadystatechange = null;

                        expect(event).to.be.an.instanceOf(Event);
                        expect(event.currentTarget).to.equal(timingObject);
                        expect(event.target).to.equal(timingObject);
                        expect(event.type).to.equal('readystatechange');

                        expect(this).to.equal(timingObject);

                        resolve();
                    };
                });
            });
        });

        describe('with a timingProviderSource', () => {
            let timingObject;
            let timingProvider;

            beforeEach(() => {
                timingProvider = new TimingProvider({ readyState: 'open' });
                timingObject = new TimingObject(timingProvider);
            });

            describe('with a valid transition', () => {
                it('should pass on an readystatechange event', () => {
                    timingProvider.readyState = 'closing';
                    timingProvider.dispatchEvent(new Event('readystatechange'));

                    return new Promise((resolve) => {
                        timingObject.onreadystatechange = function (event) {
                            timingObject.onreadystatechange = null;

                            expect(event).to.be.an.instanceOf(Event);
                            expect(event.currentTarget).to.equal(timingObject);
                            expect(event.target).to.equal(timingObject);
                            expect(event.type).to.equal('readystatechange');

                            expect(this).to.equal(timingObject);

                            resolve();
                        };
                    });
                });

                it('should update the own readyState', () => {
                    timingProvider.readyState = 'closing';
                    timingProvider.dispatchEvent(new Event('readystatechange'));

                    return new Promise((resolve) => {
                        timingObject.onreadystatechange = () => {
                            timingObject.onreadystatechange = null;

                            expect(timingObject.readyState).to.equal(timingProvider.readyState);

                            resolve();
                        };
                    });
                });
            });

            describe('with an invalid transition', () => {
                it('should pass on an readystatechange event', () => {
                    timingProvider.readyState = 'connecting';
                    timingProvider.dispatchEvent(new Event('readystatechange'));

                    return new Promise((resolve) => {
                        timingObject.onreadystatechange = function (event) {
                            timingObject.onreadystatechange = null;

                            expect(event).to.be.an.instanceOf(Event);
                            expect(event.currentTarget).to.equal(timingObject);
                            expect(event.target).to.equal(timingObject);
                            expect(event.type).to.equal('readystatechange');

                            expect(this).to.equal(timingObject);

                            resolve();
                        };
                    });
                });

                it('should set the own readyState to closed', () => {
                    timingProvider.readyState = 'connecting';
                    timingProvider.dispatchEvent(new Event('readystatechange'));

                    return new Promise((resolve) => {
                        timingObject.onreadystatechange = () => {
                            timingObject.onreadystatechange = null;

                            expect(timingObject.readyState).to.equal('closed');

                            resolve();
                        };
                    });
                });

                it('should emit an error event', () => {
                    timingProvider.readyState = 'connecting';
                    timingProvider.dispatchEvent(new Event('readystatechange'));

                    return new Promise((resolve) => {
                        timingObject.onerror = function (event) {
                            timingObject.onerror = null;

                            expect(event).to.be.an.instanceOf(Event);
                            expect(event.currentTarget).to.equal(timingObject);
                            expect(event.target).to.equal(timingObject);
                            expect(event.type).to.equal('error');

                            expect(this).to.equal(timingObject);

                            resolve();
                        };
                    });
                });
            });
        });
    });

    describe('readyState', () => {
        describe('without a timingProviderSource', () => {
            it('should be open', () => {
                const timingObject = new TimingObject();

                expect(timingObject.readyState).to.equal('open');
            });
        });

        describe('with a timingProviderSource', () => {
            it("should equal the timingProviderSource's readyState", () => {
                const readyState = 'a fake readyState';
                const timingProvider = new TimingProvider({ readyState });
                const timingObject = new TimingObject(timingProvider);

                expect(timingObject.readyState).to.equal(readyState);
            });
        });
    });

    describe('startPosition', () => {
        describe('without a timingProviderSource', () => {
            it('should default to negative infinity', () => {
                const timingObject = new TimingObject();

                expect(timingObject.startPosition).to.equal(Number.NEGATIVE_INFINITY);
            });

            it('should return the given value', () => {
                const startPosition = 78;
                const timingObject = new TimingObject({}, startPosition);

                expect(timingObject.startPosition).to.equal(startPosition);
            });
        });

        describe('with a timingProviderSource', () => {
            it("should equal the timingProviderSource's startPosition", () => {
                const startPosition = 30;
                const timingProvider = new TimingProvider({ startPosition });
                const timingObject = new TimingObject(timingProvider);

                expect(timingObject.startPosition).to.equal(startPosition);
            });
        });
    });

    describe('timingProviderSource', () => {
        describe('without a timingProviderSource', () => {
            it('should default to null', () => {
                const timingObject = new TimingObject();

                expect(timingObject.timingProviderSource).to.be.null;
            });
        });

        describe('with a timingProviderSource', () => {
            it('should return the timingProviderSource', () => {
                const timingProvider = new TimingProvider();
                const timingObject = new TimingObject(timingProvider);

                expect(timingObject.timingProviderSource).to.equal(timingProvider);
            });
        });
    });

    describe('addEventListener()', ({ skip }) => {
        skip();
    });

    describe('dispatchEvent()', ({ skip }) => {
        skip();
    });

    describe('query()', () => {
        describe('with a readyState other than open', () => {
            it('should throw an InvalidStateError', () => {
                const error = new Error('a fake error');
                const timingObject = new TimingObject();

                // @todo This is an ugly fix to modify the readyonly property.
                timingObject._readyState = 'anything but open';
                createInvalidStateError.returns(error);

                expect(() => timingObject.query()).to.throw(error);

                expect(createInvalidStateError).to.have.been.calledOnce;
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

            it('should emit a change event', () => {
                timingObject.query();

                return new Promise((resolve) => {
                    timingObject.onchange = () => {
                        timingObject.onchange = null;

                        resolve();
                    };
                });
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

            it('should emit a change event', () => {
                timingObject.query();

                return new Promise((resolve) => {
                    timingObject.onchange = () => {
                        timingObject.onchange = null;

                        resolve();
                    };
                });
            });
        });
    });

    describe('removeEventListener()', ({ skip }) => {
        skip();
    });

    describe('update()', () => {
        describe('without a timingProviderSource', () => {
            describe('with a readyState other than open', () => {
                it('should reject the promise with an InvalidStateError', () => {
                    const error = new Error('a fake error');
                    const timingObject = new TimingObject();

                    // @todo This is an ugly fix to modify the readyonly property.
                    timingObject._readyState = 'anything but open';
                    createInvalidStateError.returns(error);

                    timingObject.update({ velocity: 0 }).then(
                        () => {
                            throw new Error('This should never be called.');
                        },
                        (err) => {
                            expect(err).to.equal(error);

                            expect(createInvalidStateError).to.have.been.calledOnce;
                        }
                    );
                });
            });

            describe('with a vector containing no property values other than null or undefined', () => {
                it('should not emit a change event', () => {
                    const timingObject = new TimingObject();

                    timingObject.update({ acceleration: null, velocity: undefined });

                    return new Promise((resolve, reject) => {
                        timingObject.onchange = () => {
                            timingObject.onchange = null;

                            reject(new Error('This should never be called.'));
                        };

                        // Wait 500 milliseconds to be sure the event listener doesn't get called.
                        setTimeout(() => {
                            timingObject.onchange = null;

                            resolve();
                        }, 500);
                    });
                });
            });

            describe('with a vector containing numeric property values', () => {
                it('should emit a change event', () => {
                    const timingObject = new TimingObject();

                    timingObject.update({ acceleration: 2 });

                    return new Promise((resolve) => {
                        timingObject.onchange = () => {
                            timingObject.onchange = null;

                            resolve();
                        };
                    });
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

                    return timingObject.update({ acceleration: 2 }).then(() => {
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

                    return timingObject.update({ position: 3 }).then(() => {
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

                    return timingObject.update({ velocity: 1 }).then(() => {
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

                    return timingObject.update({ acceleration: 2 }).then(() => {
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

                    return timingObject.update({ position: 5 }).then(() => {
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

                    return timingObject.update({ velocity: 0.5 }).then(() => {
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

                    return timingObject.update({ acceleration: 2 }).then(() => {
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

                    return timingObject.update({ position: 5 }).then(() => {
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

                    return timingObject.update({ velocity: 0.5 }).then(() => {
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
                it('should reject a vector positioned above the endPosition', () => {
                    const error = new Error('a fake error');
                    const timingObject = new TimingObject({ acceleration: 1.5, position: 0, velocity: 1 }, 0, 1);

                    createIllegalValueError.returns(error);

                    timingObject.update({ position: 2 }).then(
                        () => {
                            throw new Error('This should never be called.');
                        },
                        (err) => {
                            expect(err).to.equal(error);

                            expect(createIllegalValueError).to.have.been.calledOnce;
                        }
                    );
                });
            });

            describe('with a given startPosition', () => {
                it('should reject a vector positioned below the startPosition', () => {
                    const error = new Error('a fake error');
                    const timingObject = new TimingObject({ acceleration: 1.5, position: 3, velocity: 1 }, 3, 4);

                    createIllegalValueError.returns(error);

                    timingObject.update({ position: 2 }).then(
                        () => {
                            throw new Error('This should never be called.');
                        },
                        (err) => {
                            expect(err).to.equal(error);

                            expect(createIllegalValueError).to.have.been.calledOnce;
                        }
                    );
                });
            });
        });

        describe('with a timingProviderSource', () => {
            let vector;

            beforeEach(() => {
                vector = { velocity: 0 };
            });

            describe('with a readyState other than open', () => {
                it('should reject the promise with an InvalidStateError', () => {
                    const error = new Error('a fake error');
                    const timingProvider = new TimingProvider({ readyState: 'anything but open' });
                    const timingObject = new TimingObject(timingProvider);

                    createInvalidStateError.returns(error);

                    timingObject.update(vector).then(
                        () => {
                            throw new Error('This should never be called.');
                        },
                        (err) => {
                            expect(err).to.equal(error);

                            expect(createInvalidStateError).to.have.been.calledOnce;
                        }
                    );
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

                    return timingObject.update(vector).then(() => {
                        expect(timingProvider.update).to.have.been.calledOnce;
                        expect(timingProvider.update).to.have.been.calledWithExactly(vector);
                    });
                });

                it("should pass on a promise returned by the timingProviderSource's update() method", () => {
                    const promise = Promise.resolve();

                    timingProvider.update.returns(promise);

                    expect(timingObject.update(vector)).to.equal(promise);
                });

                it('should return a promise rejecting a TypeError', () => {
                    timingProvider.update.returns('anything but a promise');

                    return timingObject.update(vector).then(
                        () => {
                            throw new Error('This should never be called.');
                        },
                        (err) => {
                            expect(err).to.be.an.instanceOf(TypeError);
                        }
                    );
                });
            });
        });
    });
});
