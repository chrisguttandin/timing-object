import { TEventTargetConstructor } from '../types';

export type TEventTargetConstructorFactory = (document: Window['document']) => TEventTargetConstructor;
