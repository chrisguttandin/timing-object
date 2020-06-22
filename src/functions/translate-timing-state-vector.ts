import { TTranslateTimingStateVectorFunction } from '../types';

export const translateTimingStateVector: TTranslateTimingStateVectorFunction = (vector, delta) => {
    const { acceleration, position, timestamp, velocity } = vector;

    return {
        acceleration,
        position: position + velocity * delta + 0.5 * acceleration * delta ** 2,
        timestamp: timestamp + delta,
        velocity: velocity + acceleration * delta
    };
};
