import calculate from './calculate.js'

const assert = require('assert')

describe('Calculate function', () => {
    describe('should work correctly with basic expression', () => {
        it('2+4-40+8', () => {
            assert.equal(calculate("2 + 4 - 40 + 8"), -26)
        })
        it('2*47+7+8', () => {
            assert.equal(calculate("2 * 47 + 7 + 8"), 109)
        })
        describe('should handle null division', () => {
            it('2/0 + 8*2', () => {
                assert.equal(calculate('2 / 0 + 8 * 2'), null)
            })
        })
        describe('should work with paranthies', () => {
            it('2 * (47 + 7) + 8', () => {
                assert.equal(calculate('2 * (47 + 7) + 8'), 116)
            })
            it('2 * ((47 + 7) + 8)', () => {
                assert.equal(calculate('2 * ((47 + 7) + 8)'), 124)
            })
            it('(2 * 47) + (7 + 8)', () => {
                assert.equal(calculate('(2 * 47) + (7 + 8)'), 109)
            })
        })
        
    })
    describe('should eval sqrt functions or any other function', () => {
        describe('Basic usage function', () => {
            it('sqrt', () => {
                assert.equal(calculate('sqrt(36)'), 6)
            })
            it('log', () => {
                assert.equal(calculate('ln(2)'), Math.log(2))
            })
            it('sin', () => {
                assert.equal(calculate('sin(36)'), Math.sin(36))
            })
        })

    })
})