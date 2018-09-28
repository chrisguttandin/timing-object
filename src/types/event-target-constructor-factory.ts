import { IEventTargetConstructor } from '../interfaces';

export type TEventTargetConstructorFactory = (document: Window['document']) => IEventTargetConstructor;
