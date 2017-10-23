# timing-object

**An implementation of the timing object specification.**

[![tests](https://img.shields.io/travis/chrisguttandin/timing-object/master.svg?style=flat-square)](https://travis-ci.org/chrisguttandin/timing-object)
[![dependencies](https://img.shields.io/david/chrisguttandin/timing-object.svg?style=flat-square)](https://www.npmjs.com/package/timing-object)
[![version](https://img.shields.io/npm/v/timing-object.svg?style=flat-square)](https://www.npmjs.com/package/timing-object)

This is a standalone implementation of the
[TimingObject](http://webtiming.github.io/timingobject/). It comes with an
extensive set of tests. It is written in TypeScript and exposes its types but
that's completely optional.

## Installation

This package is available on [npm](https://www.npmjs.org/package/timing-object).
Simply run the following command to install it:

```shell
npm install timing-object
```

## TimingObject class

The `TimingObject` class can be accessed like this.

```js
import { TimingObject } from 'timing-object';
```

The `TimingObject` implements [the
spec](http://webtiming.github.io/timingobject/#idl-def-timingobject) with one
notable difference. It does not support the [`timeupdate`](http://webtiming.github.io/timingobject/#dom-timingobject-ontimeupdate)
event.

## ITimingProvider interface

Additionally the exported `ITimingProvider` interface can be used to implement a
compatible
[`TimingProvider`](http://webtiming.github.io/timingobject/#idl-def-timingprovider).

```typescript
import { ITimingProvider, TimingObject } from 'timing-object';

class MyCrazyTimingProvider implements ITimingProvider {

    // ... your implementation ...

}
```
