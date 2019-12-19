import { ITimingStateVector } from '../interfaces';

export type TTranslateTimingStateVectorFunction = (vector: ITimingStateVector, delta: number) => ITimingStateVector;
