/*
 * @todo This implementation is oversimplified and by far not complete.
 * https://www.w3.org/TR/dom/#interface-eventtarget
 */

export class EventTarget {

    private _listeners: Map<string, Set<EventListener>>;

    constructor () {
        this._listeners = new Map();
    }

    public addEventListener (type: string, listener: EventListener) {
        const listenersOfType = this._listeners.get(type);

        if (listenersOfType === undefined) {
            this._listeners.set(type, new Set([ listener ]));
        } else {
            listenersOfType.add(listener);
        }
    }

    public dispatchEvent (event: Event) {
        const listenersOfType = this._listeners.get(event.type);

        if (listenersOfType !== undefined) {
            listenersOfType.forEach((listener) => listener(event));
        }

        return false;
    }

    public removeEventListener (type: string, listener?: EventListener) {
        const listenersOfType = this._listeners.get(type);

        if (listenersOfType !== undefined) {
            if (listener === undefined)  {
                this._listeners.delete(type);
            } else {
                listenersOfType.delete(listener);
            }
        }
    }

}
