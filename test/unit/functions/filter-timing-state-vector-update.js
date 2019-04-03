import { filterTimingStateVectorUpdate } from '../../../src/functions/filter-timing-state-vector-update';

describe('filterTimingStateVectorUpdate()', () => {

    describe('without a given vector', () => {

        it('should return an empty object', () => {
            expect(filterTimingStateVectorUpdate()).to.deep.equal({ });
        });

    });

    describe('with a vector with an acceleration of null', () => {

        let vector;

        beforeEach(() => {
            vector = { acceleration: null };
        });

        it('should return an empty object', () => {
            expect(filterTimingStateVectorUpdate(vector)).to.deep.equal({ });
        });

    });

    describe('with a vector with an acceleration of undefined', () => {

        let vector;

        beforeEach(() => {
            vector = { acceleration: undefined };
        });

        it('should return an empty object', () => {
            expect(filterTimingStateVectorUpdate(vector)).to.deep.equal({ });
        });

    });

    describe('with a vector with an acceleration', () => {

        let acceleration;
        let vector;

        beforeEach(() => {
            acceleration = 2;
            vector = { acceleration };
        });

        it('should return an object with the given acceleration', () => {
            expect(filterTimingStateVectorUpdate(vector)).to.deep.equal({ acceleration });
        });

    });

    describe('with a vector with a position of null', () => {

        let vector;

        beforeEach(() => {
            vector = { position: null };
        });

        it('should return an empty object', () => {
            expect(filterTimingStateVectorUpdate(vector)).to.deep.equal({ });
        });

    });

    describe('with a vector with a position of undefined', () => {

        let vector;

        beforeEach(() => {
            vector = { position: undefined };
        });

        it('should return an empty object', () => {
            expect(filterTimingStateVectorUpdate(vector)).to.deep.equal({ });
        });

    });

    describe('with a vector with a position', () => {

        let position;
        let vector;

        beforeEach(() => {
            position = 5;
            vector = { position };
        });

        it('should return an object with the given position', () => {
            expect(filterTimingStateVectorUpdate(vector)).to.deep.equal({ position });
        });

    });

    describe('with a vector with a velocity of null', () => {

        let vector;

        beforeEach(() => {
            vector = { velocity: null };
        });

        it('should return an empty object', () => {
            expect(filterTimingStateVectorUpdate(vector)).to.deep.equal({ });
        });

    });

    describe('with a vector with a velocity of undefined', () => {

        let vector;

        beforeEach(() => {
            vector = { velocity: undefined };
        });

        it('should return an empty object', () => {
            expect(filterTimingStateVectorUpdate(vector)).to.deep.equal({ });
        });

    });

    describe('with a vector with a velocity', () => {

        let vector;
        let velocity;

        beforeEach(() => {
            velocity = 1;
            vector = { velocity };
        });

        it('should return an object with the given velocity', () => {
            expect(filterTimingStateVectorUpdate(vector)).to.deep.equal({ velocity });
        });

    });

});
