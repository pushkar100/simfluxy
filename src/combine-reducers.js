import utils from './utils'

const combineReducers = (reducers) => {
    if (!utils.isObject(reducers)) {
        throw Error('SimFlux:> combineReducers() expects an object')
    }
    const keys = Object.keys(reducers)
    keys.forEach((key) => {
        if (!utils.isFunction(reducers[key])) {
            throw Error('SimFlux:> combineReducers() expects each key to be a function')
        }
    })
    return (initialState, action) => {
        let currentState = initialState
        const newState = {}
        keys.forEach((key) => {
            newState[key] = reducers[key](currentState[key], action)
            currentState = {
                ...currentState,
                ...newState
            }
        })
        return currentState
    }
}

export default combineReducers
