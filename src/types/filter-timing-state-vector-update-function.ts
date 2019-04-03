import { TFilteredTimingStateVectorUpdate } from './filtered-timing-state-vector-update';
import { TTimingStateVectorUpdate } from './timing-state-vector-update';

export type TFilterTimingStateVectorUpdate = (vector?: TTimingStateVectorUpdate) => TFilteredTimingStateVectorUpdate;
