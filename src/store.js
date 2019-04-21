import Observer from './observer'
import wait from './wait'

class Store {
    constructor(reducer) {
        this.state = {}
        this.observer = new Observer()
        this.initialized = false
        this.reducer = reducer
        this.dispatch = this.dispatch.bind(this)
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
        this.state = this.reducer(this.state, action)
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
