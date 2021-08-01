export interface ITimingProviderEventMap extends Record<string, Event> {
    adjust: Event;

    change: Event;

    // @todo error: ErrorEvent;

    readystatechange: Event;
}
