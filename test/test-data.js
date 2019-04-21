// Action creators:
const setCount = count => ({ type: 'SET_COUNT', payload: count })
const incrementCount = () => ({ type: 'INCREMENT_COUNT' })
const addPropertyBooks = obj => ({ type: 'ADD_PROPERTY_BOOKS', payload: obj })
const updateStats = obj => ({ type: 'UPDATE_STATS', payload: obj })
const removeStats = name => ({ type: 'REMOVE_STAT', payload: name })

// Reducers:
const countAndObjectReducer = (currentState, action) => {
    switch (action.type) {
        case 'SET_COUNT':
            return {...currentState, count: action.payload }
        case 'INCREMENT_COUNT':
            return {...currentState, count: currentState.count + 1 }
        case 'ADD_PROPERTY_BOOKS':
            return {...currentState, books: action.payload }
        default:
            return {...currentState }
    }
}
const statsReducer = (currentState, action) => {
    let newState = {}
    switch (action.type) {
        case 'UPDATE_STATS':
            return {...currentState, ...action.payload }
        case 'REMOVE_STAT':
            newState = {...currentState }
            newState[action.payload] = null
            return newState
        case 'SET_COUNT':
            return {...currentState, count: action.payload }
        default:
            return {...currentState }
    }
}

// Combine actions & reducers' object:
module.exports = {
    actions: {
        setCount,
        incrementCount,
        addPropertyBooks,
        updateStats,
        removeStats
    },
    reducers: {
        countAndObject: countAndObjectReducer,
        stats: statsReducer
    }
}