import { TFilteredTimingStateVectorUpdate } from './filtered-timing-state-vector-update';

export type TTimingStateVectorUpdate = {

    [ P in keyof TFilteredTimingStateVectorUpdate ]: null | TFilteredTimingStateVectorUpdate[P];

};
