import { TFilteredTimingStateVectorUpdate, TTimingStateVectorUpdate } from '../types';

export const filterTimingStateVectorUpdate = (vector?: TTimingStateVectorUpdate): TFilteredTimingStateVectorUpdate => {
    if (vector === undefined) {
        return { };
    }

    let filteredVector: TFilteredTimingStateVectorUpdate = (vector.acceleration !== null && vector.acceleration !== undefined) ?
        { acceleration: vector.acceleration } :
        { };

    if (vector.position !== null && vector.position !== undefined) {
        filteredVector = { ...filteredVector, position: vector.position };
    }

    if (vector.velocity !== null && vector.velocity !== undefined) {
        return { ...filteredVector, velocity: vector.velocity };
    }

    return filteredVector;
};
