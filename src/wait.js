// Thunk expects a promise which resolves with the data or rejects with the error message:
const wait = (aPromise, actionType, dispatch) => aPromise
    .then((response) => {
        dispatch({
            type: actionType,
            payload: response
        })
    })

export default wait
