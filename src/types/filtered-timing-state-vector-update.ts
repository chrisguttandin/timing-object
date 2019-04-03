import { ITimingStateVector } from '../interfaces';

export type TFilteredTimingStateVectorUpdate = Partial<{

    -readonly [ P in Exclude<keyof ITimingStateVector, 'timestamp'> ]: ITimingStateVector[P];

}>;
