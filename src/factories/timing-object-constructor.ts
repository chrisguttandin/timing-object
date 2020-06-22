import { ITimingObject, ITimingProvider, ITimingStateVector } from '../interfaces';
import { TConnectionState, TErrorEventHandler, TEventHandler, TTimingObjectConstructorFactory, TTimingStateVectorUpdate } from '../types';

export const createTimingObjectConstructor: TTimingObjectConstructorFactory = (
    calculateTimeoutDelay,
    createIllegalValueError,
    createInvalidStateError,
    eventTargetConstructor,
    filterTimingStateVectorUpdate,
    performance,
    setTimeout,
    translateTimingStateVector
) => {
    return class extends eventTargetConstructor implements ITimingObject {
        private _endPosition: number;

        private _onchange: null | [TEventHandler<this>, TEventHandler<this>];

        private _onerror: null | [TErrorEventHandler<this>, TErrorEventHandler<this>];

        private _onreadystatechange: null | [TEventHandler<this>, TEventHandler<this>];

        private _readyState: TConnectionState;

        private _skew: number;

        private _startPosition: number;

        private _timeoutId: null | number;

        private _timingProviderSource: null | ITimingProvider;

        private _vector: ITimingStateVector;

        constructor(timingProviderSource?: ITimingProvider);
        constructor(vector?: TTimingStateVectorUpdate, startPosition?: number, endPosition?: number);
        constructor(timingProviderSourceOrVector = {}, startPosition = Number.NEGATIVE_INFINITY, endPosition = Number.POSITIVE_INFINITY) {
            super();

            const { timingProviderSource, vector } =
                (<ITimingProvider>timingProviderSourceOrVector).update === undefined
                    ? { timingProviderSource: null, vector: <ITimingStateVector>timingProviderSourceOrVector }
                    : { timingProviderSource: <ITimingProvider>timingProviderSourceOrVector, vector: {} };

            this._endPosition = timingProviderSource === null ? endPosition : timingProviderSource.endPosition;
            this._onchange = null;
            this._onerror = null;
            this._onreadystatechange = null;
            this._readyState = timingProviderSource === null ? 'open' : timingProviderSource.readyState;
            this._skew = timingProviderSource === null ? 0 : timingProviderSource.skew;
            this._startPosition = timingProviderSource === null ? startPosition : timingProviderSource.startPosition;
            this._timingProviderSource = timingProviderSource;
            this._timeoutId = null;
            this._vector =
                timingProviderSource === null
                    ? {
                          acceleration: 0,
                          position: 0,
                          velocity: 0,
                          ...filterTimingStateVectorUpdate(vector),
                          timestamp: performance.now() / 1000
                      }
                    : timingProviderSource.vector;

            // @todo The spec doesn't require to check if the endPosition is actually greater than the startPosition.

            if (endPosition < this._vector.position) {
                this._vector = { ...this._vector, acceleration: 0, position: endPosition, velocity: 0 };
            }

            if (startPosition > this._vector.position) {
                this._vector = { ...this._vector, acceleration: 0, position: startPosition, velocity: 0 };
            }

            /*
             * @todo Check if the vector would leave the range immediately.
             * @todo The specification requires to run this._setInternalTimeout() only if the vector had to be modified above but it
             * probably should run in either case.
             * https://webtiming.github.io/timingobject/#x5-1-create-a-new-timing-object
             */
            this._setInternalTimeout();

            if (timingProviderSource === null) {
                setTimeout(() => this.dispatchEvent(new Event('readystatechange')));
            } else {
                const onAdjust = () => {
                    this._skew = timingProviderSource.skew;

                    /*
                     * @todo Process skew change with newSkew as parameter.
                     * https://webtiming.github.io/timingobject/#x5-7-process-skew-change
                     * https://webtiming.github.io/timingobject/#x5-10-calculate-skew-adjustment
                     */
                };
                const onChange = () => this._setInternalVector(timingProviderSource.vector);
                const onReadyStateChange = () => {
                    if (this._isAllowedTransition(timingProviderSource.readyState)) {
                        this._readyState = timingProviderSource.readyState;
                    } else {
                        this._readyState = 'closed';

                        timingProviderSource.removeEventListener('adjust', onAdjust);
                        timingProviderSource.removeEventListener('change', onChange);
                        timingProviderSource.removeEventListener('readystatechange', onReadyStateChange);
                    }

                    if (timingProviderSource.error !== null) {
                        setTimeout(() => this.dispatchEvent(new Event('error')));
                    }

                    setTimeout(() => this.dispatchEvent(new Event('readystatechange')));
                };

                timingProviderSource.addEventListener('adjust', onAdjust);
                timingProviderSource.addEventListener('change', onChange);
                timingProviderSource.addEventListener('readystatechange', onReadyStateChange);
            }
        }

        get endPosition(): number {
            return this._endPosition;
        }

        get onchange(): null | TEventHandler<this> {
            return this._onchange === null ? this._onchange : this._onchange[0];
        }

        set onchange(value) {
            if (this._onchange !== null) {
                this.removeEventListener('change', this._onchange[1]);
            }

            if (typeof value === 'function') {
                const boundListener = value.bind(this);

                this.addEventListener('change', boundListener);

                this._onchange = [value, boundListener];
            } else {
                this._onchange = null;
            }
        }

        get onerror(): null | TErrorEventHandler<this> {
            return this._onerror === null ? this._onerror : this._onerror[0];
        }

        set onerror(value) {
            if (this._onerror !== null) {
                (<ITimingObject>this).removeEventListener('error', this._onerror[1]);
            }

            if (typeof value === 'function') {
                const boundListener = value.bind(this);

                (<ITimingObject>this).addEventListener('error', boundListener);

                this._onerror = [value, boundListener];
            } else {
                this._onerror = null;
            }
        }

        get onreadystatechange(): null | TEventHandler<this> {
            return this._onreadystatechange === null ? this._onreadystatechange : this._onreadystatechange[0];
        }

        set onreadystatechange(value) {
            if (this._onreadystatechange !== null) {
                this.removeEventListener('readystatechange', this._onreadystatechange[1]);
            }

            if (typeof value === 'function') {
                const boundListener = value.bind(this);

                this.addEventListener('readystatechange', boundListener);

                this._onreadystatechange = [value, boundListener];
            } else {
                this._onreadystatechange = null;
            }
        }

        get readyState(): TConnectionState {
            return this._readyState;
        }

        get startPosition(): number {
            return this._startPosition;
        }

        get timingProviderSource(): null | ITimingProvider {
            return this._timingProviderSource;
        }

        public query(): ITimingStateVector {
            if (this._readyState !== 'open') {
                throw createInvalidStateError();
            }

            const timestamp = performance.now() / 1000;

            // @todo Compute the delta by gradually applying the skew.
            const delta =
                this._timingProviderSource === null ? timestamp - this._vector.timestamp : timestamp + this._skew - this._vector.timestamp;
            const vector = translateTimingStateVector(this._vector, delta);

            if (this._endPosition < vector.position || this._startPosition > vector.position) {
                this._setInternalVector({
                    ...vector,
                    acceleration: 0,
                    position: this._endPosition < vector.position ? this._endPosition : this._startPosition,
                    velocity: 0
                });

                return this.query();
            }

            return vector;
        }

        public update(newVector: TTimingStateVectorUpdate): Promise<void> {
            if (this._readyState !== 'open') {
                return Promise.reject(createInvalidStateError());
            }

            if (this._timingProviderSource !== null) {
                const promise = this._timingProviderSource.update(newVector);

                if (promise instanceof Promise) {
                    return promise;
                }

                return Promise.reject(new TypeError('The timingProviderSource failed to return a promise.'));
            }

            const filteredVector = filterTimingStateVectorUpdate(newVector);

            // Return immediately if there is nothing to update.
            if (Object.keys(filteredVector).length === 0) {
                return Promise.resolve();
            }

            const normalizedNewVector = { ...this.query(), ...filteredVector };
            const { position, velocity, acceleration } = normalizedNewVector;

            if (
                position < this._startPosition ||
                position > this._endPosition ||
                (position === this._startPosition && (velocity < 0 || (velocity === 0 && acceleration < 0))) ||
                (position === this._endPosition && (velocity > 0 || (velocity === 0 && acceleration > 0)))
            ) {
                return Promise.reject(createIllegalValueError());
            }

            this._setInternalVector(normalizedNewVector);

            return Promise.resolve();
        }

        private _isAllowedTransition(readyState: TConnectionState): boolean {
            return (
                (this._readyState === 'closing' && readyState === 'closed') ||
                this._readyState === 'connecting' ||
                (this._readyState === 'open' && (readyState === 'closed' || readyState === 'closing'))
            );
        }

        private _setInternalTimeout(): void {
            if (this._timeoutId !== null) {
                clearTimeout(this._timeoutId);
                this._timeoutId = null;
            }

            if (
                (this._endPosition === Number.POSITIVE_INFINITY && this._startPosition === Number.NEGATIVE_INFINITY) ||
                (this._vector.acceleration === 0 && this._vector.velocity === 0)
            ) {
                return;
            }

            const delay = calculateTimeoutDelay(this._vector, this._startPosition, this._endPosition);

            if (delay === null) {
                return;
            }

            this._timeoutId = setTimeout(() => this.query(), delay);
        }

        private _setInternalVector(vector: ITimingStateVector): void {
            this._vector = vector;

            this._setInternalTimeout();

            setTimeout(() => this.dispatchEvent(new Event('change')));
        }
    };
};
