import { assert } from 'chai'
import Store from '../src/index'
import { actions, reducers } from './test-data'

describe('Testing Initial Setup', () => {
    const myStore = new Store(reducers)

    it('Reducers must be an object whose keys contain functions', () => {
        const invalidReducers = {
            ...reducers,
            poison: 'blue'
        }
        assert.throws(() => new Store(undefined), Error)
        assert.throws(() => new Store(null), Error)
        assert.throws(() => new Store(4), Error)
        assert.throws(() => new Store('Hi'), Error)
        assert.throws(() => new Store([1, 2]), Error)
        assert.throws(() => new Store(() => {}), Error)
        assert.throws(() => new Store(invalidReducers), Error)
    })

    it('Initial State cannot be anything other than an object', () => {
        assert.throws(() => { myStore.initState(undefined) }, Error)
        assert.throws(() => { myStore.initState([1, 2, 'Hi']) }, Error)
        assert.throws(() => { myStore.initState(() => {}) }, Error)
        assert.throws(() => { myStore.initState(() => {}) }, Error)
        assert.throws(() => { myStore.initState(() => {}) }, Error)
        assert.throws(() => { myStore.initState(null) }, Error)
        assert.throws(() => { myStore.initState(5) }, Error)
        assert.throws(() => { myStore.initState('Hello') }, Error)
        assert.throws(() => { myStore.initState(true) }, Error)
    })

    it('Initial State must deep equal object that was passed', () => {
        const initialState = {
            countAndObject: {
                count: 10
            },
            stats: {}
        }
        myStore.initState(initialState)
        assert.deepEqual(myStore.getState(), initialState)
    })

    it('Store cannot be re-initialized with state a second time', () => {
        const newInitialState = {
            countAndObject: {
                count: 5
            },
            stats: {
                x: 'X'
            }
        }
        assert.equal(myStore.initState(newInitialState), false)
    })
})

describe('Basic operations', () => {
    const myStore = new Store(reducers)
    const initialState = {
        countAndObject: {
            count: 10
        },
        stats: {}
    }

    myStore.initState(initialState)

    it('Calling getState() right after intitalizing store must return an object that deep equals the passed initial state', () => {
        assert.deepEqual(myStore.getState(), initialState)
    })

    it('Dispatching an invalid action must throw an error', () => {
        assert.throws(() => { myStore.dispatch(undefined) }, Error)
        assert.throws(() => { myStore.dispatch(1) }, Error)
        assert.throws(() => { myStore.dispatch([1, 2]) }, Error)
        assert.throws(() => {
            myStore.dispatch(() => {})
        }, Error)
        assert.throws(() => { myStore.dispatch(false) }, Error)
    })

    it('Dispatching an action to set a primitive value inside state', () => {
        myStore.dispatch(actions.setCount(5))
        assert.equal(myStore.getState().countAndObject.count, 5)
    })

    it('Dispatching an action to update/modify a primitive value inside state', () => {
        myStore.dispatch(actions.setCount(1))
        myStore.dispatch(actions.incrementCount())
        assert.equal(myStore.getState().countAndObject.count, 2)
    })

    it('Dispatching an action to set an object to a property', () => {
        const object = {
            numBooks: 4,
            fileSizes: [4, 3, 6, 5],
            costs: [200, 99, 199, 299]
        }
        myStore.dispatch(actions.addPropertyBooks(object))
        assert.deepEqual(myStore.getState().countAndObject.books, object)
    })

    it('Dispatching an action that sets a property to null (removes it)', () => {
        const newStats = {
            statName: 'Player Stats',
            watchTime: 0.43,
            numViews: 3,
            quality: '720p'
        }
        myStore.dispatch(actions.updateStats(newStats))
        myStore.dispatch(actions.removeStats('statName'))
        assert.equal(myStore.getState().stats.statName, null)
    })

    it('Multiple reducers listening to the same dispatch action type must all act to reduce the respective state properties', () => {
        const count = 500
        myStore.dispatch(actions.setCount(count))
        const statsCount = myStore.getState().stats.count
        const countAndObjectCount = myStore.getState().countAndObject.count
        assert.equal(countAndObjectCount, 500)
        assert.equal(statsCount, 500)
    })
})

