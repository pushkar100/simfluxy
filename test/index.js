import { assert } from 'chai'
import Store from '../src/store'
import { actions, reducers } from './test-data'

console.log(Store)
const myStore = new Store(reducers)

describe('Testing Basic Functionality', () => {
    it('Must store a primitive value', () => {
        myStore.dispatch(actions.setCount(1))
        assert.equal(myStore.getState().countAndObject.count, 1)
    })
})