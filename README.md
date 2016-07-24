# memo-switch
A switch that memorizes state transition events.

![concept.png](https://cureapp.github.io/memo-switch/images/concept.png)
- The switch memorizes all the state transition events.
- From the events, we get state of any time point.


# Install
```sh
npm install memo-switch
```

# Usage
```js
const MemoSwitch = require('memo-switch')

const memoSwitch = MemoSwitch.initialize()

console.log(memoSwitch.isActivated) // false
memoSwitch.toggle()
console.log(memoSwitch.isActivated) // true
```

## for babel|flow users

```js
// @flow
import MemoSwitch from 'memo-switch/jsnext'
```

This way, we can import the module and their type.


## Get state of a time point
```js
const memoSwitch = MemoSwitch.initialize()

const timestamp = new Date().getTime()
console.log(memoSwitch.isActivatedAt(timestamp)) // true

const minuteAgo = new Date().getTime() - 360000
console.log(memoSwitch.isActivatedAt(minuteAgo)) // false
```

## Default state
Set default state to the 1st argument of `MemoSwitch.initialize()`.

```js
const memoSwitch = MemoSwitch.initialize(true)
console.log(memoSwitch.isActivated) // true
```

## Time resolution

We can set time resolution of the events. Default resolution: `MINUTE`.

First, load the Resolutions constants.
```js
const { Resolutions } = MemoSwitch
```

In ES modules,
```js
import MemoSwitch, { Resolutions } from 'memo-switch'
```

Then, set at 2nd argument of `MemoSwitch.initialize()`.
```js
const memoSwitch = MemoSwitch.initialize(false, Resolutions.MILLISECOND)
```

### Available resolutions
- MILLISECOND
- SECOND
- MINUTE
- HOUR
- DAY
- MONTH
- YEAR

## Save/Restore the switch
Just stringify it.

```js
const str = JSON.stringify(memoSwitch)
```

To restore, give the object to constructor.

```js
const obj = JSON.parse(str)
const memoSwitch2 = new MemoSwitch(obj)
```

# LICENSE
MIT
