import Observer from './observer'
import wait from './wait'
import combineReducers from './combine-reducers'

class Store {
    constructor(reducers) {
        this.state = {}
        this.observer = new Observer()
        this.initialized = false
        this.dispatch = this.dispatch.bind(this)
        this.runThroughReducers = combineReducers(reducers)
    }

    getState() {
        return this.state
    }

    initState(initialState) {
        if (!this.initialized) {
            this.state = initialState
        }
        this.initialized = true
        return true
    }

    dispatch(action) {
        this.state = this.runThroughReducers(this.state, action)
        this.observer.publish(this.state)
    }

    subscribe(handler) {
        this.observer.subscribe(handler)
    }

    wait(aPromise, actionType) {
        wait(aPromise, actionType, this.dispatch)
    }
}

export default Store
