export interface ITimingObjectEventMap extends Record<string, Event> {
    change: Event;

    error: ErrorEvent;

    readystatechange: Event;

    // @todo timeupdate: Event;
}
