import { beforeEach, describe, expect, it } from 'vitest';
import { calculateRealSolutions } from '../../../src/functions/calculate-real-solutions';
import { createCalculateDelta } from '../../../src/factories/calculate-delta';
import { createCalculatePositiveRealSolution } from '../../../src/factories/calculate-positive-real-solution';
import { createCalculateTimeoutDelay } from '../../../src/factories/calculate-timeout-delay';

describe('calculateTimeoutDelay', () => {
    let calculateTimeoutDelay;

    beforeEach(() => {
        calculateTimeoutDelay = createCalculateTimeoutDelay(
            createCalculateDelta(createCalculatePositiveRealSolution(calculateRealSolutions))
        );
    });

    describe('without an acceleration', () => {
        describe('with a positive velocity', () => {
            let vector;

            beforeEach(() => {
                vector = { acceleration: 0, position: 20, timestamp: 10, velocity: 1 };
            });

            it('should compute the correct timeout delay', () => {
                const delay = calculateTimeoutDelay(vector, 5, 25);

                expect(delay).to.equal(5);
            });

            it('should compute the correct timeout delay', () => {
                const delay = calculateTimeoutDelay(vector, 20, 40);

                expect(delay).to.equal(20);
            });
        });

        describe('with a negative velocity', () => {
            let vector;

            beforeEach(() => {
                vector = { acceleration: 0, position: 20, timestamp: 10, velocity: -1 };
            });

            it('should compute the correct timeout delay', () => {
                const delay = calculateTimeoutDelay(vector, 5, 25);

                expect(delay).to.equal(15);
            });

            it('should compute the correct timeout delay', () => {
                const delay = calculateTimeoutDelay(vector, 15, 35);

                expect(delay).to.equal(5);
            });
        });
    });

    describe('with a positive acceleration', () => {
        describe('with a positive velocity', () => {
            let vector;

            beforeEach(() => {
                vector = { acceleration: 0.4, position: 20, timestamp: 10, velocity: 1 };
            });

            it('should compute the correct timeout delay', () => {
                const delay = calculateTimeoutDelay(vector, 5, 30);

                expect(delay).to.equal(5);
            });

            it('should compute the correct timeout delay', () => {
                const delay = calculateTimeoutDelay(vector, 20, 50);

                expect(delay).to.equal(10);
            });
        });

        describe('with a negative velocity', () => {
            let vector;

            beforeEach(() => {
                vector = { acceleration: 0.8, position: 20, timestamp: 10, velocity: -1 };
            });

            it('should compute the correct timeout delay', () => {
                const delay = calculateTimeoutDelay(vector, 5, 25);

                expect(delay).to.equal(5);
            });

            it('should compute the correct timeout delay', () => {
                const delay = calculateTimeoutDelay(vector, 15, 35);

                expect(delay).to.equal(7.5);
            });
        });
    });

    describe('with a negative acceleration', () => {
        describe('with a positive velocity', () => {
            let vector;

            beforeEach(() => {
                vector = { acceleration: -0.4, position: 20, timestamp: 10, velocity: 1 };
            });

            it('should compute the correct timeout delay', () => {
                const delay = calculateTimeoutDelay(vector, 10, 25);

                expect(delay).to.equal(10);
            });

            it('should compute the correct timeout delay', () => {
                const delay = calculateTimeoutDelay(vector, 20, 40);

                expect(delay).to.equal(5);
            });
        });

        describe('with a negative velocity', () => {
            let vector;

            beforeEach(() => {
                vector = { acceleration: -0.8, position: 20, timestamp: 10, velocity: -1 };
            });

            it('should compute the correct timeout delay', () => {
                const delay = calculateTimeoutDelay(vector, 5, 25);

                expect(delay).to.equal(5);
            });

            it('should compute the correct timeout delay', () => {
                const delay = calculateTimeoutDelay(vector, 15, 35);

                expect(delay).to.equal(2.5);
            });
        });
    });
});
