# timing-object

**An implementation of the timing object specification.**

[![version](https://img.shields.io/npm/v/timing-object.svg?style=flat-square)](https://www.npmjs.com/package/timing-object)

This is a standalone implementation of the
[TimingObject](https://webtiming.github.io/timingobject/). It comes with an
extensive set of tests. It is written in TypeScript and exposes its types but
that's completely optional.

## Installation

This package is available on [npm](https://www.npmjs.org/package/timing-object). Run the following command to install it:

```shell
npm install timing-object
```

## TimingObject class

The `TimingObject` class can be accessed like this.

```js
import { TimingObject } from 'timing-object';
```

The `TimingObject` implements [the
spec](https://webtiming.github.io/timingobject/#idl-def-timingobject) with one
notable difference as mentioned below.

### timeupdate event

The [`timeupdate`](https://webtiming.github.io/timingobject/#dom-timingobject-ontimeupdate)
event is not implemented.

According to the spec it should emit "periodically with [a] fixed frequency [of] 5Hz". Unfortunately there is no way to emit an event in the browser with a constant frequency. Even if it would be possible it would probably only work for very few use cases. For the most part it will either emit too often or not often enough.

Let's say the `timeupdate` should be used to update the user interface. Modern browsers refresh the screen about 60 times per second. Thus an event that emits only 5 times a second will not emit often enough to update the screen every frame. The better alternative is to use `requestAnimationFrame()`. It can be used to schedule a function which runs once per animation frame (at approximately 60Hz).

```js
import { TimingObject } from 'timing-object';

const timingObject = new TimingObject();

requestAnimationFrame(function updateUI() {
    const vector = timingObject.query();

    // ... do something with the vector ...

    requestAnimationFrame(updateUI);
});
```

## ITimingProvider interface

Additionally the exported `ITimingProvider` interface can be used to implement a
compatible
[`TimingProvider`](https://webtiming.github.io/timingobject/#idl-def-timingprovider).

```typescript
import { ITimingProvider, TimingObject } from 'timing-object';

class MyCrazyTimingProvider implements ITimingProvider {
    // ... your implementation ...
}
```

One example of such a TimingProvider is the
[timing-provider package](https://github.com/chrisguttandin/timing-provider). It
uses WebRTC as the underlying communication channel.
