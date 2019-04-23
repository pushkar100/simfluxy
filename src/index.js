import Observer from './observer'
import wait from './wait'
import combineReducers from './combine-reducers'
import utils from './utils'

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
        if (!utils.isObject(initialState)) {
            throw Error('SimFluxy:> initState() expects an object')
        }
        if (!this.initialized) {
            this.state = initialState
            this.initialized = true
            return true
        }
        return false
    }

    dispatch(action) {
        if (!utils.isValidAction(action)) {
            throw Error('SimFluxy:> dispatch() expects an object action where action.type is a string')
        }
        this.state = this.runThroughReducers(this.state, action)
        this.observer.publish(this.state)
    }

    subscribe(handler) {
        if (!utils.isFunction(handler)) {
            throw Error('SimFluxy:> subscribe() expects a function')
        }
        this.observer.subscribe(handler)
        return () => {
            this.observer.unsubscribe(handler)
            return handler
        }
    }

    wait(aPromise, actionType) {
        if (!(utils.isPromise(aPromise) && utils.isString(actionType))) {
            throw Error('SimFluxy:> wait() expects a promise followed by a string')
        }
        wait(aPromise, actionType, this.dispatch)
    }
}

export default Store
