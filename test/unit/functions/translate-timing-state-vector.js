import { beforeEach, describe, expect, it } from 'vitest';
import { translateTimingStateVector } from '../../../src/functions/translate-timing-state-vector';

describe('translateTimingStateVector()', () => {
    describe('with a vector without acceleration and velocity', () => {
        let vector;

        beforeEach(() => {
            vector = { acceleration: 0, position: 2, timestamp: 15, velocity: 0 };
        });

        it('should return a translated vector', () => {
            expect(translateTimingStateVector(vector, 2)).to.deep.equal({ acceleration: 0, position: 2, timestamp: 17, velocity: 0 });
        });
    });

    describe('with a vector without acceleration but with velocity', () => {
        let vector;

        beforeEach(() => {
            vector = { acceleration: 0, position: 2, timestamp: 15, velocity: 2 };
        });

        it('should return a translated vector', () => {
            expect(translateTimingStateVector(vector, 2)).to.deep.equal({ acceleration: 0, position: 6, timestamp: 17, velocity: 2 });
        });
    });

    describe('with a vector with acceleration and velocity', () => {
        let vector;

        beforeEach(() => {
            vector = { acceleration: 1, position: 2, timestamp: 15, velocity: 2 };
        });

        it('should return a translated vector', () => {
            expect(translateTimingStateVector(vector, 2)).to.deep.equal({ acceleration: 1, position: 8, timestamp: 17, velocity: 4 });
        });
    });
});
