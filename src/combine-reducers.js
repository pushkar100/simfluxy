const combineReducers = (reducers) => {
    const keys = Object.keys(reducers)
    return (initialState = {}, action) => {
        let currentState = initialState
        const newState = {}
        keys.forEach((key) => {
            newState[key] = reducers[key](currentState, action)
            currentState = {
                ...currentState,
                ...newState
            }
        })
        return currentState
    }
}

export default combineReducers