describe('Testing subscription to state changes (pub-sub)', () => {
    const myStore = new Store(reducers)
    const initialState = {
        countAndObject: {
            count: 10
        },
        stats: {}
    }

    myStore.initState(initialState)

    it('Subscribed handler cannot be anything other than a (callback) function', () => {
        assert.throws(() => { myStore.subscribe({}) }, Error)
        assert.throws(() => { myStore.subscribe(undefined) }, Error)
        assert.throws(() => { myStore.subscribe(null) }, Error)
        assert.throws(() => { myStore.subscribe(5) }, Error)
        assert.throws(() => { myStore.subscribe('Hello') }, Error)
        assert.throws(() => { myStore.subscribe([]) }, Error)
        assert.throws(() => { myStore.subscribe(true) }, Error)
    })

    it('Re-subscribing a subscribed handler must return the handler itself', () => {
        const handler = () => {}
        const subbed = myStore.subscribe(handler)
        // Subbed will unsubscribe the subscribed handler and return it
        assert.equal(myStore.subscribe(handler)(), subbed())
    })

    it('Subscribed handler must be notified when state changes', (done) => {
        const handler = (resData) => {
            assert.equal(resData.stats.count, 100)
            assert.equal(resData.countAndObject.count, 100)
            done()
        }
        const count = 100
        myStore.subscribe(handler)
        myStore.dispatch(actions.setCount(count))
    })
})

describe('Unsubscribing', () => {
    const myStore = new Store(reducers)
    const initialState = {
        countAndObject: {
            count: 10
        },
        stats: {}
    }

    myStore.initState(initialState)

    it('Subscribing a handler must return a function (i.e to unsubscribe later)', () => {
        const handler = resData => console.log
        const unsubscribe = myStore.subscribe(handler)
        assert.typeOf(unsubscribe, 'function')
    })

    it('We must not notify a handler that was unsubscribed', (done) => {
        let flag = 1
        const handler = (resData) => {
            // Not calling done() the first time handler executes (when it is still sub'd)
            if (flag === 2) {
                assert.fail('An unsubscribed handler was notified')
                done()
            }
            flag++
        }
        const count = 100
        const unsubscribe = myStore.subscribe(handler)
        myStore.dispatch(actions.setCount(count))

        const countNew = 200
        unsubscribe()
        myStore.dispatch(actions.setCount(countNew))

        // Giving sufficient time for handler to be executed if it wasn't successfully removed:
        setTimeout(() => done(), 1000)
    })
})

describe('Multiple state changes', () => {
    const myStore = new Store(reducers)
    const initialState = {
        countAndObject: {
            count: 10
        },
        stats: {}
    }

    myStore.initState(initialState)

    it('Subscribed handler must be notified of multiple state changes', (done) => {
        let flag = 1
        const count = 100
        const books = {
            numBooks: 4,
            fileSizes: [4, 3, 6, 5],
            costs: [200, 99, 199, 299]
        }

        const handler = (resData) => {
            if (resData.stats.count === count) {
                assert.equal(resData.stats.count, count)
            }
            if (resData.countAndObject.books) {
                assert.equal(resData.countAndObject.books, books)
            }
            if (flag === 2) {
                done()
            }
            flag++
        }

        myStore.subscribe(handler)
        myStore.dispatch(actions.setCount(count))
        myStore.dispatch(actions.addPropertyBooks(books))
    })
})

