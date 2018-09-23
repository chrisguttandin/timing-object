import { ITimingStateVector } from '../interfaces';

export type TFilteredTimingStateVectorUpdate = Partial<{

    -readonly [ P in keyof Exclude<ITimingStateVector, 'timestamp'> ]: ITimingStateVector[P];

}>;
