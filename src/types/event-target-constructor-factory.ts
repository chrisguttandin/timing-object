import { TEventTargetConstructor } from './event-target-constructor';

export type TEventTargetConstructorFactory = (document: Window['document']) => TEventTargetConstructor;
