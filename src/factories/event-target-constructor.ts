import { TEventTargetConstructorFactory } from '../types';

export const createEventTargetConstructor: TEventTargetConstructorFactory = (document) => {

    return class EventTarget {

        private _hijackedParagraph: HTMLElement;

        constructor () {
            this._hijackedParagraph = document.createElement('p');
        }

        public addEventListener (
            type: string,
            listener: EventListenerOrEventListenerObject,
            options?: boolean | AddEventListenerOptions
        ): void {
            this._hijackedParagraph.addEventListener(type, listener, options);
        }

        public dispatchEvent (event: Event): boolean {
            return this._hijackedParagraph.dispatchEvent(event);
        }

        public removeEventListener (
            type: string,
            listener: EventListenerOrEventListenerObject,
            options?: EventListenerOptions | boolean
        ): void {
            this._hijackedParagraph.removeEventListener(type, listener, options);
        }

    };

};
