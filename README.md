# SimFluxy

A simple javascript library implementing the [flux](https://facebook.github.io/flux/) architecture.

## Features

- Unidirectional data flow
- Asynchronous dispatches using `wait(promise, actionType)`
- Supports multiple reducers
- Subscribe to state changes in the store

Simluxy does *not* use any middleware to support asynchronous tasks before dispatch. It exposes a method called `wait()` which dispatches a specified action once the promise argument to it resolves

## Visualization

![Visual](https://i.ibb.co/DgsvjrZ/Screen-Shot-2019-04-23-at-8-32-33-AM.png)

## Installation

**Use: `npm i --save simfluxy`**

## Getting Started

```
// Basic usage:
import Simfluxy from 'simfluxy'

// Initial setup:
const myStore = new Store(reducers) /* reducers: { state property: () => { returns new state property }, } */
myStore.initState(initialState) /* initialState: Plain object */

// Dispatch actions:
myStore.dispatch(action) /* action: { type: string, [<other-props(data)>: { ... }] } */

// Read the state:
myStore.getState()

// Subscribe to state changes:
const unsubscribe = myStore.subscribe(handler) /* handler: a function that receives the state */
unsubscribe() // unsubscribe

// Async: Dispatch promise responses with wait():
myStore.wait(aPromise, actionType) /* promise: An es6 promise that resolves/rejects, actionType: string */
```

## Documentation

- `Store(reducers)`
    - A constructor function that initializes the store
    - `reducers`: A plain object containing keys that reflect the high level store properties. Each key must be a method that receives two parameters:
        - Reference to the initial or existing state
        - An action (String) that specifies the type of `dispatch()`
    - Each reducer returns a new state (without mutating the old one). This new state replaces existing state
    - No explicit return value (`undefined`)
- `getState()`
    - Returns the current state in the store
    - Do not mutate this state. Only use it for read purposes
- `initState(initialState)`
    - `initialState`: Must be a plain object
    - Returns `true` if initialized, else `false`
- `dispatch(action)`
    - `action`: A plain object that contains `type` (String) property indicating the action type. Pass your data through other properties
    - Applies action to all the reducers, and the subscribers get notified with the final state value
    - This method internally publishes the state changes i.e notifies subscribers
    - No explicit return value (`undefined`)
- `subscribe(handler)`
    - `handler`: A function that will receive the state once it gets notified
    - Returns a function to unsubscribe the handler from notifications
- `wait(aPromise, actionType)`
    - `aPromise`: An ES6 promise. The resolved data is sent as payload through an internal `dispatch()`
    - `actionType`: The same string value used with `dispatch()` in order to identify an action
    - No explicit return value (`undefined`)

## FAQs

1. Can we use the library instead of other tools like redux/mobx?

If your use case does not extend beyond simple dispatches and async disptaches, then yes!

2. How is async dispatch handled?

Simfluxy does not use any middleware. You will have to make your async calls via a promise passed to `wait()` which dispatches the resolved response as payload to the action specified

4. How does it handle concurrent async dispatches?

Simfluxy will handle the dispatches in the order they are received. Async dispatches are received in the order that they are triggered, adhering to the race-condition.

We can even have async dispatches within other async dispatches (`wait()` inside `wait()`). Again, the race condition applies here as well

3. What is the size of this library?

It can be considered as a _micro-library_ not exceeding `5KB` (Minified). Gzipping should yield a much smaller size.

## Contributing

Fork repository - https://github.com/pushkar100/simfluxy

**Linting, testing, and code coverage: `npm run validate`**

## Author(s)

Pushkar DK