describe('Basic async checks: wait()', () => {
    const myStore = new Store(reducers)
    const initialState = {
        countAndObject: {
            count: 10
        },
        stats: {}
    }
    myStore.initState(initialState)

    it('wait() function cannot accept anything other than a promise as first parameter', () => {
        assert.throws(() => { myStore.wait(undefined) }, Error)
        assert.throws(() => { myStore.wait(null) }, Error)
        assert.throws(() => { myStore.wait(1) }, Error)
        assert.throws(() => { myStore.wait('Hello') }, Error)
        assert.throws(() => { myStore.wait(false) }, Error)
        assert.throws(() => { myStore.wait({ a: 1 }) }, Error)
        assert.throws(() => { myStore.wait([1, 2]) }, Error)
        assert.throws(() => { myStore.wait(() => {}) }, Error)
        assert.throws(() => { myStore.wait(() => {}) }, Error)
    })

    it('wait() function cannot accept anything other than a string as second parameter', () => {
        assert.throws(() => { myStore.wait(new Promise(), undefined) }, Error)
        assert.throws(() => { myStore.wait(new Promise(), null) }, Error)
        assert.throws(() => { myStore.wait(new Promise(), false) }, Error)
        assert.throws(() => { myStore.wait(new Promise(), { a: 1 }) }, Error)
        assert.throws(() => { myStore.wait(new Promise(), [1]) }, Error)
        assert.throws(() => { myStore.wait(new Promise(), () => {}) }, Error)
        assert.throws(() => { myStore.wait(new Promise(), () => {}) }, Error)
        assert.throws(() => { myStore.wait(new Promise(), new Promise()) }, Error)
    })

    it('wait() must dispatch correctly when promise gets resolved', (done) => {
        const actType = 'SET_COUNT'
        const setCountAfter500ms = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(999)
            }, 500)
        })
        myStore.wait(setCountAfter500ms, actType)
        setTimeout(() => {
            assert.equal(myStore.getState().stats.count, 999)
            done()
        }, 1000)
    })
})

describe('Concurrent async dispatches: wait()', () => {
    const myStore = new Store(reducers)
    const initialState = {
        countAndObject: {
            count: 10
        },
        stats: {}
    }

    myStore.initState(initialState)

    it('Multiple concurrent wait()s must dispatch correctly in the order that the promises get resolved (race)', (done) => {
        const actType = 'SET_COUNT'
        const setCountAfter100ms = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(10)
            }, 100)
        })
        const setCountAfter200ms = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(20)
            }, 200)
        })
        const setCountAfter300ms = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(30)
            }, 300)
        })
        const setCountAfter600ms = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(60)
            }, 600)
        })

        myStore.wait(setCountAfter100ms, actType)
        myStore.wait(setCountAfter200ms, actType)
        myStore.wait(setCountAfter300ms, actType)
        myStore.wait(setCountAfter600ms, actType)

        setTimeout(() => {
            assert.equal(myStore.getState().stats.count, 30)
        }, 450)

        setTimeout(() => {
            assert.equal(myStore.getState().stats.count, 60)
            done()
        }, 1000)
    })
})

describe('Advanced async dispatches: wait()', () => {
    const myStore = new Store(reducers)
    const initialState = {
        countAndObject: {
            count: 10
        },
        stats: {}
    }

    myStore.initState(initialState)

    it('wait() inside a wait() callback - one resolving last must reflect in the state', (done) => {
        const actType = 'SET_COUNT'
        const setCountAfter600ms = new Promise((resolve, reject) => {
            setTimeout(() => {
                // New wait:
                myStore.wait(new Promise((resolve, reject) => {
                    setTimeout(() => {
                        resolve(20)
                    }, 200)
                }), actType)
                resolve(60)
            }, 600)
        })
        myStore.wait(setCountAfter600ms, actType)

        setTimeout(() => {
            assert.equal(myStore.getState().stats.count, 20)
            done()
        }, 1000)
    })
})

describe('Subscribers on async changes: wait()', () => {
    const myStore = new Store(reducers)
    const initialState = {
        countAndObject: {
            count: 10
        },
        stats: {}
    }

    myStore.initState(initialState)

    it('Notify subscriber on wait() dispatch', (done) => {
        const actType = 'SET_COUNT'
        const handler = (data) => {
            assert(data.stats.count, 2222)
            done()
        }
        const setCountAfter200ms = new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(2222)
            }, 200)
        })
        myStore.subscribe(handler)
        myStore.wait(setCountAfter200ms, actType)
    })
})
