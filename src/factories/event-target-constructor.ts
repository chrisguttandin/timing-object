import { IEventTarget } from '../interfaces';
import { TEventHandler, TEventTargetConstructor, TEventTargetFactory, TNativeEventTarget, TWrapEventListenerFunction } from '../types';

export const createEventTargetConstructor = <EventMap extends Record<string, Event>>(
    createEventTarget: TEventTargetFactory,
    wrapEventListener: TWrapEventListenerFunction
): TEventTargetConstructor<EventMap> => {
    return class EventTarget implements IEventTarget<EventMap> {
        private _listeners: WeakMap<EventListenerOrEventListenerObject, EventListenerOrEventListenerObject>;

        private _nativeEventTarget: TNativeEventTarget;

        constructor() {
            this._listeners = new WeakMap();
            this._nativeEventTarget = createEventTarget();
        }

        public addEventListener(
            type: string,
            listener: null | TEventHandler<this> | EventListenerOrEventListenerObject,
            options?: boolean | AddEventListenerOptions
        ): void {
            if (listener !== null) {
                let wrappedEventListener = this._listeners.get(listener);

                if (wrappedEventListener === undefined) {
                    wrappedEventListener = wrapEventListener(this, listener);

                    if (typeof listener === 'function') {
                        this._listeners.set(listener, wrappedEventListener);
                    }
                }

                this._nativeEventTarget.addEventListener(type, wrappedEventListener, options);
            }
        }

        public dispatchEvent(event: Event): boolean {
            return this._nativeEventTarget.dispatchEvent(event);
        }

        public removeEventListener(
            type: string,
            listener: null | TEventHandler<this> | EventListenerOrEventListenerObject,
            options?: boolean | EventListenerOptions
        ): void {
            const wrappedEventListener = listener === null ? undefined : this._listeners.get(listener);

            this._nativeEventTarget.removeEventListener(type, wrappedEventListener === undefined ? null : wrappedEventListener, options);
        }
    };
};
